import { keyframes } from '@emotion/react'
import styled from '@emotion/styled/macro'
import { colors, typography } from '../../themes/styles'
import { addCssProps } from '../../themes/styles.helper'
import { slideDuration } from './ToastMessage.types'

const transitionY = keyframes`
0% {
  opacity: 1;
  transform: translateY(-100%);
}
100% {
  opacity: 1;
  transform: translateY(0%);
}
`
const ToastMessageStyle = {
  Wrap: styled.div`
    position: fixed;
    z-index: 999999;
    top: calc(32px + env(safe-area-inset-top));
    left: 50%;
    transform: translate(-50%, 0%);
    max-width: 100%;
    min-width: 280px;
    ${addCssProps}
  `,
  AnimationWrap: styled.div`
    max-width: 100%;
    opacity: 0;
    transform: translateY(50%);
    animation: ${transitionY} ${slideDuration}ms ease-in 0.1s forwards;
  `,
  Body: styled.div`
    user-select: none;
    display: flex;
    align-items: center;
    text-align: center;
    box-sizing: border-box;
    margin: 0 auto;
  `,
  MessageWrap: styled.div`
    position: relative;
    display: flex;
    margin: 0 auto;
    align-items: center;
    justify-content: flex-start;
    white-space: pre-line;
    width: 100%;
  `,
  Message: styled.div`
    min-height: 60px;
    width: 100%;
    ${typography['Title/Bold']}
    color: ${colors['Primary/Default']};
    background-color: ${colors['White/White off']};
    white-space: pre-line;
    margin: 0;
    text-overflow: ellipsis;
    flex: 1;
    overflow: hidden;
    padding: 16px 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    border: 1px solid ${colors['Grayscale/Gray Lighter']};
    &.error {
      color: ${colors['Danger/Dark']};
    }
  `,
}

export default ToastMessageStyle
