import styled from '@emotion/styled/macro'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import DragZoom from './helpers/DragZoom'
import TouchDragZoom from './helpers/TouchDragZoom'
import WheelZoom from './helpers/WheelZoom'
export const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
`
export const Wrap = styled.div`
  width: 100%;
  height: 100%;
  touch-action: none;
  /* transform-origin: 0 0; */

  display: flex;
  align-items: center;
  justify-content: center;
`
export const Target = styled.div`
  width: 200px;
  height: 200px;
  background-color: #ccc;
`
function App() {
  const dragRef = useRef() as MutableRefObject<HTMLDivElement>
  const eventRef = useRef() as MutableRefObject<HTMLDivElement>
  const boxRef = useRef() as MutableRefObject<HTMLDivElement>

  const [dragEvent, set_dragEvent] = useState<DragZoom>()
  const [wheel, set_wheel] = useState<WheelZoom>()
  const [touch, set_touch] = useState<TouchDragZoom>()

  useEffect(() => {
    const drag = new DragZoom(eventRef, dragRef)
    const zz = new WheelZoom(boxRef.current, dragRef.current)
    const pp = new TouchDragZoom(boxRef.current, dragRef.current)
    set_touch(pp)
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
        onTouchStart={touch?.onTouch}
      >
        <Target ref={boxRef}></Target>
      </Wrap>
    </Container>
  )
}

export default App
