import { createHashRouter, RouterProvider } from 'react-router-dom'
import routes from '@/routes'
const router = createHashRouter(routes)

function App(): React.JSX.Element {
  return <RouterProvider router={router}></RouterProvider>
}

export default App
