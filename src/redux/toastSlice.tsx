import { createSlice } from '@reduxjs/toolkit'
import { isArray } from 'lodash-es'
import { RootState } from '.'
// 버튼 타입 추가
export type ToastDisplayType = 'success' | 'error'

export interface ToastType {
  message: string
  created: number
  type: ToastDisplayType
}
interface toastState {
  options: ToastType
}
const initialState: toastState = {
  options: {
    message: '',
    created: 0,
    type: 'success',
  },
}

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    setToast: (
      state,
      action: {
        payload: Omit<ToastType, 'created'> | [string, ToastDisplayType]
      }
    ) => {
      let message = ''
      let type = 'success' as ToastDisplayType
      if (isArray(action.payload)) {
        message = action.payload[0]
        if (action.payload[1]) type = action.payload[1]
      } else {
        message = action.payload.message
        if (action.payload.type) type = action.payload.type
      }
      state.options = {
        message,
        created: Date.now(),
        type,
      }
    },
    cleanToast: (state) => {
      state.options = initialState.options
    },
  },
})
export const { setToast, cleanToast } = toastSlice.actions

export const selectToast = (state: RootState) => state.toast.options

export default toastSlice.reducer
