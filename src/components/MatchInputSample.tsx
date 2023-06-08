import styled from '@emotion/styled/macro'
import { cloneDeep } from 'lodash-es'
import useMatchInput from '../hooks/useMatchInput'
import UnderlineFormatInput from './UnderlineInput/UnderlineFormatInput'
import UnderlineInput from './UnderlineInput/UnderlineInput'
import UnderlineNumberInput from './UnderlineInput/UnderlineNumberInput'

const MatchInputSampleWrap = styled.div`
  padding: 32px;
  max-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

type MatchInputValuesType = {
  a: string
  b: number | null
  c: {
    d: string
    e: number | null
  }
  f: string[]
}

const InitialValues: MatchInputValuesType = {
  a: '',
  b: null,
  c: {
    d: '',
    e: null,
  },
  f: [],
}

interface MatchInputSampleProps {}
const MatchInputSample = ({ ...props }: MatchInputSampleProps) => {
  const { inputs, handleInput, pickAndUpdate, isMatched, fetchInit } =
    useMatchInput(InitialValues)
  return (
    <>
      <MatchInputSampleWrap>
        <div>
          <UnderlineInput
            value={inputs.a}
            placeholder="String"
            handleValue={(value) => handleInput('a', value)}
          />
        </div>
        <div>
          <UnderlineNumberInput
            value={inputs.b}
            placeholder="Number"
            handleValue={(value) => handleInput('b', value)}
          />
        </div>
        <div>
          <UnderlineFormatInput
            value={inputs.c.d}
            format="##-###"
            placeholder="##-###"
            handleValue={(value) => pickAndUpdate('c.d', value)}
          />
        </div>
        <div>{isMatched ? 'no-changed' : 'changed'}</div>
        <div>
          <button
            onClick={() => {
              fetchInit(cloneDeep({ ...inputs }))
            }}
          >
            Update
          </button>
        </div>
      </MatchInputSampleWrap>
    </>
  )
}
export default MatchInputSample
