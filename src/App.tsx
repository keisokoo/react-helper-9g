import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DragSample from './components/DragSample'
import DropdownSample from './components/DropdownSample'
import LiveSearchSample from './components/LiveSearchSample'
import StepperSample from './components/StepperSample'
import Layout from './layout/Layout'
import Main from './Main'
import Test from './Test'

export const childRoutes = [
  {
    index: true,
    element: <Main />,
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
    path: '/stepper-sample',
    element: <StepperSample />,
  },
  {
    path: '/live-search-sample',
    element: <LiveSearchSample />,
  },
  {
    path: '/test',
    element: <Test />,
  },
]
export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: childRoutes,
  },
]
function RouteComponent() {
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
