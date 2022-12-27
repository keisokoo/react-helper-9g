import ControlPosition from '../ControlPosition'

class WheelZoom extends ControlPosition {
  onRotateByKey = (event: React.KeyboardEvent) => {
    if (event.code === 'KeyR') {
      this.ts = this.getPosition()
      this.ts.translate = { x: 0, y: 0 }
      this.ts.rotate = this.toggleRotation(this.ts.rotate)
      this.setTransform()
    }
  }
  onWheel = (event: React.WheelEvent) => {
    if (!this.targetElement) return
    this.ts = this.getPosition()

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
    // factor를 지정 안하고 delta값 만큼 키운 후 factor를 구하는 경우
    // const mapSize = this.targetElement.offsetWidth * this.ts.scale
    // const nextSize = mapSize + delta
    // const scale = (nextSize / mapSize) * this.ts.scale
    // const restrictScale = Math.min(
    //   Math.max(this.minScale, scale),
    //   this.maxScale
    // )
    // const factor = restrictScale - this.ts.scale
    // const m = factor > 0 ? factor / 2 : factor / 2
    // this.ts.scale = restrictScale

    const beforeTargetSize = {
      w: Math.round(rec.width / this.ts.scale),
      h: Math.round(rec.height / this.ts.scale),
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

    this.ts.translate.x += -pointerX * m * 2 + beforeTargetSize.w * m
    this.ts.translate.y += -pointerY * m * 2 + beforeTargetSize.h * m
    this.ts.translate = this.restrictXY(this.ts.translate)
    this.setTransform()
    if (this.eventElement) {
      this.eventElement.onwheel = func
    } else {
      this.targetElement.onwheel = func
    }
  }
}

export default WheelZoom
