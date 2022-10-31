import {
  shallowEqual,
  TypedUseSelectorHook,
  useDispatch,
  useSelector as useAppSelector,
} from 'react-redux'
import { AppDispatch, RootState } from '../redux'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useSelector: TypedUseSelectorHook<RootState> = useAppSelector

export function useShallowSelector<
  TState = Partial<RootState>,
  TSelected = unknown
>(selector: (state: TState) => TSelected): TSelected {
  return useAppSelector(selector, shallowEqual)
}
const hooks = { useAppDispatch, useShallowSelector }
export default hooks
