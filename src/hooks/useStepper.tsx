import { useCallback, useMemo, useState } from 'react'
import { objectKeys } from '../helpers/util'
import useMatchInput from './useMatchInput'

type KeysMapping<T, K extends { [key: string]: (keyof T)[] }> = {
  [P in keyof K]: Pick<T, K[P][number]>
}
type RestoreTypes = 'after' | 'from-current' | 'current-only'

export function getStepsInputs<T, J extends { [key: string]: (keyof T)[] }>(
  initialValue: T,
  values: J
): KeysMapping<T, J> {
  return Object.keys(values).reduce((prev, curr) => {
    prev[curr as keyof typeof prev] = values[curr as keyof typeof prev].reduce(
      (prevInner, currInner) => {
        prevInner[currInner as keyof typeof prevInner] =
          initialValue[currInner as keyof typeof prevInner]
        return prevInner
      },
      {} as Pick<T, keyof T>
    )
    return prev
  }, {} as KeysMapping<T, J>)
}
export type StepperOptions = {
  restoreWhenPrevButtonClicked?: boolean
}
export const useStepper = <
  T extends object,
  J extends { [key: string]: (keyof T)[] },
  K extends keyof J
>(
  initialValue: T,
  values: J,
  configs?: StepperOptions
) => {
  const matchInputs = useMatchInput(initialValue)
  const [stepper, set_stepper] = useState<K | null>()

  const stepsInputs = useMemo(() => {
    return getStepsInputs(matchInputs.inputs, values)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchInputs.inputs])

  const allSteps = useMemo(() => {
    return objectKeys(stepsInputs) as K[]
  }, [stepsInputs])

  const currentStep = useMemo(() => {
    let currentStepper = stepper ? stepper : (objectKeys(stepsInputs)[0] as K)
    return currentStepper
  }, [stepper, stepsInputs])

  const callRestoreByKeyNames = useCallback(
    (restoreSteps: K[]) => {
      let restoreInputsKeyNames = restoreSteps
        .map((step) => {
          return objectKeys(stepsInputs[step])
        })
        .flat()
      matchInputs.restoreByKeyNames(restoreInputsKeyNames)
    },
    [matchInputs, stepsInputs]
  )

  const nextStep = useCallback(() => {
    let currentStepper = stepper ? stepper : (objectKeys(stepsInputs)[0] as K)
    let currentIndex = allSteps.indexOf(currentStepper)
    if (currentIndex < allSteps.length - 1) {
      set_stepper(allSteps[currentIndex + 1])
    }
  }, [allSteps, stepper, stepsInputs])

  const prevStep = useCallback(() => {
    let currentStepper = stepper ? stepper : (objectKeys(stepsInputs)[0] as K)
    let currentIndex = allSteps.indexOf(currentStepper)
    if (currentIndex > 0) {
      if (configs?.restoreWhenPrevButtonClicked) {
        let restoreSteps = allSteps.slice(currentIndex)
        callRestoreByKeyNames(restoreSteps)
      }
      set_stepper(allSteps[currentIndex - 1])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepper, stepsInputs, allSteps, callRestoreByKeyNames])

  const setCurrentStep = useCallback(
    (step: K, restore?: RestoreTypes) => {
      if (restore) {
        let currentIndex = allSteps.indexOf(step) + restore === 'after' ? 1 : 0
        if (currentIndex > 0) {
          let restoreSteps = allSteps.slice(currentIndex)
          callRestoreByKeyNames(
            restore === 'current-only' ? [step] : restoreSteps
          )
        }
      }
      set_stepper(step)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allSteps, callRestoreByKeyNames]
  )

  return {
    currentStep,
    setCurrentStep,
    allSteps,
    stepsInputs,
    matchInputs,
    prevStep,
    nextStep,
  }
}
