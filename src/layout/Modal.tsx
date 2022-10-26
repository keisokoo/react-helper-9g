import styled from '@emotion/styled/macro'
import { MutableRefObject, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

// src/index.scss 에 모달 css 포함
// public/index.html 에 <div id="modal"></div> 포함

const ModalWrap = styled.div`
  position: relative;
  z-index: 11;
  background: #ffffff;
  border-radius: 18px;
  width: calc(100% - 60px);
  min-height: 156px;
  max-width: 360px;
  outline: none;
`

const ModalBackground = styled.div`
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`
interface ModalProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  onClose: () => void
  open: boolean
}
const Modal = ({ open, onClose, children, ...props }: ModalProps) => {
  const wrapRef = useRef() as MutableRefObject<HTMLDivElement>
  const rootRef = useRef(
    document.querySelector('#root')!
  ) as MutableRefObject<HTMLDivElement>
  const bodyRef = useRef(document.body!) as MutableRefObject<HTMLDivElement>

  useEffect(() => {
    if (bodyRef.current && rootRef.current) {
      if (open) {
        bodyRef.current.classList.add('visible')
        bodyRef.current.classList.remove('hide')
        if (wrapRef.current) {
          wrapRef.current.focus()
        }
      } else {
        bodyRef.current.classList.remove('visible')
        bodyRef.current.classList.add('hide')
      }
    }
  }, [open])
  return ReactDOM.createPortal(
    <>
      <ModalWrap tabIndex={0} ref={wrapRef} {...props}>
        {children}
      </ModalWrap>
      {open && (
        <ModalBackground
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
        />
      )}
    </>,
    document.querySelector('#modal')!
  )
}
export default Modal
