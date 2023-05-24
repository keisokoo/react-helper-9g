import styled from '@emotion/styled/macro'
import { useState } from 'react'
import { useStepper } from '../hooks/useStepper'

const StepperSampleWrap = styled.div``

interface StepperSampleProps {}

const initialValues = {
  hello: 'world',
  a: 1 as null | number,
  b: {
    c: '',
    d: 1,
  },
  e: '',
  f: '',
  g: false,
}

const StepperSample = ({ ...props }: StepperSampleProps) => {
  const {
    currentStep,
    matchInputs,
    stepsInputs,
    validSteps,
    validAllSteps,
    prevStep,
    nextStep,
  } = useStepper(
    initialValues,
    {
      stepOne: ['hello', 'a'],
      stepTwo: ['b', 'e'],
      stepThree: ['f', 'g'],
    },
    {
      restoreWhenPrevButtonClicked: true,
      customValidations: {
        stepOne: {
          hello: (value) => {
            return value === 'world'
          },
        },
        stepTwo: {
          b: (value) => {
            return !!value.c && value.d > 0
          },
          e: (value) => {
            return value === '2'
          },
        },
      },
      optionalValue: ['f'],
    }
  )

  const [result, set_result] = useState<string>('')
  return (
    <>
      <StepperSampleWrap>
        <div>{currentStep}</div>
        <div>
          {currentStep === 'stepOne' && (
            <div>
              <input
                value={matchInputs.inputs.hello}
                placeholder="must be world"
                onChange={(e) => {
                  matchInputs.handleInput('hello', e.target.value)
                }}
              />
              <input
                type="number"
                value={matchInputs.inputs.a ?? ''}
                placeholder="must be not empty"
                onChange={(e) => {
                  matchInputs.handleInput(
                    'a',
                    e.target.value ? Number(e.target.value) : null
                  )
                }}
              />
              <div>{stepsInputs[currentStep].hello}</div>
            </div>
          )}
          {currentStep === 'stepTwo' && (
            <div>
              <div>{stepsInputs[currentStep].b.c}</div>
              <input
                value={matchInputs.inputs.b.c}
                placeholder="must be not empty"
                onChange={(e) => {
                  matchInputs.pickAndUpdate('b.c', e.target.value)
                }}
              />
              <input
                value={matchInputs.inputs.e}
                placeholder="must be 2"
                onChange={(e) => {
                  matchInputs.pickAndUpdate('e', e.target.value)
                }}
              />
            </div>
          )}
          {currentStep === 'stepThree' && (
            <div>
              <div>{stepsInputs[currentStep].f}</div>
              <input
                value={matchInputs.inputs.f}
                placeholder="must be not empty"
                onChange={(e) => {
                  matchInputs.handleInput('f', e.target.value)
                }}
              />
              <button
                onClick={() => {
                  matchInputs.handleInput('g', !matchInputs.inputs.g)
                }}
              >
                {matchInputs.inputs.g ? 'true' : 'false'}
              </button>
            </div>
          )}
        </div>
        <div>
          <button disabled={currentStep === 'stepOne'} onClick={prevStep}>
            prev
          </button>
          <button
            disabled={!validSteps[currentStep] || currentStep === 'stepThree'}
            onClick={nextStep}
          >
            next
          </button>
        </div>
        <div>
          <button
            disabled={!validAllSteps}
            onClick={() => {
              set_result(JSON.stringify(matchInputs.inputs))
            }}
          >
            handleSubmit
          </button>
        </div>
        <div id="result">{result}</div>
      </StepperSampleWrap>
    </>
  )
}

export default StepperSample
