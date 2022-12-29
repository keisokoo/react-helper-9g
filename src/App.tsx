import styled from '@emotion/styled/macro'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import DragOrPinchZoom from './helpers/DragAndZoom/DragOrPinchZoom'
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
  height: 300px;
  background-color: #ccc;
  position: relative;
  h1 {
    font-size: 16px;
    box-sizing: border-box;
    width: 100%;
    padding: 16px;
    background-color: #ffff00;
    margin: 0px auto;
  }
  h2 {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    box-sizing: border-box;
    width: 100%;
    padding: 16px;
    background-color: #1aff00;
    margin: 0px auto;
  }
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
  const headerRef = useRef() as MutableRefObject<HTMLDivElement>

  const [rotation, set_rotation] = useState<number>(0)
  const [ctr, set_ctr] = useState<DragOrPinchZoom>()
  useEffect(() => {
    const cc: DragOrPinchZoom = new DragOrPinchZoom(boxRef.current, {
      areaElement: dragRef.current,
      restrictElement: headerRef.current,
      restrictPosition: (currentXY, el, outOfBox) => {
        return cc.areaRestrictions(currentXY, {
          type: 'inner',
          threshold: 0 * cc.ts.scale,
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
        onTouchStart={(e) => {
          ctr?.onPinchStart(e)
          ctr?.onDragStart(e)
        }}
        onMouseDown={ctr?.onDragStart}
      >
        <Target ref={boxRef}>
          <h1 ref={headerRef}>h({rotation})</h1>
          <h2>haha</h2>
        </Target>
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
