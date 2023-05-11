import { SerializedStyles } from '@emotion/react'
import styled from '@emotion/styled/macro'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { flipObject } from '../helpers/util'

const DropdownWrap = styled.div``
const DropdownStyle = {
  Wrap: DropdownWrap,
  Label: styled.div``,
  ListWrap: styled.div``,
  ListInner: styled.div``,
  Item: styled.div``,
  ForCalculateSize: styled.div``,
}
export type DivAttributes = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

export type DropdownListType = { [key in string | number]: string | number }

export type AdditionalCss = SerializedStyles | string

export interface DropdownProps<T extends DropdownListType | string[]>
  extends DivAttributes {
  _css?: AdditionalCss
  _value?: T[keyof T] | null
  _list: T | (() => Promise<T> | null) | string[]
  _placeholder?: string
  _disabled?: boolean
  _autoWidth?: boolean
  _emitValue?: (value: T[keyof T]) => void
  _parseLabel?: (value: string | number) => string
}

const arrayToStringObject = (list: string[]): { [key in string]: string } => {
  return list.reduce((prev, curr) => {
    prev[curr] = curr
    return prev
  }, {} as { [key in string]: string })
}

const isFunction = (value: any): value is Function => {
  return typeof value === 'function'
}

const Dropdown = <T extends DropdownListType>({
  _css,
  _value,
  _list,
  _emitValue,
  _parseLabel,
  className,
  _placeholder = '선택',
  _disabled,
  _autoWidth,
  ...props
}: DropdownProps<T>) => {
  const [open, set_open] = useState<boolean>(false)

  const [currentList, set_currentList] = useState<T | null>(null) // null 이면 pending
  const [currentLabel, set_currentLabel] = useState<string>('')

  useEffect(() => {
    if (!isFunction(_list)) {
      set_currentList(
        _list instanceof Array ? (arrayToStringObject(_list) as T) : _list
      )
    }
  }, [_list])

  const getCurrentList = useCallback(
    async (listByProps: string[] | T | (() => Promise<T> | null)) => {
      let currentList: T | null = null
      if (listByProps) {
        if (typeof listByProps === 'function') {
          currentList = listByProps() ? await listByProps() : null
        } else if (listByProps instanceof Array) {
          currentList = listByProps.reduce((prev, curr) => {
            prev[curr] = curr
            return prev
          }, {} as { [key in string]: string }) as T
        } else {
          currentList = listByProps
        }
      }
      return currentList
    },
    []
  )

  const labelString = useMemo(() => {
    if (_value) {
      if (_parseLabel) {
        return _parseLabel(String(_value))
      } else {
        return currentList ? String(flipObject(currentList)[_value]) : null
      }
    } else {
      return _placeholder
    }
  }, [_value, _parseLabel, currentList, _placeholder])

  return (
    <>
      <DropdownStyle.Wrap>
        <DropdownStyle.Label
          onClick={async () => {
            if (isFunction(_list)) {
              set_currentList(null)
              const list = await _list()
              list && set_currentList(list)
            }
            set_open((prev) => !prev)
          }}
        >
          <label>{labelString}</label>
          <div></div>
        </DropdownStyle.Label>
        {open && (
          <DropdownStyle.ListWrap>
            <DropdownStyle.ListInner></DropdownStyle.ListInner>
          </DropdownStyle.ListWrap>
        )}
      </DropdownStyle.Wrap>
    </>
  )
}
export default Dropdown
