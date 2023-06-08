import classNames from 'classnames'
import { MutableRefObject, useRef } from 'react'
import MiniCalendarStyles from '../MiniCalendar.styles'
import { CalendarBodyPropsType } from './CalendarBody.types'

const {
  DayColumn,
  DayPart,
  MiniCalendarDays,
  MiniCalendarRow,
  SelectedBackground,
  TodayBackground,
  Weeks,
  WeeksRow,
} = MiniCalendarStyles

const CalendarBody = ({
  comparisonType,
  center,
  currentCalendar,
  _emitValue,
  ...props
}: CalendarBodyPropsType) => {
  const bodyRef = useRef() as MutableRefObject<HTMLDivElement>
  return (
    <MiniCalendarDays
      ref={bodyRef}
      className={classNames({ center }, 'calendar-body')}
    >
      <WeeksRow className="week">
        <Weeks>일</Weeks>
        <Weeks>월</Weeks>
        <Weeks>화</Weeks>
        <Weeks>수</Weeks>
        <Weeks>목</Weeks>
        <Weeks>금</Weeks>
        <Weeks>토</Weeks>
      </WeeksRow>
      {currentCalendar &&
        currentCalendar.map((week, index) => (
          <MiniCalendarRow key={'week' + index}>
            {week.map((day, _index) => {
              const {
                isGrayed,
                isSelected,
                isToday,
                isAfter,
                isBefore,
                endBetween,
                startBetween,
              } = day
              return (
                <DayColumn
                  key={'day' + _index}
                  className={classNames({
                    isGrayed,
                    isSelected,
                    isToday,
                    isAfter: isAfter && comparisonType === 'after',
                    isBefore: isBefore && comparisonType === 'before',
                    endBetween,
                    startBetween,
                  })}
                >
                  <DayPart>
                    <div
                      className="day-part"
                      data-date={day.current.format('YYYY-MM-DD')}
                    >
                      <span>{day.current.format('D')}</span>
                      {isToday && <TodayBackground />}
                      {isSelected && <SelectedBackground />}
                    </div>
                  </DayPart>
                </DayColumn>
              )
            })}
          </MiniCalendarRow>
        ))}
    </MiniCalendarDays>
  )
}
export default CalendarBody
