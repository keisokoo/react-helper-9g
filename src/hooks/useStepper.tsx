import { useMemo } from 'react'
import { objectKeys } from '../helpers/util'
import useMatchInput from './useMatchInput'

export const useStepper = <T extends object>(
  initialValue: T,
  values: { [key in string]: Partial<keyof T>[] }
) => {
  const matchInputs = useMatchInput(initialValue)
  const stepsInputs = useMemo(() => {
    return objectKeys(values).map((keyName) => {
      return {
        [keyName]: values[keyName].reduce((prev, curr) => {
          prev[curr] = matchInputs.inputs[curr as keyof T]
          return prev
        }, {} as { [key in keyof T]: T[keyof T] }),
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchInputs.inputs])
  // useEffect(() => {
  //   const initialStepInputs = objectKeys(values).map((keyName) => {
  //     return {
  //       keyName: {
  //         [values[keyName]]: initialValue[values[keyName] as keyof T],
  //       },
  //     }
  //   })
  //   console.log('initialStepInputs', initialStepInputs)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])
  return {
    stepsInputs,
    matchInputs,
  }
}
