type translateValues = {
  scale: number
  rotate: number
  translate: {
    x: number
    y: number
  }
}
class PinchZoom {
  private isDrag = false
  private isScale = false
  private ts = {
    scale: 1,
    rotate: 0,
    translate: {
      x: 0,
      y: 0,
    },
  }
  private startDist = 0
  private startScale = 1
  private minScale = 0.1
  private maxScale = 3
  constructor(
    private targetElement?: HTMLElement,
    private eventElement?: HTMLElement,
    ts?: translateValues
  ) {
    if (ts) this.ts = ts
  }
  onTouch = (event: React.TouchEvent) => {
    if (event.touches.length === 1) {
      this.isDrag = true
      this.isScale = false
    } else if (event.touches.length === 2) {
      this.isDrag = false
      this.isScale = true
      this.startDist = Math.hypot(
        event.touches[0].pageX - event.touches[1].pageX,
        event.touches[0].pageY - event.touches[1].pageY
      )
      this.startScale = this.ts.scale
    }
    let startPoint = {
      x: event.touches[0].pageX,
      y: event.touches[0].pageY,
    }
  }
  onMove = (event: React.TouchEvent) => {
    if (!this.targetElement) return
    let func = this.eventElement
      ? this.eventElement.ontouchmove
      : this.targetElement.ontouchmove
    this.targetElement.ontouchmove = null

    if (this.isDrag && event.touches.length === 1) {
    } else if (this.isScale && event.touches.length === 2) {
      const firstTouch = event.touches[0]
      const secondTouch = event.touches[1]
      const dist = Math.hypot(
        firstTouch.clientX - secondTouch.clientX,
        firstTouch.clientY - secondTouch.clientY
      )
      let rec = this.targetElement.getBoundingClientRect()
      let pinchCenterX =
        ((firstTouch.clientX + secondTouch.clientX) / 2 - rec.left) /
        this.ts.scale
      let pinchCenterY =
        ((firstTouch.clientY + secondTouch.clientY) / 2 - rec.top) /
        this.ts.scale

      console.log(`this.ts.scale: ${this.ts.scale}`)
      console.log(`x: ${pinchCenterX}`, `y: ${pinchCenterY}`)

      let targetSize = {
        width: this.targetElement.offsetWidth,
        height: this.targetElement.offsetHeight,
      }
      const mapDist = Math.hypot(
        targetSize.width * this.ts.scale,
        targetSize.height * this.ts.scale
      )
      const scale =
        ((mapDist * dist) / this.startDist / mapDist) * this.startScale
      const restrictScale = Math.min(
        Math.max(this.minScale, scale),
        this.maxScale
      )
      // this.ts.scale = scale
      const factor = restrictScale - this.ts.scale
      const m = factor > 0 ? factor / 2 : factor / 2
      console.log('m', m)

      this.ts.translate.x +=
        -((pinchCenterX * m * 2) / 2) + (this.targetElement.offsetWidth * m) / 2
      this.ts.translate.y +=
        -((pinchCenterY * m * 2) / 2) +
        (this.targetElement.offsetHeight * m) / 2

      this.ts.scale = restrictScale
      this.targetElement.style.transform = `translate(${this.ts.translate.x}px,${this.ts.translate.y}px) scale(${this.ts.scale})`
      if (this.eventElement) {
        this.eventElement.ontouchmove = func
      } else {
        this.targetElement.ontouchmove = func
      }
    }
  }
}
export default PinchZoom
