import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from '@/routes'

const router = createBrowserRouter(routes)

function App(): React.JSX.Element {
  return <RouterProvider router={router}></RouterProvider>
}

export default App
