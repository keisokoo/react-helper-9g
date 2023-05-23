import styled from '@emotion/styled'
import { useEffect } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from 'react-router-dom'
import DragSample from './components/DragSample'
import DropdownSample from './components/DropdownSample'
import Test from './Test'
const NavComponent = () => {
  const navs = [
    {
      path: '/',
    },
    {
      path: '/drag-sample',
    },
    {
      path: '/dropdown-sample',
    },
    {
      path: '/test',
    },
  ]
  const navigate = useNavigate()
  return (
    <Nav>
      {navs.map((route) => {
        return (
          <div key={route.path}>
            <button
              onClick={() => {
                navigate(route.path)
              }}
            >
              {route.path}
            </button>
          </div>
        )
      })}
    </Nav>
  )
}
export const routes = [
  {
    path: '/',
    element: <NavComponent />,
  },
  {
    path: '/drag-sample',
    element: <DragSample />,
  },
  {
    path: '/dropdown-sample',
    element: <DropdownSample />,
  },
  {
    path: '/test',
    element: <Test />,
  },
]
const Nav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
function RouteComponent() {
  useEffect(() => {
    console.log('routes', routes)
  }, [])
  const router = createBrowserRouter(routes)
  return <RouterProvider router={router}></RouterProvider>
}
function App() {
  return (
    <>
      <RouteComponent />
    </>
  )
}

export default App
