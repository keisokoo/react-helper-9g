import create, { StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
export type TokenType = {
  accessToken: string
  accessTokenExpiresIn: string
  refreshToken: string
  refreshTokenExpiresIn: string
}
export interface ResponseData {
  appeal: null | string
  startTime: string
  endTime: string
  reason: string
  token: TokenType
}
export interface ForbiddenResponse {
  success: boolean
  error: string
  message: string
  data: ResponseData
}
export type AuthStateType = 'authorized' | 'unauthorized' | 'idle' | 'forbidden'

export interface AuthSlice {
  token: TokenType | null
  authState: AuthStateType
  forbidden: ForbiddenResponse | null
  setToken: (token: TokenType) => void
  unauthorize: () => void
  clearToken: () => void
  setForbidden: (forbidden: ForbiddenResponse) => void
}

export const createAuthSlice: StateCreator<
  AuthSlice,
  [],
  [['zustand/devtools', AuthSlice]] // devtools 사용시 명시
> = devtools((set) => ({
  token: null,
  authState: 'idle',
  forbidden: null,
  setToken: (token: TokenType) =>
    set(
      () => ({ token, forbidden: null, authState: 'authorized' }),
      false,
      'setToken' // devtools 사용시 명시
    ),
  unauthorize: () => {
    set(() => ({ token: null, forbidden: null, authState: 'unauthorized' }))
  },
  clearToken: () => {
    set(() => ({ token: null, forbidden: null, authState: 'idle' }))
  },
  setForbidden: (forbidden: ForbiddenResponse) => {
    set(() => ({ token: null, forbidden, authState: 'forbidden' }))
  },
}))

export const authStore = create<AuthSlice>()((...a) => ({
  ...createAuthSlice(...a),
}))

export const tokenStates = (state: AuthSlice) => ({
  token: state.token,
})
export const authStates = (state: AuthSlice) => ({
  authState: state.authState,
})
export const authForbidden = (state: AuthSlice) => ({
  forbidden: state.forbidden,
})

export const authActions = (state: AuthSlice) => ({
  setToken: state.setToken,
  unauthorize: state.unauthorize,
  setForbidden: state.setForbidden,
  clearToken: state.clearToken,
})
