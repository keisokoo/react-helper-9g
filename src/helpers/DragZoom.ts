import { MutableRefObject } from 'react'
/** Drag and Zoom (Wheel zoom with Pinch Zoom)
 *
 * 변경되는 엘리먼트 css에 transform-origin: 0 0; 필요
 */
export interface DraggableElementType {
  // 감속 속도
  deceleration: number
  // 관성 최대 값
  maximumInertia: number
  // 휠 줌 단위
  factor: number
  minScale: number
  maxScale: number
  delta: number
  scaleStart: number
  currentScale: number
  startCurrentScale: number
  inertiaAnimationFrame: number
  // 제한 영역
  maxBounding: CoordsProps
  zoomPoint: CoordsProps
  zoomTarget: CoordsProps
  zoomCenterPosition: CoordsProps
  dragStart: CoordsProps
  dragLast: CoordsProps
  currentPosition: CoordsProps
  velocity: CoordsProps
  pinchCenter: CoordsProps
  targetSize: TargetSize
  debounceStartTime: number | null
  debounceTimeout: NodeJS.Timeout | null
  scaleAble: boolean
  dragAble: boolean
  dragged: boolean
  threshold: number
}
interface CoordsProps {
  x: number
  y: number
}
interface TargetSize {
  width: number
  height: number
}
class DragZoom {
  dragRef: DraggableElementType = {
    deceleration: 0.9,
    maximumInertia: 40,
    factor: 0.1,
    minScale: 0.5,
    maxScale: 20,
    delta: 0,
    scaleStart: 0,
    currentScale: 1,
    startCurrentScale: 1,
    inertiaAnimationFrame: -1,
    maxBounding: { x: 0, y: 0 },
    zoomPoint: { x: 0, y: 0 },
    zoomTarget: { x: 0, y: 0 },
    zoomCenterPosition: { x: 0, y: 0 },
    dragStart: { x: 0, y: 0 },
    dragLast: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    pinchCenter: { x: 0, y: 0 },
    targetSize: { width: 0, height: 0 },
    debounceStartTime: null,
    debounceTimeout: null,
    scaleAble: false,
    dragAble: false,
    dragged: false,
    threshold: 1,
  }
  useMaxBound: boolean = false
  wrapElement: MutableRefObject<HTMLDivElement>
  dragAndZoomElement: MutableRefObject<HTMLElement>
  callback?: (event: any) => void
  constructor(
    wrapElement: MutableRefObject<HTMLDivElement>,
    dragAndZoomElement: MutableRefObject<HTMLElement>,
    config?: {
      callback?: (event: any) => void
      dragRef?: DraggableElementType
      useMaxBound?: boolean
    }
  ) {
    if (config?.dragRef) this.dragRef = config.dragRef
    if (config?.callback) this.callback = config.callback
    if (config?.useMaxBound) this.useMaxBound = config.useMaxBound
    this.wrapElement = wrapElement
    this.dragAndZoomElement = dragAndZoomElement
  }

