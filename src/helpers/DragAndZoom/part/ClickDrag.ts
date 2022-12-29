import Drag from '../Drag'

class ClickDrag extends Drag {
  onMouseDown = (event: MouseEvent | React.MouseEvent) => {
    this.fireOn(event)
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
    this.fireEnd(event)
  }
}
export default ClickDrag
