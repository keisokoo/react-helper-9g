import styled from '@emotion/styled/macro'
import { InputUnderLineStyle } from '../../components/UnderlineInput/UnderlineInput.styles'
import { addCssProps } from '../../themes/styles.helper'

const DatePickerStyle = {
  Wrap: styled.div`
    position: relative;
    & > img.toggle-calender {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      user-select: none;
    }
    input {
      ${InputUnderLineStyle}
      padding: 10px 36px 10px 0;
    }
    ${addCssProps}
  `,
}
export default DatePickerStyle
