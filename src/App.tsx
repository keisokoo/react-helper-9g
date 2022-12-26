import styled from '@emotion/styled/macro'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import DragZoom from './helpers/DragZoom'
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
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
`
export const Target = styled.div`
  width: 500px;
  height: 500px;
  background-color: #ccc;
`
function App() {
  const dragRef = useRef() as MutableRefObject<HTMLDivElement>
  const eventRef = useRef() as MutableRefObject<HTMLDivElement>
  const boxRef = useRef() as MutableRefObject<HTMLDivElement>

  const [dragEvent, set_dragEvent] = useState<DragZoom>()
  const [wheel, set_wheel] = useState<WheelZoom>()

  useEffect(() => {
    const drag = new DragZoom(eventRef, dragRef)
    const zz = new WheelZoom(boxRef.current, dragRef.current)
    set_wheel(zz)
    set_dragEvent(drag)
  }, [])
  return (
    <Container ref={eventRef} onMouseDown={dragEvent?.dragEvent}>
      <Wrap ref={dragRef} onWheel={wheel?.onWheel}>
        <Target ref={boxRef}>드래그 줌 테스트</Target>
      </Wrap>
    </Container>
  )
}

export default App
