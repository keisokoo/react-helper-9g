import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DatePickerSample from './components/DatePickerSample'
import DragSample from './components/DragSample'
import DropdownSample from './components/DropdownSample'
import InfiniteScrollSample from './components/InfiniteScrollSample'
import LineChartSample from './components/LineChartSample'
import LiveSearchSample from './components/LiveSearchSample'
import MatchInputSample from './components/MatchInputSample'
import StepperSample from './components/StepperSample'
import Layout from './layout/Layout'
import Main from './Main'
import { store } from './redux'
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
    path: '/list-infinite-sample',
    element: <InfiniteScrollSample />,
  },
  {
    path: '/match-input-sample',
    element: <MatchInputSample />,
  },
  {
    path: '/line-chart-sample',
    element: <LineChartSample />,
  },
  {
    path: '/date-picker-sample',
    element: <DatePickerSample />,
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
    <Provider store={store}>
      <RouteComponent />
    </Provider>
  )
}

export default App
