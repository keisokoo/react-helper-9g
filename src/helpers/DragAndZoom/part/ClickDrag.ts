import Drag from '../Drag'

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
    this.fireDrag(event.pageX, event.pageY)
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
