import styled from '@emotion/styled/macro'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'

const LayoutWrap = styled.div`
  width: 100%;
  height: 100%;
`

interface LayoutProps {}
const Layout = ({ ...props }: LayoutProps) => {
  const location = useLocation()

  return (
    <>
      {location.pathname === '/' && <Nav />}
      <LayoutWrap>
        <Outlet />
      </LayoutWrap>
    </>
  )
}
export default Layout
