import styled from '@emotion/styled/macro'
import { useEffect, useState } from 'react'
import { useStepper } from '../hooks/useStepper'

const StepperSampleWrap = styled.div``

interface StepperSampleProps {}

const initialValues = {
  hello: 'world',
  a: 1,
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
    setCurrentStep,
    allSteps,
    matchInputs,
    stepsInputs,
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
    }
  )
  useEffect(() => {
    console.log('stepsInputs', stepsInputs)
  }, [stepsInputs])
  const [result, set_result] = useState<string>('')
  return (
    <>
      <StepperSampleWrap>
        <div>{currentStep}</div>
        <div>
          {allSteps.map((step) => {
            return (
              <button
                key={step}
                onClick={() => {
                  setCurrentStep(step)
                }}
              >
                {step}
              </button>
            )
          })}
        </div>
        <div>
          {currentStep === 'stepOne' && (
            <div>
              <div>{stepsInputs[currentStep].hello}</div>
              <input
                value={matchInputs.inputs.hello}
                onChange={(e) => {
                  matchInputs.handleInput('hello', e.target.value)
                }}
              />
            </div>
          )}
          {currentStep === 'stepTwo' && (
            <div>
              <div>{stepsInputs[currentStep].b.c}</div>
              <input
                value={matchInputs.inputs.b.c}
                onChange={(e) => {
                  matchInputs.pickAndUpdate('b.c', e.target.value)
                }}
              />
            </div>
          )}
          {currentStep === 'stepThree' && (
            <div>
              <div>{stepsInputs[currentStep].f}</div>
              <input
                value={matchInputs.inputs.f}
                onChange={(e) => {
                  matchInputs.handleInput('f', e.target.value)
                }}
              />
            </div>
          )}
        </div>
        <div>
          <button onClick={prevStep}>prev</button>
          <button onClick={nextStep}>next</button>
        </div>
        <div>
          <button
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
