import styled from '@emotion/styled/macro'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import DragZoom from './helpers/DragAndZoom/DragZoom'
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

  const [rotation, set_rotation] = useState<number>(0)
  const [ctr, set_ctr] = useState<DragZoom>()
  useEffect(() => {
    const cc = new DragZoom(boxRef.current, dragRef.current)
    set_ctr(cc)
  }, [])
  return (
    <Container
      ref={eventRef}
      // onMouseDown={dragEvent?.dragEvent}
      // onTouchStart={dragEvent?.dragEvent}
    >
      <Wrap
        ref={dragRef}
        onWheel={ctr?.onWheel}
        tabIndex={0}
        onTouchStart={ctr?.on}
        onMouseDown={ctr?.on}
      >
        <Target ref={boxRef}>h({rotation})</Target>
      </Wrap>
      <RotateTestButton
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (ctr) {
            let ts = ctr.getPosition()
            ts.rotate = ctr.toggleRotation(ts.rotate)
            set_rotation(ts.rotate)
            ctr.updatePosition(ts)
            ctr.updatePosition(ts)
          }
        }}
      >
        R
      </RotateTestButton>
    </Container>
  )
}

export default App
