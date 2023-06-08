import { AdditionalCss, DivAttributes } from '../../themes/styles.type'
export const hideDuration = 600
export const slideDuration = 300
export const toastDuration = 2
export interface ToastMessageProps extends DivAttributes {
  _css?: AdditionalCss
}
