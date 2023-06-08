import styled from '@emotion/styled/macro'
import { useNavigate } from 'react-router-dom'
import { childRoutes } from '../App'
import ToastMessage from '../components/ToastMessage'
import { useAppDispatch } from '../hooks/reduxHooks'
import { setToast } from '../redux/toastSlice'

const NavWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

interface NavProps {}
const Nav = ({ ...props }: NavProps) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  return (
    <>
      <ToastMessage />
      <NavWrap>
        <div>
          <button
            onClick={() => {
              dispatch(setToast(['토스트 메시지', 'success']))
            }}
          >
            Toast Messages
          </button>
        </div>
        {childRoutes.map((route, routeIndex) => {
          return (
            <div key={route.path + String(routeIndex)}>
              <button
                onClick={() => {
                  navigate(route.path ?? '/')
                }}
              >
                {route.path ?? '/'}
              </button>
            </div>
          )
        })}
      </NavWrap>
    </>
  )
}
export default Nav
