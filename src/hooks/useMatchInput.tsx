import { clone, isEqual, set } from 'lodash-es'
import { useCallback, useMemo, useState } from 'react'

type DeepKeyOf<T> = T extends object
  ? { [K in Extract<keyof T, string>]: K | `${K}.${DeepKeyOf<T[K]>}` }[Extract<
      keyof T,
      string
    >]
  : never

type ValueOfDeepKey<T, K extends string> = K extends `${infer K1}.${infer K2}`
  ? K1 extends keyof T
    ? ValueOfDeepKey<T[K1], K2>
    : never
  : K extends keyof T
  ? T[K]
  : never

export type HandleInputFunction<T> = <K extends keyof T>(
  target: K,
  value: T[K] | ((inputs: T) => T[K]),
  callBack?: ((next: T) => T) | undefined
) => Promise<void>

export interface MatchInputProps<T> {
  inputs: T
  isMatched: boolean
  existInputs: T
  handleInput: HandleInputFunction<T>
  handleValues: (next: T | ((prev: T) => T)) => void
  pickAndUpdate: <K extends DeepKeyOf<T>>(
    target: K,
    value: ValueOfDeepKey<T, K>
  ) => void
  fetchInit: (value: T) => void
  returnToOriginal: () => void
  restoreValues: () => void
  InputAttributes: (inputsKeyName: keyof T) => void
}

function isFunction<T>(x: any): x is (value: T) => void {
  return x !== undefined && typeof x === 'function' && x instanceof Function
}

const useMatchInput = <T extends object>(initialValue: T) => {
  const [inputs, set_inputs] = useState<T>(clone(initialValue))
  const [existInputs, set_existInputs] = useState<T>(clone(initialValue))

  const fetchInit = useCallback((next: T | ((prev: T) => T)) => {
    if (typeof next === 'function') {
      set_inputs((prev) => next(prev))
      set_existInputs((prev) => next(prev))
    } else {
      set_inputs(next)
      set_existInputs(clone(next))
    }
  }, [])

  const syncCurrentValue = useCallback(() => {
    set_inputs((prev) => {
      set_existInputs(clone(prev))
      return prev
    })
  }, [])

  const restoreValues = useCallback(() => {
    set_inputs(clone(initialValue))
    set_existInputs(clone(initialValue))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const InputAttributes = (inputsKeyName: keyof T) => {
    return {
      value: inputs[inputsKeyName],
      handleValue: (value: T[keyof T]) => handleInput(inputsKeyName, value),
    }
  }

  const handleValues = useCallback((next: T | ((prev: T) => T)) => {
    if (typeof next === 'function') {
      set_inputs((prev) => next(prev))
    } else {
      set_inputs(next)
    }
  }, [])

  const pickAndUpdate = useCallback(
    <K extends DeepKeyOf<T>>(target: K, value: ValueOfDeepKey<T, K>) => {
      set_inputs((prev) => clone(set(prev, target, value)))
    },
    []
  )

  const handleInput: HandleInputFunction<T> = useCallback(
    async (target, value, callBack) => {
      set_inputs((prev) => {
        let next = { ...prev }
        if (isFunction(value)) {
          next = { ...next, [target]: value(prev) }
        } else {
          next = { ...next, [target]: value }
        }
        if (callBack) {
          return callBack(next)
        } else {
          return next
        }
      })
    },
    []
  )

  const returnToOriginal = () => {
    set_inputs(clone(existInputs))
  }

  const isMatched = useMemo(() => {
    return isEqual(existInputs, inputs)
  }, [inputs, existInputs])

  return {
    inputs,
    existInputs,
    isMatched,
    syncCurrentValue,
    pickAndUpdate,
    fetchInit,
    handleValues,
    handleInput,
    returnToOriginal,
    restoreValues,
    InputAttributes,
  } as const
}
export default useMatchInput
