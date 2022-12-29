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
