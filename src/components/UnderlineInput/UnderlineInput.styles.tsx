import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled/macro'
import { colors, typography } from '../../themes/styles'
import { addCssProps } from '../../themes/styles.helper'
import { AdditionalCss } from '../../themes/styles.type'

const fadeIn = keyframes`
  from{
    opacity: 0;
  }
  to{
    opacity: 1;
  }
`

export const InputUnderLineStyle = css`
  border-top: none;
  border-left: none;
  border-right: none;
  outline: none;
  width: 100%;
  padding: 10px 0;
  border-bottom: 1px solid ${colors['Grayscale/Gray Lighter']};
  background-color: transparent;
  ${typography['Body/Large/Bold']}
  &::placeholder {
    color: ${colors['Grayscale/Gray Lighter']};
  }
  color: ${colors['Grayscale/Black light']};
  transition: border-bottom 0.3s linear;
  &:focus {
    border-bottom: 1px solid ${colors['Primary/Default']};
  }
`
const UnderlineInputStyle = {
  Wrap: styled.div`
    position: relative;
    &.error {
      .label {
        color: ${colors['Danger/Default']};
      }
      input {
        border-bottom: 1px solid ${colors['Danger/Default']};
      }
    }
    &.isLabelInput {
      input {
        padding: 20px 34px 2px 0;
      }
      .remove-btn {
        bottom: initial;
        top: 20px;
        height: 26px;
      }
    }
    &.after {
      input {
        padding: 10px 70px 10px 0;
      }
      &.noRemoveButton {
        input {
          padding: 10px 34px 10px 0;
        }
      }
    }
    /* &.readOnly {
      input,
      input:focus {
        border-bottom: none;
      }
    } */
    ${addCssProps}
  `,

  RemoveButton: styled.div`
    position: absolute;
    right: 0;
    width: 34px;
    height: 100%;
    bottom: 0;
    z-index: 1;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    &.active {
      animation: ${fadeIn} 0.15s linear 1 normal forwards;
      cursor: pointer;
    }
    &.fadeOut {
      opacity: 0 !important;
    }
    &.after {
      right: 36px;
    }
    ${addCssProps}
  `,

  Guide: styled.div`
    padding-top: 8px;
    ${typography['Body/Caption/Regular']}
    color: ${colors['Grayscale/Gray Dark']};
    min-height: 18px;
  `,
  Input: styled.input(
    ({ _css }: { _css?: AdditionalCss }) => css`
      ${InputUnderLineStyle}
      ${_css && _css}
    `
  ),

  AfterIcon: styled.div`
    position: absolute;
    height: 100%;
    width: 36px;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  `,
}
export default UnderlineInputStyle
