import Drag from './Drag'
import { isTouchEvent } from './utils'
class DragZoom extends Drag {
  on = (
    event: TouchEvent | MouseEvent | React.TouchEvent | React.MouseEvent
  ) => {
    this.fireOn(event)
    const eventTarget = event.currentTarget! as HTMLElement
    if (isTouchEvent(event)) {
      eventTarget.addEventListener('touchmove', this.onMove, { passive: true })
      eventTarget.addEventListener('touchend', this.onEnd)
    } else {
      eventTarget.addEventListener('mousemove', this.onMove, { passive: true })
      eventTarget.addEventListener('mouseup', this.onEnd)
      eventTarget.addEventListener('mouseleave', this.onEnd)
    }
  }
  private onMove = (event: TouchEvent | MouseEvent) => {
    event.stopPropagation()
    // 드래그 이벤트
    if (
      this.isDrag &&
      ((isTouchEvent(event) && event.touches.length === 1) ||
        !isTouchEvent(event))
    ) {
      const x = isTouchEvent(event) ? event.touches[0].pageX : event.pageX
      const y = isTouchEvent(event) ? event.touches[0].pageY : event.pageY
      this.fireDrag(x, y)
      // 핀치 이벤트
    } else if (
      this.isScale &&
      isTouchEvent(event) &&
      event.touches.length === 2
    ) {
      const firstTouch = event.touches[0]
      const secondTouch = event.touches[1]
      this.firePinch(firstTouch, secondTouch)
    }
  }
  private onEnd = (event: TouchEvent | MouseEvent) => {
    const eventTarget = event.currentTarget! as HTMLElement
    if (isTouchEvent(event)) {
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
