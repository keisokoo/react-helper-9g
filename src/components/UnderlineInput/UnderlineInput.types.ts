import {
  NumericFormatProps,
  PatternFormatProps,
} from 'react-number-format/types/types'
import { AdditionalCss } from '../../themes/styles.type'

export interface UnderlineInputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  value?: string
  label?: string
  handleValue: (value: string) => void
  _css?: AdditionalCss
  after?: JSX.Element
  guide?: string
  error?: string
  _el?: JSX.Element
  wrapProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
  noRemoveButton?: boolean
}
export interface UnderlineNumberInputProps extends NumericFormatProps {
  value?: number | null
  label?: string
  handleValue: (value: number | null) => void
  _css?: AdditionalCss
  after?: JSX.Element
  guide?: string
  error?: string
  _el?: JSX.Element
  noRemoveButton?: boolean
  wrapProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
}

export interface UnderlineFormatInputProps extends PatternFormatProps {
  value?: string
  label?: string
  handleValue: (value: string) => void
  _css?: AdditionalCss
  after?: JSX.Element
  guide?: string
  error?: string
  _el?: JSX.Element
  wrapProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
}
