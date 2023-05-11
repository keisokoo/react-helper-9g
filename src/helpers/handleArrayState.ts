import { clone } from 'lodash-es'

export const replaceItemAtIndex = <T>(
  arr: T[],
  index: number,
  newValue: T
): T[] => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)]
}

export const updateObjectArrayItemAtIndex = <T extends object>(
  arr: T[],
  index: number,
  updateItem: ((value: T) => Partial<T>) | Partial<T>
) => {
  const newItem =
    typeof updateItem === 'function' ? updateItem(arr[index]) : updateItem
  return [
    ...arr.slice(0, index),
    { ...arr[index], ...newItem },
    ...arr.slice(index + 1),
  ]
}

export const updateObjectArrayItemById = <T extends { id: number | string }>(
  arr: T[],
  id: number | string,
  updateItem: ((value: T) => Partial<T>) | Partial<T>
) => {
  const index = arr.findIndex((item) => item.id === id)
  if (index < 0) return arr
  const newItem =
    typeof updateItem === 'function' ? updateItem(arr[index]) : updateItem
  return [
    ...arr.slice(0, index),
    { ...arr[index], ...newItem },
    ...arr.slice(index + 1),
  ]
}

export const removeItemAtIndex = <T>(arr: T[], index: number): T[] => {
  return [...arr.slice(0, index), ...arr.slice(index + 1)]
}

/**
 * 해당 위치에 값을 변경(추가) 뒤의 값은 날림
 * @param array
 * @param index
 * @param elementsArray
 * @returns
 */
export const updateAndDeleteBehind = <T>(
  array: T[],
  index: number,
  ...elementsArray: T[]
) => {
  let newArray = clone(array)
  newArray.splice(index, 0, ...elementsArray)
  return newArray.slice(0, index + 1)
}

/**
 * 해당 위치에 값을 추가
 * @param array
 * @param index
 * @param elementsArray
 * @returns
 */
export const appendAt = <T>(array: T[], index: number, item: T) => {
  let newArray = clone(array)
  return [
    ...newArray.slice(0, index),
    item,
    ...newArray.slice(index, array.length),
  ]
}
/**
 * 해당 위치에 값을 변경
 * @param array
 * @param index
 * @param elementsArray
 * @returns
 */
export const replaceAt = <T>(array: T[], index: number, item: T) => {
  let newArray = clone(array)
  return [
    ...newArray.slice(0, index - 1),
    item,
    ...newArray.slice(index + 1, array.length),
  ]
}

/**
 * value가 undefined 인걸 뺸다.
 * @param value
 * @returns
 */
export const removeUndefined = <T extends object>(
  value: T,
  removeValue?: string
): Partial<T> => {
  const keyArray = Object.keys(value) as Array<keyof T>
  return keyArray.reduce((prev, curr) => {
    if (value[curr] === removeValue) return prev
    if (value[curr] !== undefined && value[curr] !== '')
      prev[curr] = value[curr]
    return prev
  }, {} as Partial<T>)
}

export const updateObjectArray = <T extends { id: string | number }>(
  prev: T[],
  updatedItem: Partial<T>,
  identifier: keyof T = 'id'
) => {
  if (updatedItem) {
    if (
      Object.keys(updatedItem).length === 1 &&
      updatedItem[identifier] !== undefined
    ) {
      return prev.filter((item) => {
        return updatedItem && item[identifier] !== updatedItem[identifier]
      })
    }
    return prev.map((item) => {
      return updatedItem && item[identifier] === updatedItem[identifier]
        ? { ...item, ...updatedItem }
        : item
    })
  }
  return prev
}