  handleZoomWithCurrentPoint = () => {
    if (this.dragRef.debounceStartTime) {
      this.dragRef.debounceStartTime = null
    }
    const offset = this.wrapElement.current.getBoundingClientRect()

    this.dragRef.zoomPoint.x = this.dragRef.zoomCenterPosition.x - offset.left
    this.dragRef.zoomPoint.y = this.dragRef.zoomCenterPosition.y - offset.top
    // ? 줌인 할 위치
    this.dragRef.zoomTarget.x =
      (this.dragRef.zoomPoint.x - this.dragRef.currentPosition.x) /
      this.dragRef.currentScale
    this.dragRef.zoomTarget.y =
      (this.dragRef.zoomPoint.y - this.dragRef.currentPosition.y) /
      this.dragRef.currentScale

    // ? 줌 인 크기 this.dragRef.minScale ~ this.dragRef.maxScale

    this.dragRef.currentScale = Math.max(
      this.dragRef.minScale,
      Math.min(
        this.dragRef.maxScale,
        this.dragRef.currentScale + this.dragRef.delta * this.dragRef.factor
      )
    )
    const currentX =
      -this.dragRef.zoomTarget.x * this.dragRef.currentScale +
      this.dragRef.zoomPoint.x
    const currentY =
      -this.dragRef.zoomTarget.y * this.dragRef.currentScale +
      this.dragRef.zoomPoint.y
    const limitedBound = this.maxBound(currentX, currentY)
    this.dragRef.currentPosition = { x: limitedBound.x, y: limitedBound.y }
    if (!this.dragAndZoomElement.current) return
    this.dragAndZoomElement.current.style.transform = `translate(${this.dragRef.currentPosition.x}px,${this.dragRef.currentPosition.y}px) scale(${this.dragRef.currentScale})`
  }
  wheelZoomEvent = (e: React.WheelEvent) => {
    if (!this.dragRef.debounceStartTime) {
      this.dragRef.debounceStartTime = +new Date()
    }

    let wheelDelta = e.deltaY * -1
    this.dragRef.delta = Math.max(-1, Math.min(1, wheelDelta))
    this.dragRef.zoomCenterPosition = {
      x: e.pageX,
      y: e.pageY,
    }
    this.dragRef.startCurrentScale = Math.max(
      this.dragRef.minScale,
      Math.min(
        this.dragRef.maxScale,
        this.dragRef.currentScale + this.dragRef.delta * this.dragRef.factor
      )
    )
    const leftTime = Math.max(
      40 - (+new Date() - this.dragRef.debounceStartTime),
      0
    )

    if (this.dragRef.debounceTimeout) {
      clearTimeout(this.dragRef.debounceTimeout)
    }
    this.dragRef.debounceTimeout = setTimeout(() => {
      this.dragRef.inertiaAnimationFrame = requestAnimationFrame(
        this.handleZoomWithCurrentPoint
      )
    }, leftTime)
  }

