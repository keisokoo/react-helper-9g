import { MAX_SIZE, OutOfBox, TRANSFORM_VALUES, XY } from '../types'

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
  }
) => {
  let bound = option.areaElement
    ? option.areaElement.getBoundingClientRect()
    : document.body.getBoundingClientRect()
  let targetBound = targetElement.getBoundingClientRect()
  let restrictBound = option.restrictElement?.getBoundingClientRect()

  const areaType = option.type === 'inner' ? 1 : -1
  const areaForOuter = option.type === 'inner' ? 0 : 1
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
      width: 0,
      height: 0,
    },
  }
  if (restrictBound) {
    let restrictSize = {
      w: restrictBound.width * areaType,
      h: restrictBound.height * areaType,
    }
    maxSize.x = bound.width / 2 - restrictSize.w / 2 + threshold
    maxSize.y = bound.height / 2 - restrictSize.h / 2 + threshold
    maxSize.offset.width = restrictBound.width
    maxSize.offset.height = restrictBound.height

    let portraitOffset = Math.abs(rectSize.h - restrictBound.height)
    let horizontalOffset = Math.abs(rectSize.w - restrictBound.width)
    if (portraitOffset !== 0) {
      maxSize.offset.bottom =
        portraitOffset / 2 - maxSize.offset.height * areaForOuter
      if (targetBound.top - restrictBound.top) {
        maxSize.offset.top = Math.abs(targetBound.top - restrictBound.top) / 2
        maxSize.offset.bottom = Math.abs(
          maxSize.offset.bottom -
            Math.abs(targetBound.top - restrictBound.top) / 2
        )
      }
    }
    if (horizontalOffset !== 0) {
      maxSize.offset.right =
        horizontalOffset / 2 - maxSize.offset.width * areaForOuter
      if (targetBound.left - restrictBound.left) {
        maxSize.offset.left =
          Math.abs(targetBound.left - restrictBound.left) / 2
        maxSize.offset.right = Math.abs(
          maxSize.offset.right -
            Math.abs(targetBound.left - restrictBound.left) / 2
        )
      }
    }
  }

  return maxSize
}

export const handleCheckBoxLimit = (
  currentPosition: XY,
  maxSize: MAX_SIZE,
  type?: string
) => {
  let { x, y } = currentPosition
  const xDiffOffset = maxSize.offset.right - maxSize.offset.left
  const yDiffOffset = maxSize.offset.bottom - maxSize.offset.top
  let outOfBox: OutOfBox = {
    x: {
      left: {
        out: false,
        value: -maxSize.x + xDiffOffset,
      },
      right: {
        out: false,
        value: maxSize.x + xDiffOffset,
      },
    },
    y: {
      top: {
        out: false,
        value: -maxSize.y + yDiffOffset,
      },
      bottom: {
        out: false,
        value: maxSize.y + yDiffOffset,
      },
    },
  }
  if (x < -maxSize.x + xDiffOffset) {
    outOfBox.x['left'].out = true
  }
  if (x > maxSize.x + xDiffOffset) {
    outOfBox.x['right'].out = true
  }
  if (y < -maxSize.y + yDiffOffset) {
    outOfBox.y['top'].out = true
  }
  if (y > maxSize.y + yDiffOffset) {
    outOfBox.y['bottom'].out = true
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
