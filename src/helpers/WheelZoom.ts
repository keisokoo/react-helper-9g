class WheelZoom {
  factor = 0.1
  ts = {
    scale: 1,
    rotate: 0,
    translate: {
      x: 0,
      y: 0,
    },
  }
  minScale = 0.1
  maxScale = 3
  constructor(
    private targetElement?: HTMLElement,
    private eventElement?: HTMLElement
  ) {}
  onWheel = (event: React.WheelEvent) => {
    if (!this.targetElement) return
    let func = this.eventElement
      ? this.eventElement.onwheel
      : this.targetElement.onwheel
    this.targetElement.onwheel = null

    let rec = this.targetElement.getBoundingClientRect()
    let pointerX = (event.clientX - rec.left) / this.ts.scale
    let pointerY = (event.clientY - rec.top) / this.ts.scale

    let delta = -event.deltaY
    if (this.ts.scale === this.maxScale && delta > 0) {
      return
    }
    this.ts.scale =
      delta > 0 ? this.ts.scale + this.factor : this.ts.scale - this.factor
    this.ts.scale = Math.min(
      Math.max(this.minScale, this.ts.scale),
      this.maxScale
    )
    let m = delta > 0 ? this.factor / 2 : -(this.factor / 2)
    if (this.ts.scale <= this.minScale && delta < 0) {
      return
    }
    this.ts.translate.x +=
      -pointerX * m * 2 + this.targetElement.offsetWidth * m
    this.ts.translate.y +=
      -pointerY * m * 2 + this.targetElement.offsetHeight * m

    this.targetElement.style.transform = `translate(${this.ts.translate.x}px,${this.ts.translate.y}px) scale(${this.ts.scale})`
    if (this.eventElement) {
      this.eventElement.onwheel = func
    } else {
      this.targetElement.onwheel = func
    }
  }
}
export default WheelZoom
