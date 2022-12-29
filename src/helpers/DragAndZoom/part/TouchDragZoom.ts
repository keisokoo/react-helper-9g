import Drag from '../Drag'

class TouchDragZoom extends Drag {
  onTouch = (event: TouchEvent | React.TouchEvent) => {
    this.fireOn(event)
    const eventTarget = event.currentTarget! as HTMLElement
    eventTarget.addEventListener('touchmove', this.onMove, { passive: true })
    eventTarget.addEventListener('touchend', this.onEnd)
  }
  private onMove = (event: TouchEvent | React.TouchEvent) => {
    // 드래그 이벤트 (현재 없음)
    if (this.isDrag && event.touches.length === 1) {
      const x = event.touches[0].pageX
      const y = event.touches[0].pageY
      this.fireDrag(x, y)
      // 핀치 이벤트
    } else if (this.isScale && event.touches.length === 2) {
      const firstTouch = event.touches[0]
      const secondTouch = event.touches[1]
      this.firePinch(firstTouch, secondTouch)
    }
  }
  private onEnd = (event: TouchEvent | React.TouchEvent) => {
    const eventTarget = event.currentTarget! as HTMLElement
    eventTarget.removeEventListener('touchmove', this.onMove)
    eventTarget.removeEventListener('touchend', this.onEnd)
    this.fireEnd(event)
  }
}
export default TouchDragZoom
