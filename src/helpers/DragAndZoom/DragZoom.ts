import Drag from './Drag'
class DragZoom extends Drag {
  on = (event: any) => {
    this.ts = this.getPosition()
    if (this.isTouchEvent(event) && event.touches.length === 2) {
      this.isDrag = false
      this.isScale = true
      // 터치 시작시 두손가락 거리
      this.startDist = Math.hypot(
        event.touches[0].pageX - event.touches[1].pageX,
        event.touches[0].pageY - event.touches[1].pageY
      )
      // 터치 시작시 스케일
      this.startScale = this.ts.scale
    } else {
      cancelAnimationFrame(this.inertiaAnimationFrame)
      this.isDrag = true
      this.isScale = false
      this.startPoint = {
        x: this.isTouchEvent(event) ? event.touches[0].pageX : event.pageX,
        y: this.isTouchEvent(event) ? event.touches[0].pageY : event.pageY,
      }
      this.previousPosition = {
        x: this.ts.translate.x,
        y: this.ts.translate.y,
      }
      this.velocity = { x: 0, y: 0 }
    }
    const eventTarget = this.eventElement ?? this.targetElement
    if (this.isTouchEvent(event)) {
      eventTarget.addEventListener('touchmove', this.onMove, { passive: true })
      eventTarget.addEventListener('touchend', this.onEnd)
    } else {
      eventTarget.addEventListener('mousemove', this.onMove, { passive: true })
      eventTarget.addEventListener('mouseup', this.onEnd)
      eventTarget.addEventListener('mouseleave', this.onEnd)
    }
  }
  private isTouchEvent = (event: any): event is TouchEvent => {
    return 'touches' in event
  }
  private onMove = (event: TouchEvent | MouseEvent) => {
    // 드래그 이벤트 (현재 없음)
    if (
      this.isDrag &&
      ((this.isTouchEvent(event) && event.touches.length === 1) ||
        !this.isTouchEvent(event))
    ) {
      const x = this.isTouchEvent(event) ? event.touches[0].pageX : event.pageX
      const y = this.isTouchEvent(event) ? event.touches[0].pageY : event.pageY
      this.fireDrag(x, y)
      // 핀치 이벤트
    } else if (
      this.isScale &&
      this.isTouchEvent(event) &&
      event.touches.length === 2
    ) {
      const firstTouch = event.touches[0]
      const secondTouch = event.touches[1]
      this.firePinch(firstTouch, secondTouch)
    }
  }
  private onEnd = (event: TouchEvent | MouseEvent) => {
    const eventTarget = this.eventElement ?? this.targetElement
    if (this.isTouchEvent(event)) {
      eventTarget.removeEventListener('touchmove', this.onMove)
      eventTarget.removeEventListener('touchend', this.onEnd)
    } else {
      eventTarget.removeEventListener('mousemove', this.onMove)
      eventTarget.removeEventListener('mouseup', this.onEnd)
      eventTarget.removeEventListener('mouseleave', this.onEnd)
    }

    cancelAnimationFrame(this.inertiaAnimationFrame)
    if (this.dragged && this.isDrag) {
      this.dragFinish()
    }
    this.dragged = false
    this.isDrag = false
    this.isScale = false
  }
}
export default DragZoom
