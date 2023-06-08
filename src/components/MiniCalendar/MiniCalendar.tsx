import { css } from '@emotion/react'
import dayjs, { Dayjs } from 'dayjs'
import {
  MutableRefObject,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  ImagesMiniCalendarCalendarInfo,
  ImagesMiniCalendarChevronDoubleLeft,
  ImagesMiniCalendarChevronDoubleRight,
  ImagesMiniCalendarChevronLeft,
  ImagesMiniCalendarChevronRight,
} from '../../assets'
import { GrayScaleOutline } from '../../components/Buttons'
import { GeneratedType, generateThreeCalendar } from '../../helpers/getCalendar'
import { typography } from '../../themes/styles'
import CalendarBody from './CalendarBody'
import { isTouchEvent } from './MiniCalendar.helpers'
import M from './MiniCalendar.styles'
import { MiniCalendarProps } from './MiniCalendar.types'
/**
 *
 *
 * @param {NodeListOf<Element>} el
 * @return {*}  {HTMLDivElement[]}
 */
export const getDoms = (
  el: NodeListOf<Element> | HTMLCollection
): HTMLDivElement[] => {
  let els: HTMLDivElement[] = []
  for (let i: number = 0; i <= el.length - 1; i++) {
    els.push(el[i] as HTMLDivElement)
  }
  return els
}
const {
  BottomBox,
  BottomControlBox,
  ButtonWrap,
  CalendarCarouselInner,
  CalendarCarouselWrap,
  DescBox,
  MiniCalendarBody,
  MiniCalendarWrap,
  MonthTitle,
  ScheduleTop,
} = M

