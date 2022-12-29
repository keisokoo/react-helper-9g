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
  scale: number,
  type: 'left' | 'top'
) => {
  const rec = targetElement.getBoundingClientRect()
  return (point - rec[type]) / scale
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
    areaElement?: HTMLElement
    restrictElement?: HTMLElement
  } = {
    type: 'inner',
    threshold: 0,
  }
) => {
  let bound = option.areaElement
    ? option.areaElement.getBoundingClientRect()
    : document.body.getBoundingClientRect()
  let targetBound = targetElement.getBoundingClientRect()
  let restrictBound = option.restrictElement?.getBoundingClientRect()

  const areaType = option.type === 'inner' ? 1 : -1
  const threshold = option.threshold ?? 0
  let rectSize = {
    w: targetBound.width * areaType,
    h: targetBound.height * areaType,
  }
  let maxSize = {
    x: bound.width / 2 - rectSize.w / 2 + threshold,
    y: bound.height / 2 - rectSize.h / 2 + threshold,
    offset: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  }
  if (restrictBound) {
    let restrictSize = {
      w: restrictBound.width * areaType,
      h: restrictBound.height * areaType,
    }

    let portraitOffset = Math.abs(rectSize.h - restrictSize.h)
    let horizontalOffset = Math.abs(rectSize.w - restrictSize.w)
    if (portraitOffset !== 0) {
      maxSize.offset.bottom = portraitOffset
      if (option.restrictElement?.offsetTop) {
        maxSize.offset.top = option.restrictElement.offsetTop
        maxSize.offset.bottom = Math.abs(
          portraitOffset - option.restrictElement.offsetTop
        )
      }
    }

    if (horizontalOffset !== 0) {
      maxSize.offset.right = horizontalOffset
      if (option.restrictElement?.offsetLeft) {
        maxSize.offset.left = option.restrictElement.offsetLeft
        maxSize.offset.right = Math.abs(
          horizontalOffset - option.restrictElement.offsetLeft
        )
      }
    }
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
  areaElement?: HTMLElement,
  restrictElement?: HTMLElement
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
  const { maxSize } = handleGetRectSize(targetElement, {
    type,
    threshold: 0,
    areaElement,
    restrictElement,
  })
  if (x < -maxSize.x - maxSize.offset.left) {
    outOfBox.x['left'] = true
  }
  if (x > maxSize.x + maxSize.offset.right) {
    outOfBox.x['right'] = true
  }
  if (y < -maxSize.y - maxSize.offset.top) {
    outOfBox.y['top'] = true
  }
  if (y > maxSize.y + maxSize.offset.bottom) {
    outOfBox.y['bottom'] = true
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
