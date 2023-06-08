import { useCallback, useEffect } from 'react'

const useOutsideEvent = (
  innerSideDom: HTMLDivElement | string,
  callback: (currentTarget: Element) => void,
  eventType: keyof WindowEventMap = 'click'
) => {
  const CallBack = useCallback(
    (currentTarget: Element) => {
      callback(currentTarget)
    },
    [callback]
  )
  useEffect(() => {
    function clickOutside(e: Event) {
      const EventTarget = e.target as Element
      const wrapTarget =
        typeof innerSideDom !== 'string'
          ? innerSideDom
          : document.querySelector(innerSideDom)
      if (EventTarget && wrapTarget && !wrapTarget.contains(EventTarget)) {
        CallBack(EventTarget)
      }
    }
    window.addEventListener(eventType, clickOutside, false)
    return () => {
      window.removeEventListener(eventType, clickOutside)
    }
  }, [innerSideDom, eventType, CallBack])
}
export default useOutsideEvent
