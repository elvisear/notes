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

export function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signUp({ name, email, password })
    } catch (error) {
      toast({
        title: 'Erro ao criar conta',
        description: 'Ocorreu um erro ao tentar criar sua conta. Tente novamente.',
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
          <Heading size="lg">Criar uma conta</Heading>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  bg="gray.900"
                  border="none"
                  _focus={{ ring: 1, ringColor: 'green.500' }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg="gray.900"
                  border="none"
                  _focus={{ ring: 1, ringColor: 'green.500' }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Senha</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  bg="gray.900"
                  border="none"
                  _focus={{ ring: 1, ringColor: 'green.500' }}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="green"
                size="lg"
                isLoading={isLoading}
              >
                Criar conta
              </Button>
            </VStack>
          </form>

          <Text>
            Já tem uma conta?{' '}
            <ChakraLink as={Link} to="/login" color="green.500">
              Faça login
            </ChakraLink>
          </Text>
        </VStack>
      </Box>
    </Box>
  )
} 