const initialDate = dayjs()
const getComputedSize = (el: HTMLDivElement, target: 'width' | 'height') => {
  let targetSize = window.getComputedStyle(el)[target]
  let toNumber = Number(targetSize.replace('px', ''))
  return !isNaN(toNumber) ? toNumber : 0
}
const MiniCalendar = forwardRef<HTMLDivElement, MiniCalendarProps>(
  ({ _emitValue, _defaultValue, _comparisonDate, _css, ...props }, refs) => {
    const calendarRef = useRef() as MutableRefObject<HTMLDivElement>
    const innerRef = useRef() as MutableRefObject<HTMLDivElement>
    const [defaultMonth, set_defaultMonth] = useState<Dayjs | null>(null)

    useEffect(() => {
      if (_defaultValue && dayjs.isDayjs(_defaultValue)) {
        set_defaultMonth(_defaultValue)
      } else {
        set_defaultMonth(null)
      }
    }, [_defaultValue])

    const [calendarGroup, set_calendarGroup] = useState<{
      prev: GeneratedType[][]
      current: GeneratedType[][]
      next: GeneratedType[][]
    }>()
    const [calendarRes, set_calendarRes] = useState<{
      prev: GeneratedType[][]
      current: GeneratedType[][]
      next: GeneratedType[][]
    }>()
    const draggableRef = useRef(false) as MutableRefObject<boolean>
    const dragged = useRef(false) as MutableRefObject<boolean>
    const totalX = useRef(930) as MutableRefObject<number>
    const centerX = useRef(-310) as MutableRefObject<number>
    const translateX = useRef(-310) as MutableRefObject<number>
    const startTranslateX = useRef(-310) as MutableRefObject<number>
    const beforeXPosition = useRef(-310) as MutableRefObject<number>
    const timeoutRef = useRef() as MutableRefObject<NodeJS.Timeout>
    const movedX = useRef(0) as MutableRefObject<number>
    const forUpdateX = useRef(0) as MutableRefObject<number>
    const velocity = useRef(0) as MutableRefObject<number>
    const lastVelocity = useRef(0) as MutableRefObject<number>
    const lastValue = useRef(0) as MutableRefObject<number>
    const updateFrame = useRef(0) as MutableRefObject<number>
    useEffect(() => {
      const calculateCalendarSize = () => {
        let totalSize = getComputedSize(calendarRef.current, 'width')
        innerRef.current.style.width =
          getComputedSize(calendarRef.current, 'width') + 'px'
        totalX.current = totalSize
        centerX.current = totalSize * -1
        translateX.current = totalSize * -1
        startTranslateX.current = totalSize * -1
        beforeXPosition.current = totalSize * -1
        if (!innerRef.current) return
        innerRef.current.style.transform = `translateX(-${totalSize}px)`
      }
      calculateCalendarSize()
      window.addEventListener('resize', calculateCalendarSize)
      return () => {
        window.removeEventListener('resize', calculateCalendarSize)
      }
    }, [])
    useEffect(() => {
      const calendarResponse = generateThreeCalendar(
        defaultMonth ?? dayjs(),
        _defaultValue ?? initialDate,
        _comparisonDate?.date
      )
      set_calendarRes(calendarResponse)
      set_calendarGroup({
        prev: calendarResponse.current,
        current: calendarResponse.current,
        next: calendarResponse.current,
      })
      innerRef.current.style.opacity = '1'
    }, [defaultMonth, _defaultValue, _comparisonDate])
    useEffect(() => {
      if (calendarRes && innerRef.current) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
          let childNodes = innerRef.current.querySelectorAll('.calendar-body')
          const calendarBodies = getDoms(childNodes)
          let totalWidth = calendarBodies.reduce((prev, curr) => {
            let currentWidth = curr.getBoundingClientRect().width
            prev += currentWidth
            return prev
          }, 0)
          let averageWidth = totalWidth / 3
          totalX.current = totalWidth
          innerRef.current.style.transform = `translateX(-${averageWidth}px)`
          translateX.current = -1 * averageWidth
          centerX.current = -1 * averageWidth
          set_calendarGroup(calendarRes)
        }, 0)
      }
      return () => {
        clearTimeout(timeoutRef.current)
      }
    }, [calendarRes])

    const dragUpdate = () => {
      if (!innerRef.current) return
      const targetWidth = totalX.current / 3
      if (forUpdateX.current === 0) {
        velocity.current = velocity.current * 0.8
        velocity.current = (velocity.current * 10) / 10
        if (Math.floor(Math.abs(velocity.current)) === 0) {
          cancelAnimationFrame(updateFrame.current)
          innerRef.current.style.transform = `translateX(${forUpdateX.current}px)`
          set_defaultMonth((prev) =>
            prev ? prev.clone().subtract(1, 'month') : prev
          )
        } else {
          translateX.current = velocity.current
          innerRef.current.style.transform = `translateX(${translateX.current}px)`
          updateFrame.current = requestAnimationFrame(dragUpdate)
        }
      } else if (forUpdateX.current === totalX.current * -1 + targetWidth) {
        let snapMoving =
          lastValue.current + (lastVelocity.current - velocity.current)
        velocity.current = velocity.current * 0.8
        velocity.current = (velocity.current * 10) / 10
        if (Math.floor(snapMoving) <= forUpdateX.current) {
          cancelAnimationFrame(updateFrame.current)
          innerRef.current.style.transform = `translateX(${forUpdateX.current}px)`
          set_defaultMonth((prev) =>
            prev ? prev.clone().add(1, 'month') : prev
          )
        } else {
          translateX.current = snapMoving
          innerRef.current.style.transform = `translateX(${translateX.current}px)`
          updateFrame.current = requestAnimationFrame(dragUpdate)
        }
      } else {
        let snapMoving =
          lastValue.current + (lastVelocity.current - velocity.current)
        velocity.current = velocity.current * 0.8
        velocity.current = (velocity.current * 10) / 10
        if (
          Math.abs(Math.floor(centerX.current) - Math.floor(snapMoving)) <= 1
        ) {
          cancelAnimationFrame(updateFrame.current)
          innerRef.current.style.transform = `translateX(${forUpdateX.current}px)`
        } else {
          translateX.current = snapMoving
          innerRef.current.style.transform = `translateX(${translateX.current}px)`
          updateFrame.current = requestAnimationFrame(dragUpdate)
        }
      }
    }
    const dragStart = (
      e:
        | React.MouseEvent<HTMLDivElement, MouseEvent>
        | React.TouchEvent<HTMLDivElement>
    ) => {
      cancelAnimationFrame(updateFrame.current)
      draggableRef.current = true
      dragged.current = false
      speed.current = 0
      beforeXPosition.current = isTouchEvent(e)
        ? e.touches[0].clientX
        : e.clientX
      startTranslateX.current = translateX.current
    }
    const speed = useRef(0) as MutableRefObject<number>
    const dragMove = (
      e:
        | React.MouseEvent<HTMLDivElement, MouseEvent>
        | React.TouchEvent<HTMLDivElement>
    ) => {
      if (draggableRef.current) {
        dragged.current = true
        let clientX = isTouchEvent(e) ? e.touches[0].clientX : e.clientX
        const oldX = translateX.current
        const moved = clientX - beforeXPosition.current
        movedX.current = moved
        const targetWidth = totalX.current / 3
        translateX.current = Math.min(
          0,
          Math.max(
            -1 * totalX.current + targetWidth,
            startTranslateX.current + moved
          )
        )
        speed.current = translateX.current - oldX
        if (!innerRef.current) return
        innerRef.current.style.transform = `translateX(${translateX.current}px)`
      }
    }
    const dragEnd = (
      e:
        | React.MouseEvent<HTMLDivElement, MouseEvent>
        | React.TouchEvent<HTMLDivElement>
    ) => {
      if (dragged.current && Math.abs(movedX.current) > 5) {
        dragged.current = false
        forUpdateX.current = centerX.current
        lastValue.current = translateX.current
        velocity.current =
          centerX.current > translateX.current
            ? centerX.current - translateX.current
            : centerX.current - translateX.current
        const targetWidth = totalX.current / 3

        if (Math.abs(speed.current) > 5) {
          if (speed.current < 0) {
            forUpdateX.current = totalX.current * -1 + targetWidth
            velocity.current = forUpdateX.current - translateX.current
          } else {
            forUpdateX.current = 0
            velocity.current = translateX.current
          }
        } else {
          if (translateX.current > (targetWidth * -1) / 2) {
            forUpdateX.current = 0
            velocity.current = translateX.current
          } else if (translateX.current < targetWidth * -1 - targetWidth / 2) {
            forUpdateX.current = totalX.current * -1 + targetWidth
            velocity.current = forUpdateX.current - translateX.current
          }
        }
        lastVelocity.current = velocity.current
        updateFrame.current = requestAnimationFrame(dragUpdate)
      } else if (draggableRef.current) {
        dragged.current = false
        let dayPartElement = (e.target as HTMLElement).closest('.day-part')
        if (dayPartElement && dayPartElement.getAttribute('data-date')) {
          _emitValue(dayjs(dayPartElement.getAttribute('data-date')))
        }
      }
      draggableRef.current = false
    }
    return (
      <>
        <MiniCalendarWrap ref={refs} _css={_css} {...props}>
          <ScheduleTop>
            <img
              src={ImagesMiniCalendarChevronDoubleLeft}
              alt="prev year"
              onClick={() => {
                set_defaultMonth((prev) =>
                  (prev ?? initialDate).clone().subtract(1, 'year')
                )
              }}
            />
            <ButtonWrap>
              <img
                src={ImagesMiniCalendarChevronLeft}
                alt="prev month"
                onClick={() => {
                  set_defaultMonth((prev) =>
                    (prev ?? initialDate).clone().subtract(1, 'month')
                  )
                }}
              />
              <MonthTitle className="title">
                {dayjs.isDayjs(defaultMonth)
                  ? defaultMonth.format('YYYY년 MM월')
                  : initialDate.format('YYYY년 MM월')}
              </MonthTitle>
              <img
                src={ImagesMiniCalendarChevronRight}
                alt="next month"
                onClick={() => {
                  set_defaultMonth((prev) =>
                    (prev ?? initialDate).clone().add(1, 'month')
                  )
                }}
              />
            </ButtonWrap>
            <img
              src={ImagesMiniCalendarChevronDoubleRight}
              alt="next year"
              onClick={() => {
                set_defaultMonth((prev) =>
                  (prev ?? initialDate).clone().add(1, 'year')
                )
              }}
            />
          </ScheduleTop>
          <MiniCalendarBody>
            <CalendarCarouselWrap ref={calendarRef}>
              <CalendarCarouselInner
                ref={innerRef}
                style={{ opacity: 0 }}
                onMouseDown={dragStart}
                onMouseMove={dragMove}
                onMouseUp={dragEnd}
                onMouseLeave={dragEnd}
                onTouchStart={dragStart}
                onTouchMove={dragMove}
                onTouchEnd={dragEnd}
              >
                {calendarGroup?.prev && (
                  <CalendarBody
                    currentCalendar={calendarGroup.prev}
                    comparisonType={_comparisonDate?.type}
                  />
                )}
                <CalendarBody
                  center={true}
                  currentCalendar={calendarGroup?.current}
                  _emitValue={_emitValue}
                  comparisonType={_comparisonDate?.type}
                />
                {calendarGroup?.next && (
                  <CalendarBody
                    currentCalendar={calendarGroup.next}
                    comparisonType={_comparisonDate?.type}
                  />
                )}
              </CalendarCarouselInner>
            </CalendarCarouselWrap>
          </MiniCalendarBody>
          <BottomBox>
            <BottomControlBox>
              <DescBox>
                <img src={ImagesMiniCalendarCalendarInfo} alt="info" />
                <div>
                  좌우로 드래그하여
                  <br />
                  다음/이전 달로 이동할 수 있습니다.
                </div>
              </DescBox>
              <GrayScaleOutline
                _mini={true}
                _css={css`
                  padding: 5px 12px;
                  ${typography['Body/Small/Bold']}
                `}
                onClick={() => {
                  _emitValue(dayjs())
                }}
              >
                오늘
              </GrayScaleOutline>
            </BottomControlBox>
          </BottomBox>
        </MiniCalendarWrap>
      </>
    )
  }
)
export default MiniCalendar
