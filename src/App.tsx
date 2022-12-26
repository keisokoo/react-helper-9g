import styled from '@emotion/styled/macro'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import DragZoom from './helpers/DragZoom'
import PinchZoom from './helpers/PinchZoom'
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
  transform-origin: 0 0;

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
  const [pinch, set_pinch] = useState<PinchZoom>()

  useEffect(() => {
    const drag = new DragZoom(eventRef, dragRef)
    const zz = new WheelZoom(boxRef.current, dragRef.current)
    const pp = new PinchZoom(boxRef.current, dragRef.current)
    set_pinch(pp)
    set_wheel(zz)
    set_dragEvent(drag)
  }, [])
  return (
    <Container
      ref={eventRef}
      // onMouseDown={dragEvent?.dragEvent}
      onTouchStart={dragEvent?.dragEvent}
    >
      <Wrap
        ref={dragRef}
        onWheel={wheel?.onWheel}
        // onTouchStart={pinch?.onTouch}
        // onTouchMove={pinch?.onMove}
      >
        <Target
          ref={boxRef}
          onMouseMove={(e) => {
            const currentTarget = e.currentTarget
            const bounding = currentTarget.getBoundingClientRect()

            console.log('currentTarget.offsetLeft', currentTarget.offsetLeft)
            console.log('x', e.pageX - currentTarget.offsetLeft)
            console.log('y', e.pageY - currentTarget.offsetTop)
          }}
        ></Target>
      </Wrap>
    </Container>
  )
}

export default App
