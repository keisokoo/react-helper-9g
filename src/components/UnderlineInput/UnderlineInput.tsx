import classNames from 'classnames'
import { forwardRef, MutableRefObject, useRef, useState } from 'react'
import { ImagesInputRemove } from '../../assets'
import FakeReplaceHolder from '../../components/FakePlaceHolder'
import S from './UnderlineInput.styles'
import { UnderlineInputProps } from './UnderlineInput.types'

const UnderlineInput = forwardRef<HTMLDivElement, UnderlineInputProps>(
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
            noRemoveButton,
            isLabelInput: label,
            after,
            readOnly: props.readOnly,
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
          <S.Input
            ref={inputRef}
            value={value ?? ''}
            onChange={(e) => handleValue(e.target.value)}
            onFocus={() => set_focused(true)}
            onBlur={() => set_focused(false)}
            {...props}
          />
          {!noRemoveButton && !props.readOnly && (
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
export default UnderlineInput
