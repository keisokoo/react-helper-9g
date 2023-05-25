import styled from '@emotion/styled/macro'
import axios from 'axios'

const InfiniteScrollSampleWrap = styled.div``

interface InfiniteScrollSampleProps {}
const InfiniteScrollSample = ({ ...props }: InfiniteScrollSampleProps) => {
  const getPostData = async () => {
    try {
      const res = await axios.get(`https://dummyjson.com/products?limit=10`)
      console.log('res', res)
    } catch (error) {
      console.log('error', error)
    }
  }
  return (
    <>
      <InfiniteScrollSampleWrap></InfiniteScrollSampleWrap>
    </>
  )
}
export default InfiniteScrollSample
