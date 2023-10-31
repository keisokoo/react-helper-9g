import { useCallback, useMemo, useState } from 'react'
import { objectKeys } from '../helpers/util'
import useMatchInput from './useMatchInput'

type KeysMapping<T, K extends { [key: string]: (keyof T)[] }> = {
  [P in keyof K]: Pick<T, K[P][number]>
}
type RestoreTypes = 'after' | 'from-current' | 'current-only'

type CustomValidations<
  T,
  J extends { [key: string]: (keyof T)[] },
  K extends keyof J
> = {
  [P in J[K][number]]?: (currentValue: T[P]) => boolean
}
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
export type StepperOptions<
  T extends object,
  J extends { [key: string]: (keyof T)[] }
  // K extends keyof J
> = {
  restoreWhenPrevButtonClicked?: boolean
  customValidations?: {
    [P in keyof J]?: CustomValidations<T, J, P>
  }
  optionalValue?: (keyof T)[]
}
export const useStepper = <
  T extends object,
  J extends { [key: string]: (keyof T)[] },
  K extends keyof J
>(
  initialValue: T,
  values: J,
  configs?: StepperOptions<T, J>
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

  const checkValidStep = useCallback<
    (
      step: K,
      customValidations?: CustomValidations<T, J, K> | null,
      optional?: (keyof T)[]
    ) => boolean
  >(
    (step, customValidations, optional) => {
      let isValid = true
      let stepInputs = stepsInputs[step]
      let stepInputsKeyNames = objectKeys(stepInputs)
      let stepInputsValid = stepInputsKeyNames.every((keyName) => {
        if (optional && optional.includes(keyName)) return true
        let value = stepInputs[keyName]
        if (customValidations && customValidations[keyName]) {
          return customValidations[keyName]!(value)
        }
        const checkValid = Array.isArray(value)
          ? (value as Array<unknown>).length > 0
          : typeof value === 'boolean' || typeof value === 'string'
          ? !!value
          : value !== undefined && value !== null
        return checkValid
      })
      if (!stepInputsValid) {
        isValid = false
      }
      return isValid
    },
    [stepsInputs]
  )

  // checkValidStep을 이용하여, 각 스테퍼 별로 유효성 검사를 수행하고, 각 각 스테퍼별로 유효성 검사를 수행한 결과를 반환한다.
  const validSteps = useMemo(
    () => {
      let stepsValid: { [P in keyof J]?: boolean } = {}
      allSteps.forEach((step) => {
        stepsValid[step] = checkValidStep(
          step,
          configs?.customValidations?.[step],
          configs?.optionalValue
        )
      })
      return stepsValid
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allSteps, checkValidStep]
  )

  const validAllSteps = useMemo(
    () => {
      let isValid = true
      let allStepsValid = allSteps.every((step) => {
        return checkValidStep(
          step,
          configs?.customValidations?.[step],
          configs?.optionalValue
        )
      })
      if (!allStepsValid) {
        isValid = false
      }
      return isValid
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allSteps, checkValidStep]
  )

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
    checkValidStep,
    validSteps,
    validAllSteps,
    prevStep,
    nextStep,
  }
}
