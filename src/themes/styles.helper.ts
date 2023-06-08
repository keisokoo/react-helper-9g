import { css } from '@emotion/react'
import { AdditionalCss } from './styles.type'

export const addCssProps = ({ _css }: { _css?: AdditionalCss }) =>
  typeof _css === 'string' ? css(_css) : _css ? _css : css``
