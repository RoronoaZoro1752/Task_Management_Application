import { Children, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Dashboard from './components/Dashboard.jsx'
import Signin from './components/Signin.jsx'
import Signup from './components/Signup.jsx'

const Path = [
  {
    path: "/",
    element: <App />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/signin",
    element: <Signin />
  },
  {
    path: "/signup",
    element: <Signup />
  }
]

const myroute = createBrowserRouter(Path);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={myroute}></RouterProvider>
  </StrictMode>,
)
