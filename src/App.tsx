import { useEffect } from 'react'
import { useShallowSelector } from './hooks/reduxHooks'
import { selectTest } from './redux/testSlice'

function App() {
  const abc = useShallowSelector(selectTest)
  useEffect(() => {
    if (abc) {
      console.log('abc', abc)
    }
  }, [abc])
  return <>리액트 프론트엔드 공통 모듈</>
}

export default App
