import S from './FakePlaceHolder.styles'
import { FakePlaceHolderProps } from './FakePlaceHolder.types'

const FakePlaceHolder = ({
  error,
  children,
  value,
  ...props
}: FakePlaceHolderProps) => {
  const { Wrap } = S
  return (
    <>
      {value && (
        <Wrap className="label" data-animation={'typed'} {...props}>
          {children}
        </Wrap>
      )}
      {!value && (
        <Wrap className="label" data-animation={'reverse'} {...props}>
          {children}
        </Wrap>
      )}
    </>
  )
}
export default FakePlaceHolder
