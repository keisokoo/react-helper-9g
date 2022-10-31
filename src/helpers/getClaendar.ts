import dayjs, { Dayjs } from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(weekOfYear)
export interface GeneratedType {
  current: Dayjs
  isSelected: boolean
  isGrayed: boolean
  isToday: boolean
  isBefore: boolean
  isAfter: boolean
}
export const generateThreeCalendar = (
  defaultDate: Dayjs,
  selectedDate?: Dayjs,
  comparisonDate?: Dayjs
) => {
  return {
    prev: generateCalendar(
      defaultDate.subtract(1, 'month'),
      undefined,
      comparisonDate ?? selectedDate
    ),
    current: generateCalendar(
      defaultDate,
      selectedDate,
      comparisonDate ?? selectedDate
    ),
    next: generateCalendar(
      defaultDate.add(1, 'month'),
      undefined,
      comparisonDate ?? selectedDate
    ),
  }
}
const generateCalendar = (
  defaultDate: Dayjs,
  selectedDate?: Dayjs,
  comparisonDate?: Dayjs
): GeneratedType[][] => {
  defaultDate =
    dayjs.isDayjs(defaultDate) && defaultDate.isValid() ? defaultDate : dayjs()
  const today = dayjs()
  const comparison =
    dayjs.isDayjs(comparisonDate) && comparisonDate.isValid()
      ? comparisonDate
      : null
  const standardDate =
    dayjs.isDayjs(selectedDate) && selectedDate.isValid() ? selectedDate : null
  const startWeek = defaultDate.clone().startOf('month').week()
  const endWeek =
    defaultDate.clone().endOf('month').week() === 1
      ? 53
      : defaultDate.clone().endOf('month').week()
  let calendar = []
  for (let week = startWeek; week <= endWeek; week++) {
    calendar.push(
      Array(7)
        .fill(0)
        .map((n, i) => {
          const current: Dayjs = defaultDate
            .clone()
            .week(week)
            .startOf('week')
            .add(n + i, 'day')
          const isSelected =
            standardDate?.format('YYYYMMDD') === current.format('YYYYMMDD')
          const isGrayed = current.format('MM') !== defaultDate.format('MM')
          const isToday =
            current.format('YYYYMMDD') === today.format('YYYYMMDD')
          const isAfter = comparison
            ? current.isAfter(comparison, 'day')
            : false
          const isBefore = comparison
            ? current.isBefore(comparison, 'day')
            : false
          return {
            current,
            isBefore,
            isAfter,
            isSelected,
            isGrayed,
            isToday,
          }
        })
    )
  }
  return calendar
}
export default generateCalendar
