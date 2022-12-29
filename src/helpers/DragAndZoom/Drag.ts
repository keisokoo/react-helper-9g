import ControlPosition from './ControlPosition'
import {
  handleGetBeforeTargetSize,
  handleGetCurrentPoint,
  isTouchEvent,
} from './utils'

class Drag extends ControlPosition {
  inertiaAnimationFrame = -1
  isDrag = false
  isScale = false
  dragged = false
  threshold = 1
  startPoint = {
    x: 0,
    y: 0,
  }
  previousPosition = {
    x: 0,
    y: 0,
  }
  private maximumInertia = 40
  velocity = {
    x: 0,
    y: 0,
  }
  private deceleration = 0.9
  startDist = 0
  startScale = 1
  private capSpeed = (value: number) => {
    let res = 0

    if (Math.abs(value) > this.maximumInertia) {
      res = this.maximumInertia
      res *= value < 0 ? -1 : 1
      return res
    }

    return value
  }
  dragOn = (
    event: TouchEvent | MouseEvent | React.TouchEvent | React.MouseEvent
  ) => {
    event.stopPropagation()
    const currentTarget = event.currentTarget! as HTMLElement
    currentTarget.style.userSelect = 'none'
    this.ts = this.getPosition()
    cancelAnimationFrame(this.inertiaAnimationFrame)
    if (this.beforeFire) this.beforeFire(this.targetElement)
    this.isDrag = true
    this.isScale = false
    this.startPoint = {
      x: isTouchEvent(event) ? event.touches[0].pageX : event.pageX,
      y: isTouchEvent(event) ? event.touches[0].pageY : event.pageY,
    }
    this.previousPosition = {
      x: this.ts.translate.x,
      y: this.ts.translate.y,
    }
    this.velocity = { x: 0, y: 0 }
  }
  pinchOn = (
    event: TouchEvent | MouseEvent | React.TouchEvent | React.MouseEvent
  ) => {
    event.stopPropagation()
    this.ts = this.getPosition()
    cancelAnimationFrame(this.inertiaAnimationFrame)
    if (isTouchEvent(event) && event.touches.length === 2) {
      if (this.beforeFire) this.beforeFire(this.targetElement)
      this.isDrag = false
      this.isScale = true
      // 터치 시작시 두손가락 거리
      this.startDist = Math.hypot(
        event.touches[0].pageX - event.touches[1].pageX,
        event.touches[0].pageY - event.touches[1].pageY
      )
      // 터치 시작시 스케일
      this.startScale = this.ts.scale
    }
  }
  fireOn = (
    event: TouchEvent | MouseEvent | React.TouchEvent | React.MouseEvent
  ) => {
    this.ts = this.getPosition()
    cancelAnimationFrame(this.inertiaAnimationFrame)
    if (isTouchEvent(event) && event.touches.length === 2) {
      this.pinchOn(event)
    } else {
      this.dragOn(event)
    }
  }
  fireDrag = (x: number, y: number) => {
    if (!this.targetElement) return

    const oldX = this.ts.translate.x
    const oldY = this.ts.translate.y
    const isInvert = false
    const invert = isInvert ? 1 : -1
    this.ts.translate.x =
      this.previousPosition.x + invert * (-x + this.startPoint.x)
    this.ts.translate.y =
      this.previousPosition.y + invert * (-y + this.startPoint.y)
    this.setTransform()

    this.velocity = {
      x: this.ts.translate.x - oldX,
      y: this.ts.translate.y - oldY,
    }
    if (
      Math.abs(this.velocity.x) > this.threshold ||
      Math.abs(this.velocity.y) > this.threshold
    )
      this.dragged = true
  }
  firePinch = (
    firstTouch: Touch | React.Touch,
    secondTouch: Touch | React.Touch
  ) => {
    if (!this.targetElement) return
    // 늘어난 두 손가락간 거리
    const dist = Math.hypot(
      firstTouch.clientX - secondTouch.clientX / 2,
      firstTouch.clientY - secondTouch.clientY / 2
    )
    // 두 손가락의 중앙값을 구합니다.
    const pinchCenterX = handleGetCurrentPoint(
      this.targetElement,
      firstTouch.clientX + secondTouch.clientX,
      this.ts.scale,
      'left'
    )
    const pinchCenterY = handleGetCurrentPoint(
      this.targetElement,
      firstTouch.clientY + secondTouch.clientY,
      this.ts.scale,
      'top'
    )

    // 변경전 실제 길이값, ( 회전할 경우를 width,height값의 기준이 변경되므로 offsetWidth를 쓰지않는다.)
    const beforeTargetSize = handleGetBeforeTargetSize(
      this.targetElement,
      this.ts.scale
    )

    // 변경전의 대각선 길이 값
    const mapDist = Math.hypot(
      beforeTargetSize.w * this.ts.scale,
      beforeTargetSize.h * this.ts.scale
    )

    // 변경되는 크기의 대각선 길이값 x값을 구합니다.
    const x = (mapDist * dist) / this.startDist
    // 스케일로 변환 * 이전 스케일
    const scale = (x / mapDist) * this.startScale
    // 위 두줄은 ((mapDist * dist) / this.startDist / mapDist) * this.startScale 와 같다

    // 최대 최소값
    const restrictScale = Math.min(
      Math.max(this.minScale, scale),
      this.maxScale
    )
    // 증가/감소분
    const factor = restrictScale - this.ts.scale
    // 증가/감소 여부와 중심축 부터 증감하기 위해 미리  2로 나눈다
    const m = factor > 0 ? factor / 2 : factor / 2

    // 이동할 실제 좌표값을 구합니다. 증가/감소분분 만큼을 곱한후 현재 값에 더함
    this.ts.translate.x += -(pinchCenterX * m * 2) + beforeTargetSize.w * m
    this.ts.translate.y += -(pinchCenterY * m * 2) + beforeTargetSize.h * m

    // 스케일 업데이트
    this.ts.scale = restrictScale
    // 좌표 업데이트
    this.setTransform()
  }
  fireEnd = (
    event: TouchEvent | MouseEvent | React.TouchEvent | React.MouseEvent
  ) => {
    event.stopPropagation()
    const currentTarget = event.currentTarget! as HTMLElement
    currentTarget.style.userSelect = ''
    if (this.dragged && this.isDrag) {
      this.dragFinish()
    }
    this.dragged = false
    this.isDrag = false
    this.isScale = false
  }
  private updateInertia = () => {
    if (!this.targetElement) return
    this.velocity.x = this.velocity.x * this.deceleration
    this.velocity.y = this.velocity.y * this.deceleration

    this.velocity.x = Math.round(this.velocity.x * 10) / 10
    this.velocity.y = Math.round(this.velocity.y * 10) / 10

    this.ts.translate.x = Math.round(this.ts.translate.x + this.velocity.x)
    this.ts.translate.y = Math.round(this.ts.translate.y + this.velocity.y)
    this.setTransform()
    if (
      Math.floor(Math.abs(this.velocity.x)) !== 0 ||
      Math.floor(Math.abs(this.velocity.y)) !== 0
    ) {
      this.inertiaAnimationFrame = requestAnimationFrame(this.updateInertia)
    } else {
      if (this.afterFire) this.afterFire(this.targetElement)
    }
  }
  dragFinish = () => {
    this.velocity = {
      x: this.capSpeed(this.restrictXY(this.velocity).x),
      y: this.capSpeed(this.restrictXY(this.velocity).y),
    }

    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
      this.inertiaAnimationFrame = requestAnimationFrame(this.updateInertia)
    } else {
      if (this.afterFire) this.afterFire(this.targetElement)
    }
  }
}
export default Drag
