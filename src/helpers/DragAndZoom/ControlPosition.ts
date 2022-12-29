type XY = {
  x: number
  y: number
}
type translateValues = {
  scale: number
  rotate: number
  translate: XY
}
type OutOfBox = {
  x: {
    left: boolean
    right: boolean
  }
  y: {
    top: boolean
    bottom: boolean
  }
}
type OutOfBoxAll = {
  inner: OutOfBox
  outer: OutOfBox
}
class ControlPosition {
  factor = 0.1
  minScale = 0.1
  maxScale = 10
  ts = {
    scale: 1,
    rotate: 0,
    translate: {
      x: 0,
      y: 0,
    },
  }
  restrictPosition?: (
    current: XY,
    targetEl: DOMRect,
    outOfBox: OutOfBoxAll
  ) => XY
  constructor(
    public targetElement: HTMLElement,
    public eventElement?: HTMLElement,
    configs?: {
      factor?: number
      minScale?: number
      maxScale?: number
      restrictPosition?: (
        current: XY,
        targetEl: DOMRect,
        outOfBox: OutOfBoxAll
      ) => XY
    }
  ) {
    if (configs?.factor) this.factor = configs.factor
    if (configs?.minScale) this.minScale = configs.minScale
    if (configs?.maxScale) this.maxScale = configs.maxScale
    if (configs?.restrictPosition)
      this.restrictPosition = configs.restrictPosition
  }
  private getRectSize = (
    option: {
      type?: 'inner' | 'outer'
      threshold?: number
    } = {
      type: 'inner',
      threshold: 0,
    }
  ) => {
    let bound = this.eventElement
      ? this.eventElement.getBoundingClientRect()
      : document.body.getBoundingClientRect()
    let targetBound = this.targetElement.getBoundingClientRect()

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
  areaRestrictions = (
    currentPosition: { x: number; y: number },
    option: {
      type?: 'inner' | 'outer'
      threshold?: number
      disabled?: {
        x?: boolean
        y?: boolean
      }
    } = {
      type: 'inner',
      threshold: 0,
      disabled: {
        x: false,
        y: false,
      },
    }
  ) => {
    let { x, y } = currentPosition
    const { maxSize } = this.getRectSize(option)
    const disabled = {
      x: option.disabled?.x,
      y: option.disabled?.y,
    }
    if (Math.abs(x) > maxSize.x && !disabled.x) {
      x = x < 0 ? -maxSize.x : maxSize.x
    }
    if (Math.abs(y) > maxSize.y && !disabled.y) {
      y = y < 0 ? -maxSize.y : maxSize.y
    }
    return { x, y }
  }
  checkBoxLimit = (
    currentPosition: { x: number; y: number },
    type: 'inner' | 'outer'
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
    const { maxSize } = this.getRectSize({ type, threshold: 0 })
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
  restrictXY = (currentPosition: { x: number; y: number }) => {
    if (!this.targetElement) return currentPosition
    if (!this.restrictPosition) {
      return currentPosition
    }
    const outOfBox = {
      inner: this.checkBoxLimit(currentPosition, 'inner'),
      outer: this.checkBoxLimit(currentPosition, 'outer'),
    } as OutOfBoxAll
    const imageBound = this.targetElement.getBoundingClientRect()
    return this.restrictPosition(currentPosition, imageBound, outOfBox)
  }
  private decompose_2d_matrix = (mat: DOMMatrix): translateValues => {
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
  private isTranslateValues = (value: any): value is translateValues => {
    return (
      value !== undefined &&
      'translate' in value &&
      'rotate' in value &&
      'scale' in value
    )
  }
  getPosition = (el?: HTMLElement) => {
    const matrix = new WebKitCSSMatrix(
      window.getComputedStyle(el ?? this.targetElement).transform
    )
    return this.decompose_2d_matrix(matrix)
  }
  updatePosition = (
    value: translateValues | ((value: translateValues) => translateValues)
  ) => {
    if (this.isTranslateValues(value)) {
      this.ts = value
    } else {
      this.ts = value(this.getPosition())
    }
    this.setTransform()
  }
  private compareXY = (one: XY, two: XY) => {
    return one.x !== two.x || one.y !== two.y
  }
  setTransform = () => {
    this.targetElement.style.transform = `translate(${this.ts.translate.x}px,${this.ts.translate.y}px) scale(${this.ts.scale}) rotate(${this.ts.rotate}deg)`
    const restricted = this.restrictXY(this.ts.translate)
    if (this.compareXY(restricted, this.ts.translate)) {
      this.ts.translate = restricted
      this.setTransform()
    }
  }
  toggleRotation = (value: number) => {
    value = Math.abs(value)
    return value === 0 ? 90 : value === 90 ? 180 : value === 180 ? 270 : 0
  }
}
export default ControlPosition
