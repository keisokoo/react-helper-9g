import { css } from '@emotion/react'
import { IconsLoading } from '../../assets'
import { colors } from '../../themes/styles'
import { buttonAssets, ButtonStyle } from './Buttons.styles'
import { ButtonTemplateProps } from './Buttons.types'

export const PrimaryButton = ({
  _css,
  _mini,
  _icon,
  _pending,
  ...props
}: ButtonTemplateProps) => {
  return (
    <ButtonStyle
      _css={css`
        ${_icon
          ? css`
              width: 40px;
              height: 40px;
              .pending-icon {
                stroke: #fff;
                stroke-opacity: 0.5;
              }
            `
          : ''}
        ${buttonAssets({
          _mini,
          disabledType: 'fill',
          borderColor: 'Primary/Dark',
          backgroundColor: 'Primary/Default',
          hoverBackgroundColor: 'Primary/Dark',
          textColor: 'White/White off',
        })}
        ${_css && _css}
      `}
      {...props}
    >
      {_pending ? <IconsLoading /> : props.children}
    </ButtonStyle>
  )
}
export const PrimaryOutlineButton = ({
  _css,
  _mini,
  _icon,
  _pending,
  ...props
}: ButtonTemplateProps) => {
  return (
    <ButtonStyle
      _css={css`
        ${_icon
          ? css`
              width: 40px;
              height: 40px;
              .pending-icon {
                stroke: ${colors['Primary/Default']};
                stroke-opacity: 1;
              }
            `
          : ''}
        ${buttonAssets({
          _mini,
          disabledType: 'fill',
          borderColor: 'Primary/Default',
          backgroundColor: 'White/White off',
          hoverBackgroundColor: 'Primary/Lighter',
          textColor: 'Primary/Default',
        })}
        ${_css && _css}
      `}
      {...props}
    >
      {_pending ? <IconsLoading /> : props.children}
    </ButtonStyle>
  )
}

export const DangerButton = ({
  _css,
  _mini,
  ...props
}: ButtonTemplateProps) => {
  return (
    <ButtonStyle
      _css={css`
        ${buttonAssets({
          _mini,
          disabledType: 'fill',
          backgroundColor: 'Danger/Default',
          hoverBackgroundColor: 'Danger/Dark',
          textColor: 'White/White off',
        })}
        .pending-icon {
          stroke: #fff;
          stroke-opacity: 0.5;
        }
        ${_css && _css}
      `}
      {...props}
    >
      {props._pending ? <IconsLoading /> : props.children}
    </ButtonStyle>
  )
}
export const GrayScaleFill = ({
  _css,
  _mini,
  ...props
}: ButtonTemplateProps) => {
  return (
    <ButtonStyle
      _css={css`
        ${buttonAssets({
          _mini,
          disabledType: 'fill',
          borderColor: 'Grayscale/Black light',
          backgroundColor: 'Grayscale/Gray Default',
          hoverBackgroundColor: 'Grayscale/Gray Dark',
          textColor: 'White/White off',
        })}
        .pending-icon {
          stroke: #fff;
          stroke-opacity: 0.5;
        }
        ${_css && _css}
      `}
      {...props}
    >
      {props._pending ? <IconsLoading /> : props.children}
    </ButtonStyle>
  )
}
export const GrayScaleText = ({
  _css,
  _mini,
  ...props
}: ButtonTemplateProps) => {
  return (
    <ButtonStyle
      _css={css`
        ${buttonAssets({
          _mini,
          disabledType: 'text',
          hoverBackgroundColor: 'Grayscale/Background Dark',
          textColor: 'Grayscale/Gray Default',
          hoverTextColor: 'Grayscale/Gray Dark',
        })}
        .pending-icon {
          stroke: ${colors['Grayscale/Gray Dark']};
          stroke-opacity: 1;
        }
        ${_css && _css}
      `}
      {...props}
    >
      {props._pending ? <IconsLoading /> : props.children}
    </ButtonStyle>
  )
}

export const GrayScaleOutline = ({
  _css,
  _mini,
  _icon,
  ...props
}: ButtonTemplateProps) => {
  return (
    <ButtonStyle
      _css={css`
        ${_icon
          ? css`
              width: 40px;
              height: 40px;
            `
          : ''}
        ${buttonAssets({
          _mini,
          disabledType: _icon ? 'icon' : 'fill',
          borderColor: 'Grayscale/Gray Light',
          backgroundColor: 'White/White off',
          hoverBackgroundColor: 'Grayscale/Background Dark',
          textColor: 'Grayscale/Gray Dark',
        })}
        .pending-icon {
          stroke: ${colors['Grayscale/Gray Dark']};
          stroke-opacity: 1;
        }
        ${_css && _css}
      `}
      {...props}
    >
      {props._pending ? <IconsLoading /> : props.children}
    </ButtonStyle>
  )
}
