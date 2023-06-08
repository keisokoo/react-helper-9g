import { css, keyframes, SerializedStyles } from '@emotion/react'
import styled from '@emotion/styled'
import { colors, typography } from '../../themes/styles'
import { AdditionalCss } from '../../themes/styles.type'
import { ButtonProps, ColorOption, DisabledType } from './Buttons.types'

const disableIcon = css`
  &:disabled {
    background: ${colors['Grayscale/Gray Lighter']};
    background-color: ${colors['Grayscale/Gray Lighter']};
    color: #ffffff;
    box-shadow: none;
    svg {
      path {
        fill: ${colors['Grayscale/Gray Default']};
      }
    }
    cursor: default;
  }
`
const disableFill = css`
  &:disabled {
    background: ${colors['Grayscale/Gray Lighter']};
    background-color: ${colors['Grayscale/Gray Lighter']};
    color: #ffffff;
    box-shadow: none;
    cursor: default;
  }
`
const disableText = css`
  &:disabled {
    background: transparent;
    background-color: transparent;
    color: ${colors['Grayscale/Gray Lighter']};
    box-shadow: none;
    cursor: default;
  }
`
const rotate360 = keyframes`
0% {
  transform: rotate(0deg);
}
100% {
  transform: rotate(-360deg);
}`
const disabledStyles = {
  fill: disableFill,
  text: disableText,
  icon: disableIcon,
} as { [key in DisabledType]: SerializedStyles }

export const buttonAssets = (color: ColorOption, _css?: AdditionalCss) => css`
  ${color._mini ? typography['Body/Small/Bold'] : typography['Body/Large/Bold']}
  color: #ffffff;
  ${color.textColor ? `color: ${colors[color.textColor]};` : ''}
  ${color.iconColor
    ? css`path{
    fill ${colors[color.iconColor]};
  }`
    : ''}
  ${color.backgroundColor
    ? `background-color: ${colors[color.backgroundColor]};`
    : ''}
${color.borderColor
    ? `box-shadow: inset 0px 0px 0px 2px ${colors[color.borderColor]};`
    : ''}
transition: 0.3s ease-in-out;
  &:hover {
    ${color.hoverTextColor ? `color: ${colors[color.hoverTextColor]};` : ''}
    ${color.hoverIconColor
      ? css`path{
    fill ${colors[color.hoverIconColor]};
  }`
      : ''}
    ${color.hoverBackgroundColor
      ? `background-color: ${colors[color.hoverBackgroundColor]};`
      : ''}
${color.hoverBorderColor
      ? `box-shadow: inset 0px 0px 0px 1px ${colors[color.hoverBorderColor]}`
      : ''}
  }
  border-radius: ${color._mini ? '8px' : '12px'};
  ${disabledStyles[color.disabledType]}
  .loading-icon {
    animation: ${rotate360} 1s infinite linear;
  }
  ${_css ? _css : ''}
`

export const ButtonStyle = styled.button(
  ({
    width,
    height,
    flex,
    padding,
    margin,
    _css,
    ...props
  }: ButtonProps) => css`
    border: none;
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    ${height
      ? css`
          height: ${typeof height === 'number' ? `${height}px` : height};
        `
      : ''}
    ${width
      ? css`
          width: ${typeof width === 'number' ? `${width}px` : width};
        `
      : ''}
        ${flex
      ? css`
          flex: ${flex};
        `
      : ''}
        ${padding
      ? css`
          padding: ${padding};
        `
      : ''}
      ${margin
      ? css`
          margin: ${margin};
        `
      : ''}
    ${_css ? _css : ''}
  `
)
export const CSVDownloadButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors['Success/Default']};
  transition: 0.3s;
  &:hover {
    background-color: ${colors['Success/Dark']};
  }
  &:disabled {
    background-color: ${colors['Grayscale/Gray Lighter']};
  }
`
