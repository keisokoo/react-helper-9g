import { css } from '@emotion/react'
import dayjs, { Dayjs } from 'dayjs'
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  InputAttributes,
  NumberFormatBase,
  NumberFormatValues,
  PatternFormatProps,
  SourceInfo,
  usePatternFormat,
} from 'react-number-format'
import { v4 as uuid } from 'uuid'
import { ImagesDatePickerCalender } from '../../assets'
import MiniCalendar from '../../components/MiniCalendar'
import useOutsideEvent from '../../hooks/useOutsideEvent'
import { extractNumber } from './DatePicker.helpers'
import S from './DatePicker.styles'
import { DatePickerProps } from './DatePicker.types'

const formatString = (value: string) => {
  const year = value.substring(0, 4)
  let month = value.substring(4, 6)
  let day = value.substring(6, 8)
  if (month.length === 1 && Number(month[0]) > 1) {
    month = `0${month[0]}`
  } else if (month.length === 2) {
    // set the lower and upper boundary
    if (Number(month) === 0) {
      month = `01`
    } else if (Number(month) > 12) {
      month = `12`
    }
  }
  if (
    day.length === 2 &&
    Number(day) > dayjs(`${year}-${month}-01`).daysInMonth()
  ) {
    day = dayjs(`${year}-${month}-01`).daysInMonth().toString()
  }
  return `${year}${month}${day}`
}

const DatePicker = ({
  _css,
  _value,
  _comparisonDate,
  _emitValue,
  ...props
}: DatePickerProps) => {
  const { format, onValueChange, ...rest } = usePatternFormat({
    ...props,
    format: '####년 ##월 ##일',
  } as PatternFormatProps<InputAttributes>)
  const [day, set_day] = useState<Dayjs | null>(null)
  const [dayString, set_dayString] = useState<string>('')
  const [open, set_open] = useState<boolean>(false)
  const calenderRef = useRef() as MutableRefObject<HTMLDivElement>
  const wrapRef = useRef() as MutableRefObject<HTMLDivElement>
  const uuidRef = useRef(`drop_${uuid()}`) as MutableRefObject<string>
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>
  const handleDayString = useCallback((value: Dayjs | null) => {
    set_dayString(value ? value.format('YYYY년 MM월 DD일') : '')
  }, [])
  useEffect(() => {
    if (_value && dayjs(_value).isValid()) {
      console.log('_value', _value)
      set_day(_value)
      handleDayString(_value)
    } else {
      set_day(null)
      handleDayString(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_value, handleDayString])

  useOutsideEvent(
    `#${uuidRef.current}`,
    (currentTarget) => {
      if (wrapRef.current && !wrapRef.current.contains(currentTarget)) {
        set_open(false)
      }
    },
    'mousedown'
  )
  const toggleOpen = () => {
    set_open((prev) => !prev)
  }

  const _format = (value: string) => {
    if (value.length === 8) {
      return format!(formatString(value))
    } else {
      return format!(value)
    }
  }

  const handleChange = (values: NumberFormatValues, sourceInfo: SourceInfo) => {
    if (values.value.length === 8) {
      _emitValue(dayjs(formatString(values.value), 'YYYYMMDD'))
    }
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    let currentValue = extractNumber(e.target.value)
    let inputYearMonth = currentValue.slice(0, 6)
    let inputDay = currentValue.slice(6, currentValue.length)
    if (
      currentValue.length === 6 &&
      Number(currentValue.slice(4, 5)) !== 0 &&
      Number(currentValue.slice(5, currentValue.length)) !== 0
    ) {
      inputYearMonth = currentValue.slice(0, 4) + '0' + currentValue.slice(4, 5)
      inputDay = currentValue.slice(5, currentValue.length)
      const addZero = inputYearMonth + '0' + inputDay
      _emitValue(dayjs(addZero, 'YYYYMMDD'))
    } else if (currentValue.length === 7 && Number(inputDay) !== 0) {
      const addZero = inputYearMonth + '0' + inputDay
      _emitValue(dayjs(addZero, 'YYYYMMDD'))
    } else {
      set_dayString('')
      setTimeout(() => {
        handleDayString(day)
      }, 0)
    }
  }
  return (
    <>
      <S.Wrap ref={wrapRef} _css={_css} {...props}>
        <NumberFormatBase
          format={_format}
          getInputRef={inputRef}
          placeholder={dayjs().format('YYYY년 MM월 DD일')}
          value={dayString}
          onValueChange={handleChange}
          onBlur={handleBlur}
          {...rest}
        />
        <img
          className="toggle-calender"
          src={ImagesDatePickerCalender}
          alt={'Calender'}
          onClick={toggleOpen}
        />
        {open && (
          <MiniCalendar
            className="mini-calendar"
            ref={calenderRef}
            id={uuidRef.current}
            _comparisonDate={_comparisonDate}
            _css={css`
              position: absolute;
              width: 350px;
              border-radius: 20px;
              box-shadow: 0px 16px 32px rgba(214, 216, 218, 0.7);
              margin-top: 4px;
              z-index: 9;
              &:focus {
                z-index: 9999;
              }
            `}
            _defaultValue={day}
            _emitValue={(value) => {
              _emitValue(value)
              set_open(false)
            }}
          />
        )}
      </S.Wrap>
    </>
  )
}
export default DatePicker
