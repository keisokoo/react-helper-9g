export type XY = {
  x: number
  y: number
}
export type TRANSFORM_VALUES = {
  scale: number
  rotate: number
  translate: XY
}
type OutValue = {
  out: boolean
  value: number
}
export type OutOfBox = {
  x: {
    left: OutValue
    right: OutValue
  }
  y: {
    top: OutValue
    bottom: OutValue
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
