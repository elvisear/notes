import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { NewNote } from './pages/NewNote'
import { EditNote } from './pages/EditNote'
import { Favorites } from './pages/Favorites'
import { NotebookNotes } from './pages/NotebookNotes'
import { Login } from './components/auth/Login'
import { Register } from './components/auth/Register'
import { AuthProvider } from './contexts/AuthContext'
import { NotesProvider } from './contexts/NotesContext'
import { TagsProvider } from './contexts/TagsContext'
import { useAuth } from './contexts/AuthContext'
import { Spinner, Center, ChakraProvider, Text, Button } from '@chakra-ui/react'
import { Profile } from './pages/Profile'
import { Home } from './pages/Home'
import { Suspense } from 'react'
import { Toaster } from 'sonner'
import { Tags } from './pages/Tags'
import { theme } from './styles/theme'
import { ThemeProvider } from './contexts/ThemeContext'
import { ColorModeScript } from '@chakra-ui/react'
import { PinnedTagsProvider } from './contexts/PinnedTagsContext'
import { ErrorBoundary } from 'react-error-boundary'
import { StatsProvider } from './contexts/StatsContext'

function LoadingSpinner() {
  return (
    <Center h="100vh">
      <Spinner size="xl" color="brand.primary" thickness="4px" />
    </Center>
  )
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

function ErrorFallback() {
  return (
    <Center h="100vh" flexDirection="column" gap={4}>
      <Text>Algo deu errado. Por favor, tente novamente.</Text>
      <Button onClick={() => window.location.reload()}>
        Recarregar página
      </Button>
    </Center>
  )
}

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingSpinner />}>
          <AuthProvider>
            <ThemeProvider>
              <TagsProvider>
                <PinnedTagsProvider>
                  <NotesProvider>
                    <StatsProvider>
                      <Toaster
                        position="top-center"
                        expand={false}
                        richColors
                        closeButton
                        theme="system"
                        duration={4000}
                        toastOptions={{
                          style: {
                            background: 'var(--chakra-colors-white)',
                            border: '1px solid var(--chakra-colors-gray-200)',
                            padding: '16px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                            fontSize: '14px',
                            fontWeight: 500,
                          }
                        }}
                      />
                      <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                          path="/"
                          element={
                            <PrivateRoute>
                              <Layout />
                            </PrivateRoute>
                          }
                        >
                          <Route index element={<Navigate to="/notes" replace />} />
                          <Route path="notes" element={<Home />} />
                          <Route path="notes/:id" element={<EditNote />} />
                          <Route path="new" element={<NewNote />} />
                          <Route path="favorites" element={<Favorites />} />
                          <Route path="notebook/:notebook" element={<NotebookNotes />} />
                          <Route path="profile" element={<Profile />} />
                          <Route path="tags" element={<Tags />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/notes" replace />} />
                      </Routes>
                    </StatsProvider>
                  </NotesProvider>
                </PinnedTagsProvider>
              </TagsProvider>
            </ThemeProvider>
          </AuthProvider>
        </Suspense>
      </ErrorBoundary>
    </ChakraProvider>
  )
} 