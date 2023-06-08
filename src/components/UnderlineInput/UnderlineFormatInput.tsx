import classNames from 'classnames'
import { forwardRef, MutableRefObject, useRef, useState } from 'react'
import { ImagesInputRemove } from '../../assets'
import FakeReplaceHolder from '../FakePlaceHolder'
import S, { InputUnderLineStyle } from './UnderlineInput.styles'
import { UnderlineFormatInputProps } from './UnderlineInput.types'

import styled from '@emotion/styled'
import { PatternFormat } from 'react-number-format'

const FormatInput = styled(PatternFormat)`
  ${InputUnderLineStyle}
`
export type GetFormatsType = 'phone' | 'residentNumber'
export const getFormats = (type: GetFormatsType, value?: string) => {
  if (type === 'phone' && value) {
    return value.length > 10 ? `###-####-####` : `###-###-#####`
  }

  if (type === 'residentNumber') {
    return `######-#######`
  }
  return '######################'
}
const UnderlineFormatInput = forwardRef<
  HTMLDivElement,
  UnderlineFormatInputProps
>(
  (
    {
      _el,
      value,
      label,
      handleValue,
      _css,
      style,
      after,
      guide,
      error,
      wrapProps,
      customInput,
      ...props
    },
    ref
  ) => {
    const [focused, set_focused] = useState(false)
    const inputRef = useRef() as MutableRefObject<HTMLInputElement>
    return (
      <>
        <S.Wrap
          ref={ref}
          className={classNames({ error: error, isLabelInput: label, after })}
          _css={_css}
          {...wrapProps}
        >
          {label && (
            <FakeReplaceHolder
              value={!!value}
              onClick={() => {
                inputRef.current.focus()
                set_focused(true)
              }}
            >
              {!!value && error ? error : label}
            </FakeReplaceHolder>
          )}
          <FormatInput
            valueIsNumericString
            getInputRef={inputRef}
            value={value ?? ''}
            onValueChange={(value) => handleValue(value.value)}
            onFocus={() => set_focused(true)}
            onBlur={() => set_focused(false)}
            {...props}
          />
          {!props.readOnly && (
            <S.RemoveButton
              className={classNames(
                { active: !!value, fadeOut: !focused, after },
                'remove-btn'
              )}
              {...(!!value && { onClick: () => handleValue('') })}
            >
              {!!value && <img src={ImagesInputRemove} alt="text remove" />}
            </S.RemoveButton>
          )}
          {after && <S.AfterIcon>{after}</S.AfterIcon>}
          {guide && <S.Guide>{guide}</S.Guide>}
          {_el && _el}
        </S.Wrap>
      </>
    )
  }
)
export default UnderlineFormatInput
