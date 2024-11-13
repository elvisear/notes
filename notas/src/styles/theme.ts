import { extendTheme, ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
}

export const theme = extendTheme({
  config,
  colors: {
    brand: {
      primary: '#FE7028',
    },
    light: {
      bg: {
        primary: '#FFFFFF',
        secondary: '#F8F8F8',
        tertiary: '#F2F2F2',
      },
      text: {
        primary: '#1A1A1A',
        secondary: '#4A4A4A',
      },
      border: '#E2E2E2',
    },
    dark: {
      bg: {
        primary: '#000000',
        secondary: '#1A1A1A',
        tertiary: '#2D2D2D',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#A0A0A0',
      },
      border: '#2D2D2D',
    }
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'dark.bg.primary' : 'light.bg.primary',
        color: props.colorMode === 'dark' ? 'dark.text.primary' : 'light.text.primary',
      }
    })
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      }
    },
    Card: {
      baseStyle: (props: any) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'dark.bg.secondary' : 'light.bg.secondary',
          borderColor: props.colorMode === 'dark' ? 'dark.border' : 'light.border',
        }
      })
    },
    Input: {
      variants: {
        outline: (props: any) => ({
          field: {
            bg: props.colorMode === 'dark' ? 'dark.bg.secondary' : 'light.bg.secondary',
            borderColor: props.colorMode === 'dark' ? 'dark.border' : 'light.border',
            color: props.colorMode === 'dark' ? 'dark.text.primary' : 'light.text.primary',
            _hover: {
              borderColor: props.colorMode === 'dark' ? 'dark.border' : 'light.border',
            },
            _focus: {
              borderColor: 'brand.primary',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-primary)',
            }
          }
        })
      }
    },
    Menu: {
      baseStyle: (props: any) => ({
        list: {
          bg: props.colorMode === 'dark' ? 'dark.bg.secondary' : 'light.bg.secondary',
          borderColor: props.colorMode === 'dark' ? 'dark.border' : 'light.border',
        },
        item: {
          bg: props.colorMode === 'dark' ? 'dark.bg.secondary' : 'light.bg.secondary',
          color: props.colorMode === 'dark' ? 'dark.text.primary' : 'light.text.primary',
          _hover: {
            bg: props.colorMode === 'dark' ? 'dark.bg.tertiary' : 'light.bg.tertiary',
          }
        }
      })
    }
  }
}) 