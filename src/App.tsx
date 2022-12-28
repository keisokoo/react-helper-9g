import styled from '@emotion/styled/macro'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import DragZoom from './helpers/DragAndZoom/DragZoom'
const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
  & > * {
    box-sizing: border-box;
  }
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
    const cc: DragZoom = new DragZoom(boxRef.current, dragRef.current, {
      restrictPosition: (currentXY, el, outOfBox) => {
        if (outOfBox.inner.x.left) {
          console.log('outOfBox.inner.x.left', outOfBox.inner.x.left)
        }
        if (outOfBox.inner.x.right) {
          console.log('outOfBox.inner.x.right', outOfBox.inner.x.right)
        }
        return cc.areaRestrictions(currentXY, {
          type: 'outer',
          threshold: 10 * cc.ts.scale,
        })
      },
    })
    set_ctr(cc)
  }, [])
  return (
    <Container ref={eventRef}>
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
            ctr.updatePosition((ts) => {
              ts.rotate = ctr.toggleRotation(ts.rotate)
              return ts
            })
          }
        }}
      >
        R
      </RotateTestButton>
    </Container>
  )
}

export default App
