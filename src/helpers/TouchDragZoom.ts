type XY = {
  x: number
  y: number
}
type translateValues = {
  scale: number
  rotate: number
  translate: XY
}
class TouchDragZoom {
  private inertiaAnimationFrame = -1
  private isDrag = false
  private isScale = false
  private dragged = false
  private threshold = 1
  private ts = {
    scale: 1,
    rotate: 0,
    translate: {
      x: 0,
      y: 0,
    },
  }
  private startPoint = {
    x: 0,
    y: 0,
  }
  private previousPosition = {
    x: 0,
    y: 0,
  }

  private maximumInertia = 40
  private velocity = {
    x: 0,
    y: 0,
  }
  private deceleration = 0.9
  private startDist = 0
  private startScale = 1
  private minScale = 0.1
  private maxScale = 3

  private restrictPosition?: (current: XY, targetEl: DOMRect) => XY
  constructor(
    private targetElement: HTMLElement, // 핀치 줌 할 대상
    private eventElement?: HTMLElement, // (옵션) 중첩 실행 문제 (성능) 해결 :: 굳이 할 필요없음. 이벤트가 바인딩 될 엘리먼트, 없을 경우 targetElement
    configs?: {
      ts?: translateValues
      restrictPosition?: (current: XY, targetEl: DOMRect) => XY
    }
  ) {
    if (configs?.ts) this.ts = configs.ts
    if (configs?.restrictPosition)
      this.restrictPosition = configs.restrictPosition
  }

  restrictXY = (currentPosition: { x: number; y: number }) => {
    let { x, y } = currentPosition
    if (!this.targetElement) return { x, y }
    if (!this.restrictPosition) {
      return { x, y }
    }
    const imageBound = this.targetElement.getBoundingClientRect()
    return this.restrictPosition(currentPosition, imageBound)
  }
  capSpeed = (value: number) => {
    let res = 0

    if (Math.abs(value) > this.maximumInertia) {
      res = this.maximumInertia
      res *= value < 0 ? -1 : 1
      return res
    }

    return value
  }
  updateInertia = () => {
    if (!this.targetElement) return
    this.velocity.x = this.velocity.x * this.deceleration
    this.velocity.y = this.velocity.y * this.deceleration

    this.velocity.x = Math.round(this.velocity.x * 10) / 10
    this.velocity.y = Math.round(this.velocity.y * 10) / 10

    this.ts.translate.x = Math.round(this.ts.translate.x + this.velocity.x)
    this.ts.translate.y = Math.round(this.ts.translate.y + this.velocity.y)
    this.targetElement.style.transform = `translate(${this.ts.translate.x}px,${this.ts.translate.y}px) scale(${this.ts.scale})`
    if (
      Math.floor(Math.abs(this.velocity.x)) !== 0 ||
      Math.floor(Math.abs(this.velocity.y)) !== 0
    ) {
      this.inertiaAnimationFrame = requestAnimationFrame(this.updateInertia)
    }
  }
  dragFinish = () => {
    this.velocity = {
      x: this.capSpeed(this.restrictXY(this.velocity).x),
      y: this.capSpeed(this.restrictXY(this.velocity).y),
    }

    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
      this.inertiaAnimationFrame = requestAnimationFrame(this.updateInertia)
    }
  }
  onTouch = (event: TouchEvent | React.TouchEvent) => {
    if (event.touches.length === 1) {
      cancelAnimationFrame(this.inertiaAnimationFrame)
      this.isDrag = true
      this.isScale = false
      this.startPoint = {
        x: event.touches[0].pageX,
        y: event.touches[0].pageY,
      }
      this.previousPosition = {
        x: this.ts.translate.x,
        y: this.ts.translate.y,
      }
      this.velocity = { x: 0, y: 0 }
    } else if (event.touches.length === 2) {
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
    const eventTarget = this.eventElement ?? this.targetElement
    eventTarget.addEventListener('touchmove', this.onMove, false)
    eventTarget.addEventListener('touchend', this.onEnd)
  }
  onMove = (event: TouchEvent | React.TouchEvent) => {
    event.preventDefault()
    if (!this.targetElement) return
    // 중첩 실행 문제 (성능) 해결 :: 굳이 할 필요없음.
    let func = this.eventElement
      ? this.eventElement.ontouchmove
      : this.targetElement.ontouchmove
    this.targetElement.ontouchmove = null

    // 드래그 이벤트 (현재 없음)
    if (this.isDrag && event.touches.length === 1) {
      const x = event.touches[0].pageX
      const y = event.touches[0].pageY
      const oldX = this.ts.translate.x
      const oldY = this.ts.translate.y
      const isInvert = false
      const invert = isInvert ? 1 : -1

      this.ts.translate.x =
        this.previousPosition.x + invert * (-x + this.startPoint.x)
      this.ts.translate.y =
        this.previousPosition.y + invert * (-y + this.startPoint.y)
      this.ts.translate = this.restrictXY(this.ts.translate)
      this.targetElement.style.transform = `translate(${this.ts.translate.x}px,${this.ts.translate.y}px) scale(${this.ts.scale})`

      this.velocity = {
        x: this.ts.translate.x - oldX,
        y: this.ts.translate.y - oldY,
      }
      if (this.velocity.x > this.threshold || this.velocity.y > this.threshold)
        this.dragged = true
      // 핀치 이벤트
    } else if (this.isScale && event.touches.length === 2) {
      const firstTouch = event.touches[0]
      const secondTouch = event.touches[1]
      // 늘어난 두 손가락간 거리
      const dist = Math.hypot(
        firstTouch.clientX - secondTouch.clientX,
        firstTouch.clientY - secondTouch.clientY
      )
      // 대상의 현재 offset 값을 얻기 위해
      let rec = this.targetElement.getBoundingClientRect()
      // 두 손가락의 중앙값을 구합니다.
      let pinchCenterX =
        ((firstTouch.clientX + secondTouch.clientX) / 2 - rec.left) /
        this.ts.scale
      let pinchCenterY =
        ((firstTouch.clientY + secondTouch.clientY) / 2 - rec.top) /
        this.ts.scale
      // 변경전의 대각선 길이 값
      const mapDist = Math.hypot(
        this.targetElement.offsetWidth * this.ts.scale,
        this.targetElement.offsetHeight * this.ts.scale
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
      this.ts.translate.x +=
        -(pinchCenterX * m * 2) + this.targetElement.offsetWidth * m
      this.ts.translate.y +=
        -(pinchCenterY * m * 2) + this.targetElement.offsetHeight * m

      this.ts.translate = this.restrictXY(this.ts.translate)
      // 스케일 업데이트
      this.ts.scale = restrictScale
      // 좌표 업데이트
      this.targetElement.style.transform = `translate(${this.ts.translate.x}px,${this.ts.translate.y}px) scale(${this.ts.scale})`

      // 중첩 실행 문제 (성능) 해결 :: 굳이 할 필요없음.
      if (this.eventElement) {
        this.eventElement.ontouchmove = func
      } else {
        this.targetElement.ontouchmove = func
      }
    }
  }
  onEnd = (e: TouchEvent | React.TouchEvent) => {
    const eventTarget = this.eventElement ?? this.targetElement
    eventTarget.removeEventListener('touchmove', this.onMove)
    eventTarget.removeEventListener('touchend', this.onEnd)

    cancelAnimationFrame(this.inertiaAnimationFrame)
    if (this.dragged && this.isDrag) {
      this.dragFinish()
    }
    this.dragged = false
    this.isDrag = false
    this.isScale = false
  }
}
export default TouchDragZoom
