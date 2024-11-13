import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Link as ChakraLink,
  useToast,
  Image,
  Heading
} from '@chakra-ui/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signIn(email, password)
      toast({
        title: 'Login realizado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer login',
        description: error.message || 'Verifique suas credenciais e tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      bg="gray.900"
    >
      <Box 
        w="100%" 
        maxW="400px" 
        p={8} 
        borderRadius="lg" 
        bg="gray.800"
        boxShadow="lg"
      >
        <VStack spacing={6}>
          <Image 
            src="/evernote-logo.png" 
            alt="Evernote Logo" 
            h="40px"
          />
          <Heading size="lg" color="white">Bem-vindo de volta</Heading>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel color="gray.200">Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg="gray.900"
                  border="none"
                  color="white"
                  _focus={{ ring: 1, ringColor: 'brand.primary' }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="gray.200">Senha</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  bg="gray.900"
                  border="none"
                  color="white"
                  _focus={{ ring: 1, ringColor: 'brand.primary' }}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="brand"
                size="lg"
                isLoading={isLoading}
              >
                Entrar
              </Button>
            </VStack>
          </form>

          <Text color="gray.300">
            Não tem uma conta?{' '}
            <ChakraLink as={Link} to="/register" color="brand.primary">
              Registre-se
            </ChakraLink>
          </Text>
        </VStack>
      </Box>
    </Box>
  )
} 