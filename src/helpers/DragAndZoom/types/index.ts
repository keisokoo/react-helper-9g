export type XY = {
  x: number
  y: number
}
export type TRANSFORM_VALUES = {
  scale: number
  rotate: number
  translate: XY
}
export type OutOfBox = {
  x: {
    left: boolean
    right: boolean
  }
  y: {
    top: boolean
    bottom: boolean
  }
}
export type OutOfBoxAll = {
  inner: OutOfBox
  outer: OutOfBox
}

export type MAX_SIZE = {
  x: number
  y: number
  offset: {
    top: number
    left: number
    right: number
    bottom: number
    width: number
    height: number
  }
}
