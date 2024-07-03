import './App.css'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PrivateRoutes from './components/PrivateRoute'
import PublicRoutes from './components/PublicRoute'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  const router = createBrowserRouter([
      {
        path: '/',
        element: <PublicRoutes/>,
        children: [
          {
            path: "",
            element: <Login />,
          },
        ],
      },
      {
        path: '/',
        element: <PrivateRoutes/>,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
        ],
      },
   ])

  return (
    <>
       <RouterProvider router={router}/>
       <ToastContainer
              position="bottom-right"
              autoClose={5000}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
    </>
  )
}

export default App
