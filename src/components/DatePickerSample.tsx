import styled from '@emotion/styled/macro'
import { Dayjs } from 'dayjs'
import { useState } from 'react'
import DatePicker from './DatePicker'

const DatePickerSampleWrap = styled.div`
  padding: 32px;
  max-width: 220px;
  * {
    box-sizing: border-box;
  }
`

interface DatePickerSampleProps {}
const DatePickerSample = ({ ...props }: DatePickerSampleProps) => {
  const [currentDate, set_currentDate] = useState<Dayjs | null>(null)
  return (
    <>
      <DatePickerSampleWrap>
        <DatePicker
          _value={currentDate}
          _emitValue={(value) => {
            set_currentDate(value)
          }}
          placeholder="날짜 입력"
        />
      </DatePickerSampleWrap>
    </>
  )
}
export default DatePickerSample
