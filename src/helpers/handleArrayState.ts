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
  updateItem:
    | ((value: T) => Partial<Exclude<T, 'id'>>)
    | Partial<Exclude<T, 'id'>>
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
