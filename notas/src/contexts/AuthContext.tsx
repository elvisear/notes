import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { validatePassword } from '../utils/passwordValidation'

interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  bio?: string
  phone?: string
  phoneCountry?: string
  profession?: string
  birthDate?: string
  createdAt: Date
  address: {
    country: string
    zipCode: string | undefined
    street: string | undefined
    number: string | undefined
    complement?: string | undefined
    neighborhood: string | undefined
    city: string | undefined
    state: string | undefined
  }
}

interface SignUpData {
  name: string
  email: string
  password: string
}

interface AuthContextData {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (data: SignUpData) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('@Evernote:user')
    if (!storedUser) return null
    try {
      const parsedUser = JSON.parse(storedUser)
      return {
        ...parsedUser,
        createdAt: new Date(parsedUser.createdAt)
      }
    } catch {
      return null
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('@Evernote:token')
        if (!token) {
          setIsLoading(false)
          return
        }

        const storedUser = localStorage.getItem('@Evernote:user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      const storedUsers = localStorage.getItem('@Evernote:users')
      const users = storedUsers ? JSON.parse(storedUsers) : []
      
      const foundUser = users.find((u: any) => u.email === email)
      
      if (!foundUser) {
        throw new Error('Usuário não encontrado')
      }

      if (foundUser.password !== password) {
        throw new Error('Senha incorreta')
      }

      const { password: _, ...userWithoutPassword } = foundUser
      
      const userWithDefaults: User = {
        ...userWithoutPassword,
        id: foundUser.id,
        email: email,
        name: foundUser.name,
        createdAt: new Date(foundUser.createdAt),
        address: {
          country: foundUser.address?.country || 'BR',
          zipCode: foundUser.address?.zipCode || '',
          street: foundUser.address?.street || '',
          number: foundUser.address?.number || '',
          complement: foundUser.address?.complement || '',
          neighborhood: foundUser.address?.neighborhood || '',
          city: foundUser.address?.city || '',
          state: foundUser.address?.state || '',
        }
      }
      
      localStorage.setItem('@Evernote:user', JSON.stringify(userWithDefaults))
      localStorage.setItem('@Evernote:token', 'fake-token')
      setUser(userWithDefaults)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      navigate('/notes', { replace: true })
      
    } catch (error: any) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (data: SignUpData) => {
    try {
      const passwordValidation = validatePassword(data.password)
      if (!passwordValidation.isStrong) {
        throw new Error('A senha não atende aos requisitos mínimos de segurança')
      }

      const storedUsers = localStorage.getItem('@Evernote:users')
      const users = storedUsers ? JSON.parse(storedUsers) : []
      
      if (users.some((u: any) => u.email === data.email)) {
        throw new Error('Email já cadastrado')
      }

      const newUser = {
        id: crypto.randomUUID(),
        email: data.email,
        password: data.password,
        name: data.name,
        avatarUrl: '',
        bio: '',
        phone: '',
        phoneCountry: 'BR',
        profession: '',
        birthDate: '',
        createdAt: new Date(),
        address: {
          country: 'BR',
          zipCode: '',
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: ''
        }
      }

      const updatedUsers = [...users, newUser]
      localStorage.setItem('@Evernote:users', JSON.stringify(updatedUsers))

      const { password: _, ...userWithoutPassword } = newUser
      
      localStorage.setItem('@Evernote:user', JSON.stringify(userWithoutPassword))
      localStorage.setItem('@Evernote:token', 'fake-token')
      setUser(userWithoutPassword)
      
    } catch (error: any) {
      console.error('Erro no cadastro:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      localStorage.removeItem('@Evernote:user')
      localStorage.removeItem('@Evernote:token')
      setUser(null)
      await new Promise(resolve => setTimeout(resolve, 500))
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) return

      const updatedUser: User = {
        ...user,
        ...data,
        id: user.id,
        email: user.email,
        name: data.name || user.name,
        createdAt: user.createdAt,
        address: {
          ...user.address,
          ...(data.address || {}),
          country: user.address.country
        }
      }

      const storedUsers = localStorage.getItem('@Evernote:users')
      if (storedUsers) {
        const users = JSON.parse(storedUsers)
        const updatedUsers = users.map((u: any) => 
          u.id === user.id ? { ...u, ...updatedUser, password: u.password } : u
        )
        localStorage.setItem('@Evernote:users', JSON.stringify(updatedUsers))
      }

      localStorage.setItem('@Evernote:user', JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      signIn, 
      signUp, 
      signOut, 
      updateProfile, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 