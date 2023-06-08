import styled from '@emotion/styled/macro'
import axios from 'axios'
import { debounce } from 'lodash-es'
import { MutableRefObject, useRef, useState } from 'react'
import highlight from '../helpers/highlight'

export interface DummyUserResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

export interface User {
  id: number
  firstName: string
  lastName: string
  maidenName: string
  age: number
  gender: string
  email: string
  phone: string
  username: string
  password: string
  birthDate: string
  image: string
  bloodGroup: string
  height: number
  weight: number
  eyeColor: string
  hair: Hair
  domain: string
  ip: string
  address: Address
  macAddress: string
  university: string
  bank: Bank
  company: Company
  ein: string
  ssn: string
  userAgent: string
}

export interface Address {
  address: string
  city: string
  coordinates: Coordinates
  postalCode: string
  state: string
}

export interface Coordinates {
  lat: number
  lng: number
}

export interface Bank {
  cardExpire: string
  cardNumber: string
  cardType: string
  currency: string
  iban: string
}

export interface Company {
  address: Address
  department: string
  name: string
  title: string
}

export interface Hair {
  color: string
  type: string
}

const LiveSearchSampleWrap = styled.div`
  span.highlight {
    color: red;
  }
`

interface LiveSearchSampleProps {}
const LiveSearchSample = ({ ...props }: LiveSearchSampleProps) => {
  const [userList, set_userList] = useState<User[] | null>(null)
  const valueRef = useRef() as MutableRefObject<string>
  const [selectedUser, set_selectedUser] = useState<User | null>(null)
  const debounceSearch = debounce(async () => {
    try {
      if (!valueRef.current) {
        set_userList(null)
        return
      }
      const res = await axios.get<DummyUserResponse>(
        `https://dummyjson.com/users/search?q=${valueRef.current}`
      )
      set_userList(res.data.users)
    } catch (error) {
      set_userList(null)
    }
  }, 500)
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    valueRef.current = e.target.value
    set_userList(null)
    if (valueRef.current) {
      debounceSearch()
    }
  }

  return (
    <>
      <LiveSearchSampleWrap>
        <input onChange={handleOnChange} />
        {userList === null ? (
          <></>
        ) : userList.length === 0 ? (
          <div>검색 결과가 없습니다.</div>
        ) : (
          <div>
            {userList.map((user) => (
              <div
                style={{ cursor: 'pointer', userSelect: 'none' }}
                key={user.id}
                onClick={() => {
                  set_selectedUser(user)
                }}
              >
                {highlight(
                  `${user.lastName} ${user.firstName}, ${user.username}, ${user.email}`,
                  valueRef.current
                )}
              </div>
            ))}
          </div>
        )}
        {selectedUser && (
          <div style={{ whiteSpace: 'pre-line' }}>
            {JSON.stringify(selectedUser, null, 2)}
          </div>
        )}
      </LiveSearchSampleWrap>
    </>
  )
}
export default LiveSearchSample
