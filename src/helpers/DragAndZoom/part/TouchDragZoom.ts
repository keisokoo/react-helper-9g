import Drag from '../Drag'

class TouchDragZoom extends Drag {
  onTouch = (event: TouchEvent | React.TouchEvent) => {
    this.ts = this.getPosition()
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
    eventTarget.addEventListener('touchmove', this.onMove, { passive: true })
    eventTarget.addEventListener('touchend', this.onEnd)
  }
  private onMove = (event: TouchEvent | React.TouchEvent) => {
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
      this.setTransform()

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

      // 변경전 실제 길이값, ( 회전할 경우를 width,height값의 기준이 변경되므로 offsetWidth를 쓰지않는다.)
      const beforeTargetSize = {
        w: Math.round(rec.width / this.ts.scale),
        h: Math.round(rec.height / this.ts.scale),
      }
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

      this.ts.translate = this.restrictXY(this.ts.translate)
      // 스케일 업데이트
      this.ts.scale = restrictScale
      // 좌표 업데이트
      this.setTransform()
    }

    // 중첩 실행 문제 (성능) 해결 :: 굳이 할 필요없음.
    if (this.eventElement) {
      this.eventElement.ontouchmove = func
    } else {
      this.targetElement.ontouchmove = func
    }
  }
  private onEnd = (e: TouchEvent | React.TouchEvent) => {
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