  capSpeed = (value: number) => {
    let res = 0

    if (Math.abs(value) > this.dragRef.maximumInertia) {
      res = this.dragRef.maximumInertia
      res *= value < 0 ? -1 : 1
      return res
    }

    return value
  }
  update = () => {
    if (!this.dragAndZoomElement.current) return
    this.dragRef.velocity.x =
      this.dragRef.velocity.x * this.dragRef.deceleration
    this.dragRef.velocity.y =
      this.dragRef.velocity.y * this.dragRef.deceleration

    this.dragRef.velocity.x = Math.round(this.dragRef.velocity.x * 10) / 10
    this.dragRef.velocity.y = Math.round(this.dragRef.velocity.y * 10) / 10

    this.dragRef.currentPosition.x = Math.round(
      this.dragRef.currentPosition.x + this.dragRef.velocity.x
    )
    this.dragRef.currentPosition.y = Math.round(
      this.dragRef.currentPosition.y + this.dragRef.velocity.y
    )
    const reAssignedPosition = this.maxBound(
      this.dragRef.currentPosition.x,
      this.dragRef.currentPosition.y
    )
    if (!reAssignedPosition) return
    this.dragRef.currentPosition = reAssignedPosition
    this.dragAndZoomElement.current.style.transform = `translate(${this.dragRef.currentPosition.x}px,${this.dragRef.currentPosition.y}px) scale(${this.dragRef.currentScale})`
    if (
      Math.floor(Math.abs(this.dragRef.velocity.x)) !== 0 ||
      Math.floor(Math.abs(this.dragRef.velocity.y)) !== 0
    ) {
      this.dragRef.inertiaAnimationFrame = requestAnimationFrame(this.update)
    }
  }
  finish = () => {
    const limitedBound = this.maxBound(
      this.dragRef.velocity.x,
      this.dragRef.velocity.y
    )
    this.dragRef.velocity = {
      x: this.capSpeed(limitedBound.x),
      y: this.capSpeed(limitedBound.y),
    }

    if (limitedBound.x !== 0 || limitedBound.y !== 0) {
      this.dragRef.inertiaAnimationFrame = requestAnimationFrame(this.update)
    }
  }
  maxBound = (x: number, y: number) => {
    if (!this.useMaxBound) return { x, y }
    if (!this.dragAndZoomElement.current) return { x, y }
    this.dragRef.maxBounding.x = window.innerWidth / 2
    this.dragRef.maxBounding.y = window.innerHeight / 2
    const imageBound = this.dragAndZoomElement.current.getBoundingClientRect()

    if (x > this.dragRef.maxBounding.x) x = this.dragRef.maxBounding.x
    if (y > this.dragRef.maxBounding.y) y = this.dragRef.maxBounding.y

    if (
      x <
      (imageBound.width - window.innerWidth + this.dragRef.maxBounding.x) * -1
    ) {
      x =
        (imageBound.width - window.innerWidth + this.dragRef.maxBounding.x) * -1
    }
    if (
      y <
      (imageBound.height - window.innerHeight + this.dragRef.maxBounding.y) * -1
    ) {
      y =
        (imageBound.height - window.innerHeight + this.dragRef.maxBounding.y) *
        -1
    }
    return { x, y }
  }
  initPosition = () => {
    this.dragRef.currentPosition = { x: 0, y: 0 }
    this.dragRef.currentScale = 1
    this.dragAndZoomElement.current.style.transform = `translate(${this.dragRef.currentPosition.x}px,${this.dragRef.currentPosition.y}px) scale(${this.dragRef.currentScale})`
  }
  updateScrollPos = (x: number, y: number) => {
    if (!this.dragAndZoomElement.current) return
    const oldX = this.dragRef.currentPosition.x
    const oldY = this.dragRef.currentPosition.y
    const invertMovement = false
    const invert = invertMovement ? 1 : -1
    this.dragRef.currentPosition.x =
      this.dragRef.dragLast.x + invert * (-x + this.dragRef.dragStart.x)
    this.dragRef.currentPosition.y =
      this.dragRef.dragLast.y + invert * (-y + this.dragRef.dragStart.y)

    const reAssignedPosition = this.maxBound(
      this.dragRef.currentPosition.x,
      this.dragRef.currentPosition.y
    )
    if (!reAssignedPosition) return
    this.dragRef.currentPosition = reAssignedPosition

    this.dragAndZoomElement.current.style.transform = `translate(${this.dragRef.currentPosition.x}px,${this.dragRef.currentPosition.y}px) scale(${this.dragRef.currentScale})`

    this.dragRef.velocity = {
      x: this.dragRef.currentPosition.x - oldX,
      y: this.dragRef.currentPosition.y - oldY,
    }
  }
  updateScale = (firstTouch: Touch, secondTouch: Touch) => {
    const dist = Math.hypot(
      firstTouch.clientX - secondTouch.clientX,
      firstTouch.clientY - secondTouch.clientY
    )
    const pinchCenterX = (firstTouch.clientX + secondTouch.clientX) / 2
    const pinchCenterY = (firstTouch.clientY + secondTouch.clientY) / 2

    const offset = this.wrapElement.current.getBoundingClientRect()

    this.dragRef.zoomPoint.x = pinchCenterX - offset.left
    this.dragRef.zoomPoint.y = pinchCenterY - offset.top

    this.dragRef.targetSize = {
      width: this.wrapElement.current.offsetWidth,
      height: this.wrapElement.current.offsetHeight,
    }
    if (!this.dragRef.targetSize) return
    const mapDist = Math.hypot(
      this.dragRef.targetSize.width * this.dragRef.currentScale,
      this.dragRef.targetSize.height * this.dragRef.currentScale
    )

    this.dragRef.zoomTarget.x =
      (this.dragRef.zoomPoint.x - this.dragRef.currentPosition.x) /
      this.dragRef.currentScale
    this.dragRef.zoomTarget.y =
      (this.dragRef.zoomPoint.y - this.dragRef.currentPosition.y) /
      this.dragRef.currentScale

    const scale =
      ((mapDist * dist) / this.dragRef.scaleStart / mapDist) *
      this.dragRef.startCurrentScale

    const restrictScale = Math.min(
      Math.max(this.dragRef.minScale, scale),
      this.dragRef.maxScale
    )
    const factor = restrictScale - this.dragRef.currentScale
    const m = factor > 0 ? factor / 2 : factor / 2
    console.log(m)

    this.dragRef.currentScale = restrictScale
    const currentX =
      -this.dragRef.zoomTarget.x * this.dragRef.currentScale +
      this.dragRef.zoomPoint.x
    const currentY =
      -this.dragRef.zoomTarget.y * this.dragRef.currentScale +
      this.dragRef.zoomPoint.y
    const limitedBound = this.maxBound(currentX, currentY)
    this.dragRef.currentPosition = { x: limitedBound.x, y: limitedBound.y }

    if (!this.dragAndZoomElement.current) return
    this.dragAndZoomElement.current.style.transform = `translate(${this.dragRef.currentPosition.x}px,${this.dragRef.currentPosition.y}px) scale(${this.dragRef.currentScale})`
  }
  // onMouseMove
  draggingMouse = (event: any) => {
    event.stopPropagation()
    if (this.dragRef.dragAble) {
      const endPoint = {
        x: event.pageX,
        y: event.pageY,
      }
      let dragDiff = {
        x: Math.abs(this.dragRef.dragStart.x - endPoint.x),
        y: Math.abs(this.dragRef.dragStart.y - endPoint.y),
      }
      if (
        dragDiff.x > this.dragRef.threshold ||
        dragDiff.y > this.dragRef.threshold
      ) {
        this.dragRef.dragged = true
      }

      this.updateScrollPos(event.pageX, event.pageY)
    }
  }
  // onTouchMove
  draggingTouch = (event: any) => {
    event.stopPropagation()
    if (this.dragRef.scaleAble && event.touches[0] && event.touches[1]) {
      this.dragRef.dragged = true
      this.updateScale(event.touches[0], event.touches[1])
    } else if (this.dragRef.dragAble) {
      const endPoint = {
        x: event.touches[0].pageX,
        y: event.touches[0].pageY,
      }
      let dragDiff = {
        x: Math.abs(this.dragRef.dragStart.x - endPoint.x),
        y: Math.abs(this.dragRef.dragStart.y - endPoint.y),
      }
      if (
        dragDiff.x > this.dragRef.threshold ||
        dragDiff.y > this.dragRef.threshold
      ) {
        this.dragRef.dragged = true
      }
      // ? 맵 이동
      this.updateScrollPos(event.touches[0].pageX, event.touches[0].pageY)
    }
  }
  // onMouseUp, onTouchEnd or leave event
  dragEventEnd = (event: any) => {
    if ((event.target as any).classList.contains('disable-drag')) return
    event.stopPropagation()
    this.wrapElement.current.removeEventListener(
      'touchmove',
      this.draggingTouch
    )
    this.wrapElement.current.removeEventListener('touchend', this.dragEventEnd)
    this.wrapElement.current.removeEventListener(
      'mousemove',
      this.draggingMouse
    )
    this.wrapElement.current.removeEventListener('mouseup', this.dragEventEnd)
    this.wrapElement.current.removeEventListener(
      'mouseleave',
      this.dragEventEnd
    )

    cancelAnimationFrame(this.dragRef.inertiaAnimationFrame)

    if (this.dragRef.scaleAble) {
      this.dragRef.scaleAble = false
      this.dragRef.startCurrentScale = this.dragRef.currentScale
    } else if (this.dragRef.dragAble) {
      this.dragRef.dragAble = false
      this.finish()
    }

    if (!this.dragRef.dragged && this.callback) {
      this.callback(event)
    }
  }
  // onMouseDown, onTouchStart
  dragEvent = (
    event: React.TouchEvent<HTMLDivElement> &
      React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if ((event.target as any).classList.contains('disable-drag')) return
    const startPoint = event.touches
      ? {
          x: event.touches[0].pageX,
          y: event.touches[0].pageY,
        }
      : {
          x: event.pageX,
          y: event.pageY,
        }

    this.dragRef.dragStart = {
      x: startPoint.x,
      y: startPoint.y,
    }
    this.dragRef.dragLast = {
      x: this.dragRef.currentPosition.x,
      y: this.dragRef.currentPosition.y,
    }
    if (event.type === 'touchstart') {
      this.wrapElement.current.addEventListener('touchmove', this.draggingTouch)
      this.wrapElement.current.addEventListener('touchend', this.dragEventEnd)
    }
    if (event.type === 'mousedown') {
      this.wrapElement.current.addEventListener('mousemove', this.draggingMouse)
      this.wrapElement.current.addEventListener('mouseup', this.dragEventEnd)
      this.wrapElement.current.addEventListener('mouseleave', this.dragEventEnd)
    }
    if (event.touches?.length === 1 || event.button === 0) {
      this.dragRef.dragAble = true
      this.dragRef.velocity = { x: 0, y: 0 }
      this.dragRef.dragged = false
    }
    if (event.touches?.length === 2) {
      this.dragRef.scaleAble = true
      this.dragRef.dragAble = false

      const dist = Math.hypot(
        event.touches[0].pageX - event.touches[1].pageX,
        event.touches[0].pageY - event.touches[1].pageY
      )
      this.dragRef.scaleStart = dist
      this.dragRef.startCurrentScale = this.dragRef.currentScale
    }
  }
}
export default DragZoom
