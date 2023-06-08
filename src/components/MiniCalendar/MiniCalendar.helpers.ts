export const isTouchEvent = (e: any): e is React.TouchEvent<HTMLDivElement> => {
  return e.touches !== undefined
}
