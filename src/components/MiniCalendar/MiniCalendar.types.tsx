import { Dayjs } from 'dayjs'
import { AdditionalCss, DivAttributes } from '../../themes/styles.type'

export interface ComparisonDateType {
  type: 'before' | 'after'
  date?: Dayjs | null
}
export interface MiniCalendarProps extends DivAttributes {
  _defaultValue?: Dayjs | null
  _emitValue: (value: Dayjs) => void
  _comparisonDate?: ComparisonDateType
  _css?: AdditionalCss
}
