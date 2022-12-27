import styled from '@emotion/styled/macro'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import ClickDrag from './helpers/ClickDrag'
import DragZoom from './helpers/DragZoom'
import TouchDragZoom from './helpers/TouchDragZoom'
import WheelZoom from './helpers/WheelZoom'
const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
`
const Wrap = styled.div`
  width: 100%;
  height: 100%;
  touch-action: none;
  /* transform-origin: 0 0; */

  display: flex;
  align-items: center;
  justify-content: center;
`
const Target = styled.div`
  width: 100px;
  height: 200px;
  background-color: #ccc;
`
const RotateTestButton = styled.button`
  position: fixed;
  right: 32px;
  bottom: 32px;
  width: 32px;
  height: 32px;
  background-color: #ccc;
  color: #000;
  border-radius: 50%;
`
function App() {
  const dragRef = useRef() as MutableRefObject<HTMLDivElement>
  const eventRef = useRef() as MutableRefObject<HTMLDivElement>
  const boxRef = useRef() as MutableRefObject<HTMLDivElement>

  const [dragEvent, set_dragEvent] = useState<DragZoom>()
  const [wheel, set_wheel] = useState<WheelZoom>()
  const [touch, set_touch] = useState<TouchDragZoom>()
  const [clickDrag, set_clickDrag] = useState<ClickDrag>()
  const [rotation, set_rotation] = useState<number>(0)
  useEffect(() => {
    const drag = new DragZoom(eventRef, dragRef)
    const zz = new WheelZoom(boxRef.current, dragRef.current)
    const pp = new TouchDragZoom(boxRef.current, dragRef.current)
    const cc = new ClickDrag(boxRef.current, dragRef.current)
    set_touch(pp)
    set_clickDrag(cc)
    set_wheel(zz)
    set_dragEvent(drag)
  }, [])
  return (
    <Container
      ref={eventRef}
      // onMouseDown={dragEvent?.dragEvent}
      // onTouchStart={dragEvent?.dragEvent}
    >
      <Wrap
        ref={dragRef}
        onWheel={wheel?.onWheel}
        onKeyDown={wheel?.onRotateByKey}
        tabIndex={0}
        onTouchStart={touch?.onTouch}
        onMouseDown={clickDrag?.onMouseDown}
      >
        <Target ref={boxRef}>h({rotation})</Target>
      </Wrap>
      <RotateTestButton
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (wheel && touch) {
            let ts = wheel.getPosition()
            console.log('before rotate', ts.rotate)
            ts.rotate = wheel.toggleRotation(ts.rotate)
            console.log('update to', ts.rotate)
            set_rotation(ts.rotate)
            touch.updatePosition(ts)
            wheel.updatePosition(ts)
          }
        }}
      >
        R
      </RotateTestButton>
    </Container>
  )
}

export default App
