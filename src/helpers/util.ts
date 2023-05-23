import React from 'react'

/** 클립보드 복사 */
export async function copyToClipboard(text: string): Promise<string> {
  if (window.navigator?.clipboard && window.isSecureContext) {
    return new Promise((res, rej) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          res(text)
        })
        .catch((err) => {
          rej('error')
        })
    })
  } else {
    let El = document.createElement('textarea')
    El.style.position = 'absolute'
    El.style.opacity = '0'
    document.body.appendChild(El)
    El.value = text
    El.focus()
    El.select()
    return new Promise((res, rej) => {
      document.execCommand('copy') ? res(text) : rej('error')
      El.remove()
    })
  }
}

type ObjectWithId = { id: string }

export const getFromStorage = <T>(target: string): T | null => {
  let onStorage = localStorage.getItem(target)
  if (onStorage) {
    return JSON.parse(onStorage) as T
  } else {
    return null
  }
}

export const appendStorageList = <T extends ObjectWithId>(
  target: string,
  value: T,
  limit?: number
): T[] => {
  let onStorage = getFromStorage<T[]>(target)
  let newList = onStorage
    ? onStorage.some((item) => item.id === value.id)
      ? onStorage
      : [...onStorage, value]
    : [value]
  if (limit) {
    newList = newList.reverse().slice(0, limit).reverse()
  }
  localStorage.setItem(target, JSON.stringify(newList))
  return newList
}
export const removeStorageListTarget = <T extends ObjectWithId>(
  target: string,
  id: string
) => {
  let onStorage = getFromStorage<T[]>(target)
  let nextList = onStorage
  if (onStorage) {
    nextList = onStorage.filter((ft) => ft.id !== id)
    localStorage.setItem(target, JSON.stringify(nextList))
    return nextList
  }
  return []
}
/**
 * object key-value 뒤집기 (readonly object만 해당)
 * @param item
 * @returns
 */
export const flipObject = <
  T extends { [key in string | number | symbol]: string | number | symbol }
>(
  item: T
): {
  [K in keyof T as T[K]]: K
} => {
  return Object.keys(item).reduce(
    (prev, curr) => {
      const keysValue = item[curr] as keyof typeof prev
      prev[keysValue] = curr as (typeof prev)[keyof typeof prev]
      return prev
    },
    {} as {
      [K in keyof T as T[K]]: K
    }
  )
}

export function isEllipsisActive(e: any) {
  if (e.children.length > 0) {
    let childArray = [] as boolean[]
    for (let child of e.children) {
      childArray.push(child.offsetWidth < child.scrollWidth)
    }
    return childArray.find((bool) => bool) ? true : false
  } else if (e.offsetWidth && e.scrollWidth) {
    return e.offsetWidth < e.scrollWidth
  } else {
    return false
  }
}

/**
 * ellipsis hover 시 나오는 tooltip 핸들러
 * @param eventType : mouseEnter | mouseLeave
 * @param e : event
 */
export const HandleEllipsisToolTip = (
  eventType: 'mouseEnter' | 'mouseLeave',
  e: React.MouseEvent<HTMLDivElement, MouseEvent>
) => {
  if (eventType === 'mouseEnter') {
    if (
      isEllipsisActive(e.currentTarget) &&
      typeof e.currentTarget.innerText === 'string'
    ) {
      const tooltipElement = document.createElement('span')
      tooltipElement.innerText = e.currentTarget.innerText

      tooltipElement.classList.add('ellipsis-tooltips')
      tooltipElement.onclick = (e) => {
        e.stopPropagation()
      }
      tooltipElement.ondblclick = (e) => {
        e.stopPropagation()
      }
      if (!e.currentTarget.querySelector('.ellipsis-tooltips')) {
        e.currentTarget.appendChild(tooltipElement)
      }
    }
  }
  if (eventType === 'mouseLeave') {
    let tooltipElement = e.currentTarget.querySelector('.ellipsis-tooltips')
    if (tooltipElement) {
      tooltipElement.remove()
    }
  }
}

/**
 * object key type 체크
 * @param obj
 * @param value
 * @returns
 */
export const isObjectKeyType = <T extends object>(
  obj: T,
  value: any
): value is keyof T => {
  return (Object.keys(obj) as string[]).some((v) => v === value)
}

/**
 * object value type 체크
 * @param obj
 * @param value
 * @returns
 */
export const isObjectValueType = <T extends object>(
  obj: T,
  value: any
): value is T[keyof T] => {
  return (Object.values(obj) as string[]).some((v) => v === value)
}

/**
 * 부드럽게 스크롤
 * @param y 이동할 offsetTop
 * @param el HTMLElement
 * @param param2 { duration: number, offset: number }
 * @returns
 */
export const smoothScrollTo = (
  y: number,
  el: HTMLElement | Window = window,
  { duration = 500, offset = 0 }: { duration?: number; offset?: number } = {}
): Promise<number> => {
  const isWindow = (value: any): value is Window => {
    return typeof value.scrollY === 'number'
  }
  const easeOutCubic = (t: number) => --t * t * t + 1
  const startY = isWindow(el) ? el.scrollY : el.scrollTop
  const difference = y - startY
  const startTime = performance.now()

  if (y === startY + offset) {
    return Promise.resolve(y)
  }

  return new Promise((resolve) => {
    const step = () => {
      const progress = (performance.now() - startTime) / duration
      const amount = easeOutCubic(progress)
      el.scrollTo({ top: startY + amount * difference - offset })
      if (progress < 0.99) {
        window.requestAnimationFrame(step)
      } else {
        resolve(y)
      }
    }
    step()
  })
}

/** 천단위 쉼표 */
export const thousand = (num?: number | string, decimalCount?: number) => {
  if (!num || !Number(num)) num = 0
  if (typeof num === 'string') num = Number(num)
  if (decimalCount !== undefined) num = Number(num.toFixed(decimalCount))
  return new Intl.NumberFormat('ko-KR').format(num)
}

/**
 * input 숫자만 받아야 할 경우
 * @param value 새로 들어온 Input value
 * @param preValue 직전의 Input value
 */
const numberRegex = /^[0-9]+$/
export const onInputNumber = (value: string, preValue: string) => {
  if (value.match(numberRegex) || value === '') return value
  return preValue
}

// 숫자가 10 미만이면 앞에 0을 붙여주는 함수
export function addZero(num: number) {
  let numString = String(num)
  if (num < 10) {
    numString = '0' + num
  } else {
    numString = String(num)
  }
  return numString
}

/**
 * object keys 를 타입에 맞게 실행
 *
 * @template T
 * @param {T} value
 * @return {*}  {(keyof T)[]}
 */
export const objectKeys = <T extends object, K extends keyof T>(
  value: T
): K[] => {
  return Object.keys(value) as K[]
}

// 5분 간격으로 HH:MM 배열 만드는 함수
export function timeArray() {
  var timeArray = []
  for (var i = 0; i < 24; i++) {
    for (var j = 0; j < 60; j += 5) {
      var time = addZero(i) + ':' + addZero(j)
      timeArray.push(time)
    }
  }
  return timeArray
}
