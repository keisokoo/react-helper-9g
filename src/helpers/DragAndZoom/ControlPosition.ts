import { OutOfBoxAll, TRANSFORM_VALUES, XY } from './types'
import {
  handleCheckBoxLimit,
  handleDecompose2dMatrix,
  handleGetCurrentPoint,
  handleGetRectSize,
  isTransformValues,
} from './utils'

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
  areaElement?: HTMLElement
  restrictElement?: HTMLElement
  beforeFire?: (target: HTMLElement) => void
  afterFire?: (target: HTMLElement) => void
  beforeUpdate?: (ts: TRANSFORM_VALUES) => void
  afterUpdate?: (ts: TRANSFORM_VALUES) => void
  constructor(
    public targetElement: HTMLElement,
    configs?: {
      restrictElement?: HTMLElement
      areaElement?: HTMLElement
      factor?: number
      minScale?: number
      maxScale?: number
      beforeFire?: (target: HTMLElement) => void
      afterFire?: (target: HTMLElement) => void
      beforeUpdate?: (ts: TRANSFORM_VALUES) => void
      afterUpdate?: (ts: TRANSFORM_VALUES) => void
      restrictPosition?: (
        current: XY,
        targetEl: DOMRect,
        outOfBox: OutOfBoxAll
      ) => XY
    }
  ) {
    if (configs?.beforeUpdate) this.beforeUpdate = configs.beforeUpdate
    if (configs?.afterUpdate) this.afterUpdate = configs.afterUpdate
    if (configs?.beforeFire) this.beforeFire = configs.beforeFire
    if (configs?.afterFire) this.afterFire = configs.afterFire
    if (configs?.restrictElement) this.restrictElement = configs.restrictElement
    if (configs?.areaElement) this.areaElement = configs.areaElement
    if (configs?.factor) this.factor = configs.factor
    if (configs?.minScale) this.minScale = configs.minScale
    if (configs?.maxScale) this.maxScale = configs.maxScale
    if (configs?.restrictPosition)
      this.restrictPosition = configs.restrictPosition
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
      restrictElement?: HTMLElement
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

    const maxSize = handleGetRectSize(this.targetElement, {
      ...option,
      areaElement: this.areaElement,
      restrictElement: option.restrictElement ?? this.restrictElement,
    })
    const disabled = {
      x: option.disabled?.x,
      y: option.disabled?.y,
    }
    if (!disabled.x) {
      const xDiffOffset = maxSize.offset.right - maxSize.offset.left
      if (x < -maxSize.x + xDiffOffset) {
        x = -maxSize.x + xDiffOffset
      }
      if (x > maxSize.x + xDiffOffset) {
        x = maxSize.x + xDiffOffset
      }
    }

    if (!disabled.y) {
      const yDiffOffset = maxSize.offset.bottom - maxSize.offset.top
      if (y < -maxSize.y + yDiffOffset) {
        y = -maxSize.y + yDiffOffset
      }
      if (y > maxSize.y + yDiffOffset) {
        y = maxSize.y + yDiffOffset
      }
    }
    return { x, y }
  }
  restrictXY = (currentPosition: { x: number; y: number }) => {
    if (!this.targetElement) return currentPosition
    if (!this.restrictPosition) {
      return currentPosition
    }
    const options = {
      threshold: 0,
      areaElement: this.areaElement,
      restrictElement: this.restrictElement,
    }
    const innerMaxSize = handleGetRectSize(this.targetElement, {
      ...options,
      type: 'inner',
    })
    const outerMaxSize = handleGetRectSize(this.targetElement, {
      ...options,
      type: 'outer',
    })
    const outOfBox = {
      inner: handleCheckBoxLimit(currentPosition, innerMaxSize),
      outer: handleCheckBoxLimit(currentPosition, outerMaxSize, 'outer'),
    } as OutOfBoxAll
    const imageBound = this.targetElement.getBoundingClientRect()
    return this.restrictPosition(currentPosition, imageBound, outOfBox)
  }
  getPosition = (el?: HTMLElement) => {
    const matrix = new WebKitCSSMatrix(
      window.getComputedStyle(el ?? this.targetElement).transform
    )
    return handleDecompose2dMatrix(matrix)
  }
  updatePosition = (
    value: TRANSFORM_VALUES | ((value: TRANSFORM_VALUES) => TRANSFORM_VALUES)
  ) => {
    if (isTransformValues(value)) {
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
    window.requestAnimationFrame(() => {
      if (this.beforeUpdate) this.beforeUpdate(this.ts)
      this.targetElement.style.transform = `translate(${this.ts.translate.x}px,${this.ts.translate.y}px) scale(${this.ts.scale}) rotate(${this.ts.rotate}deg)`
      const restricted = this.restrictXY(this.ts.translate)
      if (this.compareXY(restricted, this.ts.translate)) {
        this.ts.translate = restricted
        this.targetElement.style.transform = `translate(${this.ts.translate.x}px,${this.ts.translate.y}px) scale(${this.ts.scale}) rotate(${this.ts.rotate}deg)`
      }
      if (this.afterUpdate) this.afterUpdate(this.ts)
    })
  }
  toggleRotation = (value: number) => {
    value = Math.abs(value)
    return value === 0 ? 90 : value === 90 ? 180 : value === 180 ? 270 : 0
  }
  onWheel = (event: React.WheelEvent | WheelEvent) => {
    if (!this.targetElement) return
    if (this.beforeFire) this.beforeFire(this.targetElement)
    this.ts = this.getPosition()

    const eventTarget = event.currentTarget! as HTMLElement
    let func = eventTarget.onwheel
    eventTarget.onwheel = null

    let rec = this.targetElement.getBoundingClientRect()
    // let pointerX = (event.clientX - rec.left) / this.ts.scale
    // let pointerY = (event.clientY - rec.top) / this.ts.scale

    const pointerX = handleGetCurrentPoint(
      this.targetElement,
      event.clientX,
      this.ts.scale,
      'left'
    )
    const pointerY = handleGetCurrentPoint(
      this.targetElement,
      event.clientY,
      this.ts.scale,
      'top'
    )
    let delta = -event.deltaY
    if (this.ts.scale === this.maxScale && delta > 0) {
      return
    }

    const beforeTargetSize = {
      w: Math.round(rec.width / this.ts.scale),
      h: Math.round(rec.height / this.ts.scale),
    }
    const factor = this.factor * this.ts.scale

    this.ts.scale = delta > 0 ? this.ts.scale + factor : this.ts.scale - factor
    this.ts.scale = Math.min(
      Math.max(this.minScale, this.ts.scale),
      this.maxScale
    )
    let m = delta > 0 ? factor / 2 : -(factor / 2)
    if (this.ts.scale <= this.minScale && delta < 0) {
      return
    }

    this.ts.translate.x += -pointerX * m * 2 + beforeTargetSize.w * m
    this.ts.translate.y += -pointerY * m * 2 + beforeTargetSize.h * m
    this.setTransform()
    if (this.afterFire) this.afterFire(this.targetElement)
    eventTarget.onwheel = func
  }
}
export default ControlPosition
