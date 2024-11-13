import { createContext, useContext, useState, ReactNode } from 'react'
import { useColorMode } from '@chakra-ui/react'

interface ThemeContextData {
  sidebarWidth: string
  setSidebarWidth: (width: string) => void
  toggleTheme: () => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState("240px")
  const { colorMode, toggleColorMode } = useColorMode()

  const toggleTheme = () => {
    toggleColorMode()
  }

  return (
    <ThemeContext.Provider value={{
      sidebarWidth,
      setSidebarWidth,
      toggleTheme,
      isDark: colorMode === 'dark'
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext) 