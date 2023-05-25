import styled from '@emotion/styled/macro'
import axios from 'axios'
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { DivAttributes } from '../templates/Dropdown'

const InfiniteScrollSampleWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`
export const ListWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 240px;
  overflow-y: auto;
`
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
interface InfiniteScrollSampleProps {}
interface ListItemProps extends DivAttributes {
  children?: React.ReactNode
  _emitHeight: (height: number) => void
}
const ListItem = ({ children, _emitHeight, ...props }: ListItemProps) => {
  const itemRef = useRef() as MutableRefObject<HTMLDivElement>
  useEffect(() => {
    if (itemRef.current) {
      _emitHeight(itemRef.current.offsetHeight)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div ref={itemRef} {...props}>
      {children}
    </div>
  )
}

const InfiniteScrollSample = ({ ...props }: InfiniteScrollSampleProps) => {
  // const [listPool, set_listPool] = useState<ProductType[]>([])
  const [items, set_items] = useState<ProductType[] | null>(null)
  const nextCursorRef = useRef() as MutableRefObject<number | null>
  const heightTotalRef = useRef(0) as MutableRefObject<number>

  const getPostData = useCallback(async (nextCursor?: number) => {
    try {
      const res = await axios.get<DummyProductsType>(
        `https://dummyjson.com/products?limit=10${
          nextCursor ? `&skip=${nextCursor}` : ''
        }`
      )
      if (res.data) {
        set_items((prev) =>
          prev ? [...prev, ...res.data.products] : [...res.data.products]
        )
        // set_listPool((prev) => [...prev, ...res.data.products])
        if (res.data.products.length !== 0) {
          nextCursorRef.current =
            res.data.products[res.data.products.length - 1].id
        } else {
          nextCursorRef.current = null
        }
      }
    } catch (error) {
      console.log('error', error)
    }
  }, [])
  const onScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const { scrollHeight, scrollTop, clientHeight } = e.currentTarget

      if (scrollTop + clientHeight === scrollHeight && nextCursorRef.current) {
        getPostData(nextCursorRef.current)
      }
    },
    [getPostData]
  )

  useEffect(() => {
    getPostData()
    return () => {
      nextCursorRef.current = null
      set_items(null)
    }
  }, [getPostData])
  return (
    <>
      <InfiniteScrollSampleWrap>
        {items === null ? (
          <div>로딩중...</div>
        ) : (
          <>
            {items.length === 0 ? (
              <div>Not Found</div>
            ) : (
              <ListWrap onScroll={onScroll}>
                {items.map((item, itemIndex) => {
                  return (
                    <ListItem
                      key={item.id}
                      data-id={itemIndex}
                      _emitHeight={(num) => {
                        heightTotalRef.current += num ?? 0

                        console.log(
                          'heightTotalRef.current',
                          heightTotalRef.current
                        )
                      }}
                    >
                      {item.title}
                    </ListItem>
                  )
                })}
              </ListWrap>
            )}
          </>
        )}
      </InfiniteScrollSampleWrap>
    </>
  )
}
export default InfiniteScrollSample
