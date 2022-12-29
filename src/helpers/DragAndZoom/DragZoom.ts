import Drag from './Drag'
class DragZoom extends Drag {
  on = (
    event: TouchEvent | MouseEvent | React.TouchEvent | React.MouseEvent
  ) => {
    this.fireOn(event)
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
    this.fireEnd(event)
  }
}
export default DragZoom
