import styled from '@emotion/styled/macro'
import { clone } from 'lodash-es'
import { MutableRefObject, useEffect, useRef } from 'react'
import { setDetectChangeHandler } from './helpers/setDetectChangeHandler'
import { useStepper } from './hooks/useStepper'

const TestWrap = styled.div``

interface TestProps {}

const useDetectChangeHandler = <T extends { [key in string]: string }>(
  values: T,
  wrapper: HTMLDivElement
) => {
  const valueRef = useRef(clone(values)) as MutableRefObject<T>
  const fireFirstRef = useRef() as MutableRefObject<boolean>

  useEffect(() => {
    if (wrapper && wrapper.childElementCount > 0 && !fireFirstRef.current) {
      fireFirstRef.current = true
      Array.from(wrapper.children).forEach((child) => {
        if (child instanceof HTMLInputElement) {
          child.value = clone(values)[child.name]
          setDetectChangeHandler(child)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrapper])

  return {
    getValues: () => {
      return valueRef.current
    },
    getValue: (keyName: keyof T) => {
      return keyName in valueRef.current ? valueRef.current[keyName] : ''
    },
    setValue: (keyName: keyof T, value: T[keyof T]) => {
      if (keyName in valueRef.current) {
        valueRef.current[keyName as keyof T] = value
      }
    },
    restoreValues: () => {
      valueRef.current = values
      if (wrapper && wrapper.childElementCount > 0) {
        fireFirstRef.current = true
        Array.from(wrapper.children).forEach((child) => {
          if (child instanceof HTMLInputElement) {
            child.value = clone(values)[child.name]
          }
        })
      }
    },
  }
}

const Test = ({ ...props }: TestProps) => {
  const textRef = useRef() as MutableRefObject<HTMLInputElement>
  const wrapperRef = useRef() as MutableRefObject<HTMLDivElement>
  const valuesRef = useRef({
    one: 'a',
    two: 'b',
    three: 'c',
  }) as MutableRefObject<{ [key in string]: string }>
  const { stepsInputs, matchInputs } = useStepper(
    {
      one: 'a',
      two: 'b',
      three: 'c',
    },
    { '1': ['one'], '2': ['two'], '3': ['three'] }
  )
  useEffect(() => {
    console.log('stepsInputs, matchInputs', stepsInputs, matchInputs)
  }, [stepsInputs, matchInputs])
  useEffect(() => {
    if (textRef.current) {
      setDetectChangeHandler(textRef.current)
    }
  }, [])

  const { setValue, restoreValues, getValues } = useDetectChangeHandler(
    valuesRef.current,
    wrapperRef.current
  )
  return (
    <>
      <TestWrap>
        <div ref={wrapperRef}>
          <input
            name="one"
            placeholder="one"
            onChange={(e) => {
              setValue('one', e.target.value)
            }}
          />
          <input
            name="two"
            placeholder="two"
            onChange={(e) => {
              setValue('two', e.target.value)
            }}
          />
          <input
            name="three"
            placeholder="three"
            onChange={(e) => {
              setValue('three', e.target.value)
            }}
          />
        </div>
        <button
          onClick={() => {
            console.log(getValues())
          }}
        >
          get values
        </button>
        <button
          onClick={() => {
            console.log(restoreValues())
          }}
        >
          restoreValues
        </button>
      </TestWrap>
    </>
  )
}
export default Test
