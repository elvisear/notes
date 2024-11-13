import {
  VStack,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Box,
  Avatar,
  Center,
  Divider,
  Text,
  HStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { PhoneInput } from './PhoneInput'
import { AddressForm } from './AddressForm'
import { AvatarSelector } from './AvatarSelector'
import { Camera } from 'phosphor-react'

interface ProfileFormData {
  name: string
  email: string
  bio: string
  avatarUrl?: string
  phone: string
  phoneCountry: string
  profession: string
  birthDate: string
  address: {
    country: string
    zipCode: string
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
  }
}

interface ProfileFormProps {
  initialData: Partial<ProfileFormData>
  onSubmit: (data: ProfileFormData) => Promise<void>
  isLoading?: boolean
}

export function ProfileForm({ initialData, onSubmit, isLoading }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    name: initialData.name || '',
    email: initialData.email || '',
    bio: initialData.bio || '',
    avatarUrl: initialData.avatarUrl,
    phone: initialData.phone || '',
    phoneCountry: initialData.phoneCountry || 'BR',
    profession: initialData.profession || '',
    birthDate: initialData.birthDate || '',
    address: initialData.address || {
      country: 'BR',
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    }
  })
  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false)
  const toast = useToast()

  const handleChange = (field: keyof ProfileFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit(formData)
    } catch (error) {
      toast({
        title: 'Erro ao atualizar perfil',
        description: 'Tente novamente mais tarde.',
        status: 'error',
        duration: 3000,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={8} align="stretch">
        {/* Avatar Section */}
        <Center flexDirection="column">
          <Box position="relative">
            <Avatar
              size="2xl"
              name={formData.name}
              src={formData.avatarUrl}
              cursor="pointer"
              onClick={() => setIsAvatarSelectorOpen(true)}
            />
            <Button
              size="sm"
              rounded="full"
              position="absolute"
              bottom="0"
              right="0"
              leftIcon={<Camera />}
              onClick={() => setIsAvatarSelectorOpen(true)}
            >
              Alterar foto
            </Button>
          </Box>
        </Center>

        <Divider />

        {/* Personal Information */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl isRequired>
            <FormLabel>Nome</FormLabel>
            <Input
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="Seu nome completo"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="seu@email.com"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Profissão</FormLabel>
            <Input
              value={formData.profession}
              onChange={handleChange('profession')}
              placeholder="Sua profissão"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Data de Nascimento</FormLabel>
            <Input
              type="date"
              value={formData.birthDate}
              onChange={handleChange('birthDate')}
            />
          </FormControl>
        </SimpleGrid>

        <FormControl>
          <FormLabel>Biografia</FormLabel>
          <Textarea
            value={formData.bio}
            onChange={handleChange('bio')}
            placeholder="Conte um pouco sobre você"
            rows={4}
          />
        </FormControl>

        <Divider />

        {/* Contact Information */}
        <Text fontSize="lg" fontWeight="bold">Informações de Contato</Text>
        
        <PhoneInput
          value={formData.phone}
          onChange={(value, isValid) => {
            setFormData(prev => ({ ...prev, phone: value }))
          }}
          country={formData.phoneCountry}
          onCountryChange={(country) => {
            setFormData(prev => ({ ...prev, phoneCountry: country }))
          }}
        />

        <Divider />

        {/* Address Information */}
        <Text fontSize="lg" fontWeight="bold">Endereço</Text>
        
        <AddressForm
          onAddressChange={(address) => {
            setFormData(prev => ({ ...prev, address }))
          }}
          initialAddress={formData.address}
          country={formData.address.country}
        />

        <HStack justify="flex-end" pt={4}>
          <Button type="submit" colorScheme="brand" isLoading={isLoading}>
            Salvar Alterações
          </Button>
        </HStack>
      </VStack>

      <AvatarSelector
        isOpen={isAvatarSelectorOpen}
        onClose={() => setIsAvatarSelectorOpen(false)}
        onSelect={(url) => {
          setFormData(prev => ({ ...prev, avatarUrl: url }))
        }}
        currentAvatar={formData.avatarUrl}
      />
    </form>
  )
} 