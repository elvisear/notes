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
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...registerData } = data
      await signUp({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password
      })
      toast.success('Conta criada com sucesso!')
      navigate('/login')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta. Tente novamente.')
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
        maxW="600px"
      >
        <VStack spacing={6} w="100%">
          <Heading size="lg">Crie sua conta</Heading>
          <Text color="gray.500" textAlign="center">
            Comece a organizar suas notas de forma simples e eficiente
          </Text>

          <VStack as="form" spacing={4} w="100%" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Nome</FormLabel>
              <Input
                placeholder="Seu nome"
                size="lg"
                {...register('name')}
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>

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

            <FormControl isInvalid={!!errors.confirmPassword}>
              <FormLabel>Confirmar Senha</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirme sua senha"
                  size="lg"
                  {...register('confirmPassword')}
                />
                <InputRightElement h="full">
                  <IconButton
                    aria-label={showConfirmPassword ? 'Esconder senha' : 'Mostrar senha'}
                    icon={showConfirmPassword ? <EyeSlash /> : <Eye />}
                    variant="ghost"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              bg="brand.primary"
              color="white"
              size="lg"
              w="100%"
              isLoading={isSubmitting}
              mt={4}
              _hover={{ bg: 'brand.primaryDark' }}
            >
              Criar conta
            </Button>
          </VStack>

          <Text>
            Já tem uma conta?{' '}
            <Link to="/login">
              <Text as="span" color="brand.primary" fontWeight="bold">
                Faça login
              </Text>
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  )
} 