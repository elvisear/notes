import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  IconButton,
  FormErrorMessage,
  Heading,
} from '@chakra-ui/react'
import { Eye, EyeSlash } from 'phosphor-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useAuth()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password)
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login')
    }
  }

  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue('gray.50', 'gray.900')}
    >
      <Box
        p={8}
        bg={bgColor}
        borderRadius="xl"
        boxShadow="xl"
        border="1px"
        borderColor={borderColor}
        w="full"
        maxW="400px"
      >
        <VStack spacing={6}>
          <Heading size="lg">Bem-vindo de volta!</Heading>
          <Text color="gray.500">
            Entre com suas credenciais para acessar suas notas
          </Text>

          <VStack as="form" spacing={4} w="100%" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="seu@email.com"
                size="lg"
                {...register('email')}
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Senha</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  size="lg"
                  {...register('password')}
                />
                <InputRightElement h="full">
                  <IconButton
                    aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                    icon={showPassword ? <EyeSlash /> : <Eye />}
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              bg="brand.primary"
              color="white"
              size="lg"
              w="100%"
              isLoading={isSubmitting}
              _hover={{ bg: 'brand.primaryDark' }}
            >
              Entrar
            </Button>
          </VStack>

          <Text>
            Não tem uma conta?{' '}
            <Link to="/register">
              <Text as="span" color="brand.primary" fontWeight="bold">
                Registre-se
              </Text>
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  )
} 