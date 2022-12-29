import { TRANSFORM_VALUES } from '../types'

export const isTransformValues = (value: any): value is TRANSFORM_VALUES => {
  return (
    value !== undefined &&
    'translate' in value &&
    'rotate' in value &&
    'scale' in value
  )
}
export const handleGetCurrentPoint = (
  targetElement: HTMLElement,
  point: number,
  scale: number
) => {
  const rec = targetElement.getBoundingClientRect()
  return (point - rec.left) / scale
}
export const handleGetBeforeTargetSize = (
  targetElement: HTMLElement,
  scale: number
) => {
  const rec = targetElement.getBoundingClientRect()
  return {
    w: Math.round(rec.width / scale),
    h: Math.round(rec.height / scale),
  }
}
export const handleGetPointBasedOnFactor = (
  point: number,
  factor: number,
  size: number
) => {
  return -(point * factor * 2) + size * factor
}
export const isTouchEvent = (
  event: any
): event is TouchEvent | React.TouchEvent => {
  return 'touches' in event
}
export const handleGetRectSize = (
  targetElement: HTMLElement,
  option: {
    type?: 'inner' | 'outer'
    threshold?: number
  } = {
    type: 'inner',
    threshold: 0,
  },
  eventElement?: HTMLElement
) => {
  let bound = eventElement
    ? eventElement.getBoundingClientRect()
    : document.body.getBoundingClientRect()
  let targetBound = targetElement.getBoundingClientRect()

  const areaType = option.type === 'inner' ? 1 : -1
  const threshold = option.threshold ?? 0
  const rectSize = {
    w: targetBound.width * areaType,
    h: targetBound.height * areaType,
  }
  const maxSize = {
    x: bound.width / 2 - rectSize.w / 2 + threshold,
    y: bound.height / 2 - rectSize.h / 2 + threshold,
  }
  return {
    rectSize,
    maxSize,
  }
}

export const handleCheckBoxLimit = (
  targetElement: HTMLElement,
  currentPosition: { x: number; y: number },
  type: 'inner' | 'outer',
  eventElement?: HTMLElement
) => {
  let { x, y } = currentPosition
  let outOfBox = {
    x: {
      left: false,
      right: false,
    },
    y: {
      top: false,
      bottom: false,
    },
  }
  const { maxSize } = handleGetRectSize(
    targetElement,
    { type, threshold: 0 },
    eventElement
  )
  const xPosition: 'left' | 'right' = x < 0 ? 'left' : 'right'
  const yPosition: 'top' | 'bottom' = y < 0 ? 'top' : 'bottom'
  if (Math.abs(x) > maxSize.x) {
    outOfBox.x[xPosition] = true
  }
  if (Math.abs(y) > maxSize.y) {
    outOfBox.y[yPosition] = true
  }
  return outOfBox
}

export const handleDecompose2dMatrix = (mat: DOMMatrix): TRANSFORM_VALUES => {
  const { a, b, c, d, e, f } = mat

  let delta = a * d - b * c

  let result = {
    translation: [e, f],
    deg: 0,
    rotation: 0,
    scale: [0, 0],
    skew: [0, 0],
  }
  if (a !== 0 || b !== 0) {
    let r = Math.sqrt(a * a + b * b)
    result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r)
    result.scale = [r, delta / r]
    result.skew = [Math.atan((a * c + b * d) / (r * r)), 0]
  } else if (c !== 0 || d !== 0) {
    let s = Math.sqrt(c * c + d * d)
    result.rotation =
      Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s))
    result.scale = [delta / s, s]
    result.skew = [0, Math.atan((a * c + b * d) / (s * s))]
  } else {
    // a = b = c = d = 0 이므로 업데이트 하지 않는다.
  }
  if (Math.abs(result.rotation) === 0) result.rotation = 0
  const degree = result.rotation * (180 / Math.PI)
  result.deg = degree < 0 ? degree + 360 : degree

  return {
    scale: result.scale[0],
    rotate: result.deg,
    translate: {
      x: result.translation[0],
      y: result.translation[1],
    },
  }
}
