import { RouterProvider } from 'react-router'
import { router } from './routes/Route.jsx'


function App() {

  return (
    <RouterProvider router={router}/>
  )
}

export default App
