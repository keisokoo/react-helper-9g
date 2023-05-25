import styled from '@emotion/styled/macro'
import { useNavigate } from 'react-router-dom'
import { childRoutes } from '../App'

const NavWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

interface NavProps {}
const Nav = ({ ...props }: NavProps) => {
  const navigate = useNavigate()
  return (
    <>
      <NavWrap>
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
