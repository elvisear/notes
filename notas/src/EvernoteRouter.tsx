import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Notes } from './pages/Notes'
import { NewNote } from './pages/NewNote'
import { EditNote } from './pages/EditNote'
import { Favorites } from './pages/Favorites'
import { NotebookNotes } from './pages/NotebookNotes'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { useAuth } from './contexts/AuthContext'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null // ou um componente de loading
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}

const EvernoteRouter = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '/',
        element: <Notes />
      },
      {
        path: '/notes',
        element: <Notes />
      },
      {
        path: '/new',
        element: <NewNote />
      },
      {
        path: '/edit/:id',
        element: <EditNote />
      },
      {
        path: '/favorites',
        element: <Favorites />
      },
      {
        path: '/notebook/:notebook',
        element: <NotebookNotes />
      }
    ]
  }
])

export default EvernoteRouter
