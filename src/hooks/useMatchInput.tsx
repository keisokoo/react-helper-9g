import { clone, isEqual, set } from 'lodash-es'
import { useCallback, useMemo, useState } from 'react'

type Many<T> = T | ReadonlyArray<T>
type PropertyName = string | number | symbol
type PropertyPath = Many<PropertyName>

type HandleInputFunction<T> = <K extends keyof T>(
  target: K,
  value: T[K] | ((inputs: T) => T[K]),
  callBack?: ((next: T) => T) | undefined
) => Promise<void>

export interface MatchInputProps<T> {
  _prefix?: JSX.Element
  inputs: T
  isMatched: boolean
  existInputs: T
  handleInput: HandleInputFunction<T>
  handleValues: (next: T) => void
  pickAndUpdate: (target: PropertyPath, value: any) => void
  fetchInit: (value: T) => void
  returnToOriginal: () => void
  restoreValues: () => void
}

function isFunction<T>(x: any): x is (value: T) => void {
  return x !== undefined && typeof x === 'function' && x instanceof Function
}
const useMatchInput = <T extends object>(initialValue: T) => {
  const [inputs, set_inputs] = useState<T>(clone(initialValue))
  const [existInputs, set_existInputs] = useState<T>(clone(initialValue))

  const fetchInit = useCallback((value: T) => {
    set_inputs(value)
    set_existInputs(clone(value))
  }, [])

  const restoreValues = useCallback(() => {
    set_inputs(clone(initialValue))
    set_existInputs(clone(initialValue))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleValues = useCallback((next: T) => {
    set_inputs(next)
  }, [])
  const pickAndUpdate = useCallback(<K,>(target: PropertyPath, value: K) => {
    set_inputs((prev) => clone(set(prev, target, value)))
  }, [])
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
    pickAndUpdate,
    fetchInit,
    handleValues,
    handleInput,
    returnToOriginal,
    restoreValues,
  }
}
export default useMatchInput
