import styled from '@emotion/styled/macro'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Dropdown, {
  DropdownListType,
  DropdownValue,
  GetDropdownReturnType,
} from '../templates/Dropdown'

const DropdownSampleWrap = styled.div``

interface DropdownSampleProps {}

export interface DummyProductsType {
  products: ProductType[]
  total: number
  skip: number
  limit: number
}

export interface ProductType {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
}

const DropdownSample = ({ ...props }: DropdownSampleProps) => {
  const [value, set_value] = useState<DropdownValue<DropdownListType> | null>(
    null
  )
  const [valueTwo, set_valueTwo] =
    useState<DropdownValue<DropdownListType> | null>(null)

  const fetchDropdownList = async (): Promise<DropdownListType> => {
    try {
      const response = await axios.get<DummyProductsType>(
        `https://dummyjson.com/products?limit=10`
      )
      if (response.data) {
        const products = response.data.products
        const dropdownList = products.reduce((prev, curr) => {
          prev[curr.id] = curr.title
          return prev
        }, {} as DropdownListType)
        return dropdownList
      } else {
        return {}
      }
    } catch (error) {
      console.log('error', error)
      return {}
    }
  }
  const fetchInfiniteDropdownList = async (
    args?: GetDropdownReturnType<DropdownListType>
  ): Promise<GetDropdownReturnType<DropdownListType>> => {
    try {
      const response = await axios.get<DummyProductsType>(
        `https://dummyjson.com/products?limit=10${
          args?.cursor ? `&skip=${args?.cursor}` : ''
        }`
      )
      if (response.data) {
        const products = response.data.products
        const dropdownList = products.reduce((prev, curr) => {
          prev[curr.id] = curr.title
          return prev
        }, {} as DropdownListType)
        return {
          dropdownList: args?.dropdownList
            ? { ...args.dropdownList, ...dropdownList }
            : dropdownList,
          cursor: response.data.products[response.data.products.length - 1].id,
        }
      } else {
        return {
          dropdownList: args?.dropdownList ?? {},
        }
      }
    } catch (error) {
      console.log('error', error)
      return {
        dropdownList: args?.dropdownList ?? {},
      }
    }
  }
  useEffect(() => {}, [])
  return (
    <>
      <DropdownSampleWrap>
        <Dropdown
          _list={fetchInfiniteDropdownList}
          _value={valueTwo}
          _placeholder="무한스크롤"
          _emitValue={(value) => {
            set_valueTwo(value)
          }}
        />
        <Dropdown
          _list={fetchDropdownList}
          _value={value}
          _placeholder="일반"
          _emitValue={(value) => {
            set_value(value)
          }}
        />
      </DropdownSampleWrap>
    </>
  )
}
export default DropdownSample
