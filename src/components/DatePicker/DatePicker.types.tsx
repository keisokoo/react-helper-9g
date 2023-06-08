import { Dayjs } from 'dayjs'
import { ComparisonDateType } from '../../components/MiniCalendar/MiniCalendar.types'
import { AdditionalCss, DivAttributes } from '../../themes/styles.type'

export interface DatePickerProps extends DivAttributes {
  _css?: AdditionalCss
  _value?: Dayjs | null
  _comparisonDate?: ComparisonDateType
  _emitValue: (day: Dayjs) => void
}
