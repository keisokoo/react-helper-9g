import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '.'

interface TestStateType {
  foo: boolean
}
interface testState {
  options: TestStateType | null
}
const initialState: testState = {
  options: null,
}

export const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    setTest: (state, action: { payload: TestStateType }) => {
      state.options = action.payload
    },
    cleanTest: (state) => {
      state.options = initialState.options
    },
  },
})
export const { setTest, cleanTest } = testSlice.actions

export const selectTest = (state: RootState) => state.tests.options

export default testSlice.reducer
