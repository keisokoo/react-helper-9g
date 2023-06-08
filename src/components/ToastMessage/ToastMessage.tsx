import { default as cn } from 'classnames'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../hooks/reduxHooks'
import { ToastType, cleanToast, selectToast } from '../../redux/toastSlice'
import S from './ToastMessage.styles'
import {
  ToastMessageProps,
  hideDuration,
  slideDuration,
  toastDuration,
} from './ToastMessage.types'

const callHide = (el: HTMLElement) => {
  const toastDom = el
  const boundHeight = el.getBoundingClientRect().height + 32
  const startTime = performance.now()
  const easeOutCubic = (t: number) => --t * t * t + 1
  return new Promise((resolve) => {
    const hide = () => {
      const progress = (performance.now() - startTime) / hideDuration
      const amount = easeOutCubic(progress)
      const amountHeight = amount * -1 * boundHeight
      toastDom.style.transform = `translate(-50%,${amountHeight.toFixed(2)}px)`
      toastDom.style.opacity = `${1 - amount}`
      if (progress < 0.99) {
        window.requestAnimationFrame(hide)
      } else {
        resolve('end')
      }
    }
    hide()
  })
}
const ToastMessage = ({ _css, ...props }: ToastMessageProps) => {
  const toast = useSelector(selectToast)
  const dispatch = useAppDispatch()
  const [toastMessage, set_toastMessage] = useState<ToastType[]>([])

  useEffect(() => {
    if (toast && toast.message) {
      set_toastMessage((prev) => [...prev, toast])
      dispatch(cleanToast())
    }
  }, [toast, dispatch])
  const removeToast = useCallback(
    async (notify: ToastType, toastId: string) => {
      const toastDom = document.querySelector(`#${toastId}`) as HTMLElement
      if (!toastDom) return
      await callHide(toastDom)
      set_toastMessage((prev) =>
        prev.filter((val) => val.created !== notify.created)
      )
    },
    []
  )
  return (
    <>
      {toastMessage &&
        toastMessage.map((item, index) => {
          return (
            <S.Wrap
              key={item.created}
              id={`toast-${item.created}`}
              style={{ animationDelay: toastDuration + 's' }}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                removeToast(item, `toast-${item.created}`)
              }}
              onAnimationStart={() => {
                const hideStartDuration = toastDuration * 1000 + slideDuration
                setTimeout(() => {
                  removeToast(item, `toast-${item.created}`)
                }, hideStartDuration)
              }}
              {...props}
            >
              <S.AnimationWrap>
                <S.Body
                  className={item.type}
                  {...(toastMessage.length > 1 &&
                    index === 0 && { style: { boxShadow: 'none' } })}
                >
                  <S.MessageWrap>
                    <S.Message className={cn({ error: item.type === 'error' })}>
                      {item.message}
                    </S.Message>
                  </S.MessageWrap>
                </S.Body>
              </S.AnimationWrap>
            </S.Wrap>
          )
        })}
    </>
  )
}
export default ToastMessage
