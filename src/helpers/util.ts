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
