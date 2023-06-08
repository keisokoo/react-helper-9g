import classNames from 'classnames'
import { forwardRef, MutableRefObject, useRef, useState } from 'react'
import { ImagesInputRemove } from '../../assets'
import FakeReplaceHolder from '../../components/FakePlaceHolder'
import S, { InputUnderLineStyle } from './UnderlineInput.styles'
import { UnderlineNumberInputProps } from './UnderlineInput.types'

import styled from '@emotion/styled'
import { NumericFormat } from 'react-number-format'

const NumericInput = styled(NumericFormat)`
  ${InputUnderLineStyle}
`
const UnderlineNumberInput = forwardRef<
  HTMLDivElement,
  UnderlineNumberInputProps
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
      noRemoveButton,
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
          className={classNames({
            error: error,
            isLabelInput: label,
            noRemoveButton,
            after,
          })}
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
          <NumericInput
            getInputRef={inputRef}
            value={value ?? ''}
            onValueChange={(value, sourceInfo) => {
              if (props.onValueChange) {
                props.onValueChange(value, sourceInfo)
              } else {
                handleValue(value.floatValue ?? null)
              }
            }}
            onFocus={() => set_focused(true)}
            onBlur={() => set_focused(false)}
            thousandSeparator={props.thousandSeparator ?? true}
            allowNegative={props.allowNegative ?? false}
            {...props}
          />
          {!noRemoveButton && !props.readOnly && (
            <S.RemoveButton
              className={classNames(
                { active: !!value, fadeOut: !focused, after },
                'remove-btn'
              )}
              {...(!!value && { onClick: () => handleValue(null) })}
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
export default UnderlineNumberInput
