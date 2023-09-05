// Importaciones de las páginas y estilos necesarios
import Root from './pages/Root'
import Shell from './pages/Shell'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import PeopleList from './pages/PeopleList'
import ToursList from './pages/ToursList'
import CommentsList from './pages/CommentsList'
import './index.css'
import { MantineProvider } from '@mantine/core'
// Importaciones para configurar el enrutador
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Configuración del enrutador
const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Root /> // Ruta de la página principal
  },
  {
    path: "/sign-in",
    element: <SignIn /> // Ruta de la página de inicio de sesión
  },
  {
    path: "/sign-up",
    element: <SignUp /> // Ruta de la página de registro
  },
  {
    path: "/content/",
    element: <Shell />, // Ruta de la página de contenido principal
    children: [
      {
        path: "people",
        element: <PeopleList /> // Ruta de la lista de personas
      },
      {
        path: "tours",
        element: <ToursList />, // Ruta de la lista de tours
      },
      {
        path: "comments",
        element: <CommentsList /> // Ruta de la lista de comentarios
      }
    ]
  },
])

// Componente principal que configura el enrutador
export default () => {
  return (
  <MantineProvider theme={{ primaryColor: "lime" }}>
    <RouterProvider router={browserRouter} />
  </MantineProvider>
  )
}
