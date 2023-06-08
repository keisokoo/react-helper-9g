import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { colors, typography } from '../../themes/styles'

const toTheTop = keyframes`
from{
  top: 20px;
  ${typography['Title/Bold']}
}
to{
  top: 0px;
  ${typography['Body/Caption/Bold']}
}
`

const FakePlaceHolderStyle = {
  Wrap: styled.div`
    position: absolute;
    z-index: 0;
    left: 0px;
    top: 20px;
    ${typography['Title/Bold']}
    &[data-animation='typed'] {
      top: 20px;
      ${typography['Title/Bold']}
      color: ${colors['Grayscale/Gray Light']};
      animation: ${toTheTop} 0.15s linear 1 normal forwards;
    }
    &[data-animation='reverse'] {
      top: 0px;
      color: ${colors['Grayscale/Gray Lighter']};
      ${typography['Body/Caption/Bold']}
      animation: ${toTheTop} 0.15s linear 1 reverse forwards;
    }
  `,
}
export default FakePlaceHolderStyle
