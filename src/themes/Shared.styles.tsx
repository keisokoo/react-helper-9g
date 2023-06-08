import { css, SerializedStyles } from '@emotion/react'
import styled from '@emotion/styled/macro'
import { CSSProperties } from 'react'
import { colors, typography } from './styles'
import { addCssProps } from './styles.helper'
import { AdditionalCss, ColorKey } from './styles.type'
export const readOnlyCss = {
  _css: css`
    input,
    input:focus {
      border-bottom: none;
    }
  `,
  readOnly: true,
}
export const notFoundMiniTable = css`
  &.not-found {
    height: 100%;
    tbody {
      height: 100%;
      width: 100%;
      tr {
        height: 100%;
        width: 100%;
        cursor: default;
        &:hover {
          background-color: transparent;
        }
        cursor: default;
        & > td {
          cursor: default;
          background-color: transparent;
          height: 100%;
          width: 100%;
          padding: 0px;
          margin: 0px !important;
          div {
            margin: 0px !important;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            ${typography['Body/Caption/Bold']}
            color: ${colors['Grayscale/Gray Light']};
            border-bottom: none;
          }
          border-bottom: none;
        }
        &:last-of-type {
          border-bottom: none;
        }
      }
    }
  }
`
export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors['Grayscale/Gray Lighter']};
  ${addCssProps}
`
type SvgType = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined
  }
>
export const SvgIcon = (svg: SvgType) => {
  return styled(svg)`
    ${addCssProps}
  `
}

export const ASTERISK = () => (
  <TXT
    _textStyle="Body/Small/Bold"
    _color={'Accent/Dark'}
    _css={css`
      margin-left: 4px;
    `}
  >
    *
  </TXT>
)
export const SvgWrap = styled('i')(
  (props: {
    _size?: number
    _svgSize?: { width: number; height: number }
    _height?: string | number
    _css?: SerializedStyles | string
  }) => css`
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${props._size ? props._size : 24}px;
    height: ${props._height
      ? typeof props._height === 'string'
        ? props._height
        : props._height + 'px'
      : props._size
      ? props._size + 'px'
      : '24px'};
    position: relative;
    ${props._svgSize
      ? `svg { width: ${props._svgSize.width}px; height: ${props._svgSize.height}px;}`
      : `svg { width: ${props._size ?? 24}px; height: ${props._size ?? 24}px;}`}
    ${typeof props._css === 'string'
      ? css(props._css)
      : props._css
      ? props._css
      : ``}
  `
)

export const ContentBoxWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  ${addCssProps}
`
export const ContentRow = styled.div(
  ({ _css, left }: { left?: boolean; _css?: AdditionalCss }) => css`
    ${typography['Body/Large/Bold']}
    color: ${colors['Grayscale/Black light']};
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    min-height: 44px;
    gap: 24px;
    text-align: left;
    &.flex-start {
      align-items: flex-start;
      & > label {
        padding-top: 13px;
      }
    }
    & > label {
      width: 100px;
      min-width: 100px;
    }
    & > div {
      flex: 1;
      max-width: calc(100% - 124px);
      text-align: ${left ? 'left' : 'right'};
    }
    &.cancel {
      & > div {
        color: ${colors['Danger/Dark']};
      }
    }
    ${typeof _css === 'string' ? css(_css) : _css ? _css : css``}
  `
)
export const ContentRadiusBox = styled.div<{
  _css?: AdditionalCss
  gap?: CSSProperties['gap']
}>`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: ${(props) => (props.gap ? `${props.gap}px` : '0px')};
  padding: 16px;
  border: 1px solid ${colors['Grayscale/Gray Lighter']};
  border-radius: 16px;
  transition: 0.5s;
  &.collapsed {
    height: 0px;
    padding-top: 0;
    padding-bottom: 0;
    border-width: 0px;
    overflow: hidden;
  }
  &.selected {
    background-color: ${colors['Primary/Lighter']};
  }
  &.question {
    box-shadow: none;
    border: none;
    margin-top: 6px;
    background-color: ${colors['Grayscale/Background Light']};
    ${ContentRow} {
      & > div {
        text-align: left;
        justify-content: flex-start;
        flex: 1;
      }
      white-space: pre-line;
    }
  }
  &.gray {
    box-shadow: none;
    border: none;
    background-color: ${colors['Grayscale/Background Light']};
    ${ContentRow} {
      & > div {
        text-align: left;
        justify-content: flex-start;
        flex: 1;
      }
      white-space: pre-line;
    }
  }
  ${addCssProps}
`
export const ContentProfileBox = styled.div`
  .wrap {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  div[data-profile] {
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    width: 120px;
    height: 120px;
    border-radius: 60px;
    border-radius: 50%;
  }
  text-align: center;
  .name {
    ${typography['Display/1 Bold']}
    color: ${colors['Grayscale/Black light']};
    &.with-link {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
  .phone {
    ${typography['Body/Small/Regular']}
    color: ${colors['Grayscale/Gray Default']};
  }
  .badges {
    margin-top: 8px;
  }
`
export const ContentLabel = styled.label`
  display: flex;
  ${typography['Body/Caption/Regular']}
  color: ${colors['Grayscale/Gray Dark']};
  .asterisk {
    ${typography['Body/Small/Bold']}
    color: ${colors['Accent/Dark']};
    margin-left: 4px;
  }
  ${addCssProps}
`

