import { SerializedStyles } from '@emotion/react'
import styled from '@emotion/styled/macro'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { objectKeys } from '../helpers/util'

const DropdownWrap = styled.div``
const DropdownStyle = {
  Wrap: DropdownWrap,
  Label: styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    label {
      cursor: pointer;
    }
  `,
  ListWrap: styled.div`
    padding: 0;
  `,
  ListInner: styled.div`
    height: 80px;
    overflow-y: auto;
  `,
  Item: styled.div`
    cursor: pointer;
  `,
  ForCalculateSize: styled.div``,
}
export type DivAttributes = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

export type DropdownListType = { [key in string | number]: string | number }
export type DropdownValue<T> = Partial<T>

export type AdditionalCss = SerializedStyles | string
export type KeyValueType = {
  key: string
  value: string | number
}
export type GetDropdownReturnType<T> = {
  dropdownList: T | null
  cursor?: string | number | null
  abortController?: AbortController
}
export const isGetDropdownReturnType = <T extends DropdownListType>(
  value: any
): value is GetDropdownReturnType<T> => {
  return value && typeof value === 'object' && 'dropdownList' in value
}

export type DropdownListPropsType<T extends DropdownListType | string[]> =
  | T
  | ((
      args?: GetDropdownReturnType<T>
    ) => Promise<T | GetDropdownReturnType<T>> | null)
  | string[]

export interface DropdownProps<T extends DropdownListType | string[]>
  extends DivAttributes {
  _value: DropdownValue<T> | null | undefined
  _list: DropdownListPropsType<T>
  _emitValue: (value: DropdownValue<T> | null) => void

  _css?: AdditionalCss
  _placeholder?: string
  _disabled?: boolean
  _autoWidth?: boolean
  _parseLabel?: (value: DropdownValue<T>) => string
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
  const [pending, set_pending] = useState<boolean>(false)
  const [nextQuery, set_nextQuery] = useState<GetDropdownReturnType<T> | null>(
    null
  )
  const [currentList, set_currentList] = useState<T | null>(null) // null 이면 pending

  useEffect(() => {
    if (!isFunction(_list)) {
      set_currentList(
        _list instanceof Array ? (arrayToStringObject(_list) as T) : _list
      )
    }
  }, [_list])

  const getCurrentList = useCallback(
    async (
      listByProps: DropdownListPropsType<T>,
      callNext?: GetDropdownReturnType<T> | null
    ) => {
      let currentList: T | null = null
      if (listByProps) {
        if (typeof listByProps === 'function') {
          set_pending(true)
          const listResponse = await listByProps(callNext ?? undefined)
          if (isGetDropdownReturnType(listResponse)) {
            currentList = listResponse.dropdownList
            if (listResponse.cursor) {
              set_nextQuery(listResponse)
            } else {
              set_nextQuery(null)
            }
          } else {
            currentList = listResponse
          }
          set_pending(false)
        } else if (listByProps instanceof Array) {
          currentList = listByProps.reduce((prev, curr) => {
            prev[curr] = curr
            return prev
          }, {} as { [key in string]: string }) as T
        } else {
          currentList = listByProps
        }
      }
      console.log('currentList', currentList)
      return currentList
    },
    []
  )

  const labelString = useMemo(() => {
    if (_value) {
      if (_parseLabel) {
        return _parseLabel(_value)
      } else {
        return _value
          ? objectKeys(_value).map((keyName) => _value[keyName])[0]
          : null
      }
    } else {
      return _placeholder ?? '선택'
    }
  }, [_value, _parseLabel, _placeholder])

  return (
    <>
      <DropdownStyle.Wrap>
        <DropdownStyle.Label
          onClick={async () => {
            if (currentList) {
              set_currentList(null)
              return
            }
            const list = await getCurrentList(_list)
            list && set_currentList(list)
          }}
        >
          <label>{labelString}</label>
          <div>{pending ? 'Loading...' : ''}</div>
        </DropdownStyle.Label>
        {currentList && (
          <DropdownStyle.ListWrap>
            <DropdownStyle.ListInner
              onScroll={async (e) => {
                let scrollingElement = e.currentTarget
                if (!nextQuery) return
                if (
                  scrollingElement.scrollHeight ===
                  scrollingElement.clientHeight + scrollingElement.scrollTop
                ) {
                  const list = await getCurrentList(_list, nextQuery)
                  list && set_currentList(list)
                }
              }}
            >
              {objectKeys(currentList).map((item, index) => {
                return (
                  <DropdownStyle.Item
                    key={String(currentList[item]) + String(index)}
                    onClick={() => {
                      const partialValue = {
                        [item]: currentList[item],
                      } as DropdownValue<T>
                      _emitValue(partialValue)
                      set_currentList(null)
                    }}
                  >
                    {currentList[item]}
                  </DropdownStyle.Item>
                )
              })}
            </DropdownStyle.ListInner>
          </DropdownStyle.ListWrap>
        )}
      </DropdownStyle.Wrap>
    </>
  )
}
export default Dropdown
