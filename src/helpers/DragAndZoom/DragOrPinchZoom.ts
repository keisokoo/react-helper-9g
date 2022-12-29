import Drag from './Drag'
import { isTouchEvent } from './utils'
class DragOrPinchZoom extends Drag {
  onDragStart = (
    event: TouchEvent | MouseEvent | React.TouchEvent | React.MouseEvent
  ) => {
    this.ts = this.getPosition()
    cancelAnimationFrame(this.inertiaAnimationFrame)
    this.dragOn(event)
    const eventTarget = event.currentTarget! as HTMLElement
    if (isTouchEvent(event)) {
      eventTarget.addEventListener('touchmove', this.onDragMove, {
        passive: true,
      })
      eventTarget.addEventListener('touchend', this.onDragEnd)
    } else {
      eventTarget.addEventListener('mousemove', this.onDragMove, {
        passive: true,
      })
      eventTarget.addEventListener('mouseup', this.onDragEnd)
      eventTarget.addEventListener('mouseleave', this.onDragEnd)
    }
  }
  private onDragMove = (event: TouchEvent | MouseEvent) => {
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
    }
  }
  private onDragEnd = (event: TouchEvent | MouseEvent) => {
    const eventTarget = event.currentTarget! as HTMLElement
    this.fireEnd(event)
    if (isTouchEvent(event)) {
      eventTarget.removeEventListener('touchmove', this.onDragMove)
      eventTarget.removeEventListener('touchend', this.onDragEnd)
    } else {
      eventTarget.removeEventListener('mousemove', this.onDragMove)
      eventTarget.removeEventListener('mouseup', this.onDragEnd)
      eventTarget.removeEventListener('mouseleave', this.onDragEnd)
    }
  }
  onPinchStart = (
    event: TouchEvent | MouseEvent | React.TouchEvent | React.MouseEvent
  ) => {
    this.ts = this.getPosition()
    cancelAnimationFrame(this.inertiaAnimationFrame)
    this.pinchOn(event)
    const eventTarget = event.currentTarget! as HTMLElement
    if (isTouchEvent(event)) {
      eventTarget.addEventListener('touchmove', this.onPinchMove, {
        passive: true,
      })
      eventTarget.addEventListener('touchend', this.onPinchEnd)
    } else {
      eventTarget.addEventListener('mousemove', this.onPinchMove, {
        passive: true,
      })
      eventTarget.addEventListener('mouseup', this.onPinchEnd)
      eventTarget.addEventListener('mouseleave', this.onPinchEnd)
    }
  }
  private onPinchMove = (event: TouchEvent | MouseEvent) => {
    event.stopPropagation()
    // 핀치 이벤트
    if (this.isScale && isTouchEvent(event) && event.touches.length === 2) {
      const firstTouch = event.touches[0]
      const secondTouch = event.touches[1]
      this.firePinch(firstTouch, secondTouch)
    }
  }
  private onPinchEnd = (event: TouchEvent | MouseEvent) => {
    const eventTarget = event.currentTarget! as HTMLElement
    if (isTouchEvent(event)) {
      eventTarget.removeEventListener('touchmove', this.onPinchMove)
      eventTarget.removeEventListener('touchend', this.onPinchEnd)
    } else {
      eventTarget.removeEventListener('mousemove', this.onPinchMove)
      eventTarget.removeEventListener('mouseup', this.onPinchEnd)
      eventTarget.removeEventListener('mouseleave', this.onPinchEnd)
    }
    this.fireEnd(event)
  }
}
export default DragOrPinchZoom
