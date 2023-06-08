import { SerializedStyles } from '@emotion/react'
import { colors } from './styles'
export type AdditionalCss = SerializedStyles | string
export type ColorKey = keyof typeof colors
export type DivAttributes = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>