export interface FlexBoxProps {
  _textStyle?: keyof typeof typography
  _color?: ColorKey
  flexWrap?: CSSProperties['flexWrap']
  flexDirection?: CSSProperties['flexDirection']
  justifyItems?: CSSProperties['justifyItems']
  justifyContent?: CSSProperties['justifyContent']
  alignItems?: CSSProperties['alignItems']
  alignContent?: CSSProperties['alignContent']
  gap?: CSSProperties['gap']
  columnGap?: CSSProperties['columnGap']
  rowGap?: CSSProperties['rowGap']
  _css?: AdditionalCss
}
export const Flex = styled.div(
  ({
    flexWrap,
    flexDirection,
    justifyItems,
    justifyContent,
    alignItems,
    alignContent,
    gap,
    columnGap,
    rowGap,
    _css,
    _color,
    _textStyle,
  }: FlexBoxProps) => css`
    display: flex;
    align-items: ${alignItems ? alignItems : 'center'};
    ${flexWrap
      ? css`
          flex-wrap: ${flexWrap};
        `
      : ''}
    ${flexDirection
      ? css`
          flex-direction: ${flexDirection};
        `
      : ''}
    ${justifyItems
      ? css`
          justify-items: ${justifyItems};
        `
      : ''}
    ${justifyContent
      ? css`
          justify-content: ${justifyContent};
        `
      : ''}
    ${alignContent
      ? css`
          align-content: ${alignContent};
        `
      : ''}
    ${columnGap
      ? css`
          column-gap: ${columnGap};
        `
      : ''}
    ${rowGap
      ? css`
          row-gap: ${rowGap};
        `
      : ''}
    ${_color
      ? css`
          color: ${colors[_color]};
        `
      : ''}
    ${_textStyle
      ? css`
          ${typography[_textStyle]}
        `
      : ''}
    gap: ${typeof gap === 'number' ? `${gap}px` : `${gap}`};
    ${_css ? _css : ''}
  `
)
export const FlexRow = styled.div(
  ({
    gap,
    alignItems = 'center',
    justifyContent,
    _css,
    _color,
    width = '100%',
    _textStyle,
  }: {
    gap: CSSProperties['gap']
    _textStyle?: keyof typeof typography
    _color?: ColorKey
    _css?: AdditionalCss
    width?: CSSProperties['width']
    justifyContent?: CSSProperties['justifyContent']
    alignItems?: CSSProperties['alignItems']
  }) => css`
    display: flex;
    align-items: ${alignItems};
    gap: ${typeof gap === 'number' ? `${gap}px` : `${gap}`};
    width: ${width ?? 'auto'};
    ${justifyContent
      ? css`
          justify-content: ${justifyContent};
        `
      : ''}
    ${_color
      ? css`
          color: ${colors[_color]};
        `
      : ''}
    ${_textStyle
      ? css`
          ${typography[_textStyle]}
        `
      : ''}
    ${_css ? _css : ''}
  `
)

export const FlexColumn = styled.div(
  ({
    gap,
    _css,
    width = '100%',
    alignItems = 'flex-start',
    justifyContent,
    _color,
    _textStyle,
  }: {
    gap: number
    _textStyle?: keyof typeof typography
    width?: CSSProperties['width']
    _color?: ColorKey
    _css?: AdditionalCss
    justifyContent?: CSSProperties['justifyContent']
    alignItems?: CSSProperties['alignItems']
  }) => css`
    display: flex;
    flex-direction: column;
    width: ${width ?? 'auto'};
    ${alignItems
      ? css`
          align-items: ${alignItems};
        `
      : ''}
    ${justifyContent
      ? css`
          justify-content: ${justifyContent};
        `
      : ''}
    
    ${_color
      ? css`
          color: ${colors[_color]};
        `
      : ''}
    ${_textStyle
      ? css`
          ${typography[_textStyle]}
        `
      : ''}
    gap: ${typeof gap === 'number' ? `${gap}px` : `${gap}`};
    ${_css ? _css : ''}
  `
)

export const Column = styled.div<{ count?: number }>`
  display: grid;
  grid-row: 4;
`
export const BOX = styled.div(
  ({
    _textStyle,
    _color,
    _style,
  }: {
    _style?: CSSProperties
    _textStyle?: keyof typeof typography
    _color?: ColorKey
  }) => {
    if (!_style) return ''
    const styleKeyNames = Object.keys(_style) as Array<keyof CSSProperties>
    return css`
      ${styleKeyNames
        .map((keyName) => {
          return _style[keyName] ? `${keyName}: ${_style[keyName]};` : null
        })
        .filter((ii) => ii)
        .join('\n')}
      ${_color
        ? css`
            color: ${colors[_color]};
          `
        : ``}
        ${_textStyle
        ? css`
            ${typography[_textStyle]}
          `
        : ''}
    `
  }
)
export const TXT = styled.div<{
  _textStyle?: keyof typeof typography
  _color?: ColorKey
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  _css?: SerializedStyles | string
}>`
  white-space: pre-wrap;
  ${({ _color, _textStyle, height, width }) => {
    return css`
      ${_color
        ? css`
            color: ${colors[_color]};
          `
        : ``}
      ${_textStyle
        ? css`
            ${typography[_textStyle]}
          `
        : ''}
      ${height
        ? css`
            height: ${height};
          `
        : ''}
      ${width
        ? css`
            width: ${width};
          `
        : ''}
    `
  }}
  ${addCssProps}
`
