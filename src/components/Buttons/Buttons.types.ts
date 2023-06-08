import { SerializedStyles } from '@emotion/react'
import { CSSProperties } from 'react'
import { ColorKey } from '../../themes/styles.type'

export interface ButtonProps {
  _css: SerializedStyles | string
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  flex?: CSSProperties['flex']
  padding?: CSSProperties['padding']
  margin?: CSSProperties['margin']
}
export interface ButtonTemplateProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  _css?: SerializedStyles | string
  _mini?: boolean
  _icon?: boolean
  _pending?: boolean
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  flex?: CSSProperties['flex']
  padding?: CSSProperties['padding']
  margin?: CSSProperties['margin']
}

export type DisabledType = 'fill' | 'text' | 'icon'
export interface ColorOption {
  iconColor?: ColorKey
  textColor?: ColorKey
  backgroundColor?: ColorKey
  hoverIconColor?: ColorKey
  hoverTextColor?: ColorKey
  hoverBackgroundColor?: ColorKey
  borderColor?: ColorKey
  hoverBorderColor?: ColorKey
  disabledType: DisabledType
  _mini?: boolean
}
