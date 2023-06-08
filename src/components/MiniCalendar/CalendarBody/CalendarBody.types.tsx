import { Dayjs } from 'dayjs'
import { GeneratedType } from '../../../helpers/getCalendar'

export type CalendarBodyPropsType = {
  comparisonType?: 'before' | 'after'
  center?: boolean
  currentCalendar?: GeneratedType[][]
  _emitValue?: (value: Dayjs) => void
}
