import Drag from './Drag'

class ClickDrag extends Drag {
  onMouseDown = (event: MouseEvent | React.MouseEvent) => {
    this.ts = this.getPosition()
    cancelAnimationFrame(this.inertiaAnimationFrame)
    this.isDrag = true
    this.isScale = false
    this.startPoint = {
      x: event.pageX,
      y: event.pageY,
    }
    this.previousPosition = {
      x: this.ts.translate.x,
      y: this.ts.translate.y,
    }
    this.velocity = { x: 0, y: 0 }
    const eventTarget = this.eventElement ?? this.targetElement
    eventTarget.addEventListener('mousemove', this.onMove, { passive: true })
    eventTarget.addEventListener('mouseup', this.onEnd)
    eventTarget.addEventListener('mouseleave', this.onEnd)
  }
  private onMove = (event: MouseEvent) => {
    if (!this.targetElement) return
    // 중첩 실행 문제 (성능) 해결 :: 굳이 할 필요없음.
    let func = this.eventElement
      ? this.eventElement.ontouchmove
      : this.targetElement.ontouchmove
    this.targetElement.ontouchmove = null

    const x = event.pageX
    const y = event.pageY
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
    // 중첩 실행 문제 (성능) 해결 :: 굳이 할 필요없음.
    if (this.eventElement) {
      this.eventElement.ontouchmove = func
    } else {
      this.targetElement.ontouchmove = func
    }
  }
  private onEnd = (event: MouseEvent) => {
    const eventTarget = this.eventElement ?? this.targetElement
    eventTarget.removeEventListener('mousemove', this.onMove)
    eventTarget.removeEventListener('mouseup', this.onEnd)
    eventTarget.removeEventListener('mouseleave', this.onEnd)

    cancelAnimationFrame(this.inertiaAnimationFrame)
    if (this.dragged && this.isDrag) {
      this.dragFinish()
    }
    this.dragged = false
    this.isDrag = false
    this.isScale = false
  }
}
export default ClickDrag
