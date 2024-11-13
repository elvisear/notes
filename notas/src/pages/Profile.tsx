import {
  Box,
  VStack,
  Card,
  CardBody,
  Heading,
  Text,
  SimpleGrid,
  Avatar,
  Flex,
  useColorModeValue,
  Input,
  FormControl,
  FormLabel,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
  FormErrorMessage,
  Tooltip,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Switch,
  HStack,
  Divider,
  Badge,
  CircularProgress,
  CircularProgressLabel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Wrap,
  WrapItem,
  Spinner,
  InputGroup,
  InputRightElement,
  Select,
  Textarea,
  type InputProps,
} from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext'
import { Camera, PencilSimple, Key, Shield, Bell, Gear, User, ChartLine, Note, Star, Tag as TagIcon, Clock, ArrowUp } from 'phosphor-react'
import { useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useStats } from '../contexts/StatsContext'
import { formatBytes } from '../utils/formatBytes'
import InputMask from 'react-input-mask'
import { searchCEP } from '../services/cep'
import type { InputMaskProps } from 'react-input-mask'

const profileSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  profession: z.string().optional(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  bio: z.string().max(255, 'A bio deve ter no máximo 255 caracteres').optional(),
  address: z.object({
    country: z.string(),
    zipCode: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
  }).optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface MaskedInputProps extends Omit<InputProps, keyof InputMaskProps> {
  control: Control<ProfileFormData>
  name: Path<ProfileFormData>
  mask: string
  onBlur?: (e: any) => void
}

const MaskedInput = ({ 
  control, 
  name, 
  mask,
  onBlur, 
  ...rest 
}: MaskedInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }: { field: FieldValues }) => (
        <Input
          as={InputMask}
          mask={mask}
          value={field.value || ''}
          onChange={field.onChange}
          onBlur={(e) => {
            field.onBlur()
            onBlur?.(e)  // Chama o onBlur personalizado se existir
          }}
          {...rest}
        />
      )}
    />
  )
}

export function Profile() {
  const { user, updateProfile } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isUpdating, setIsUpdating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoadingCEP, setIsLoadingCEP] = useState(false)
  const [phoneCountry, setPhoneCountry] = useState(user?.phoneCountry || 'BR')
  const [bioLength, setBioLength] = useState(user?.bio?.length || 0)
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const tabBg = useColorModeValue('gray.50', 'gray.700')
  const userName = typeof user?.name === 'string' ? user.name : ''

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      profession: user?.profession || '',
      phone: user?.phone || '',
      birthDate: user?.birthDate || '',
      bio: user?.bio || '',
      address: {
        country: user?.address?.country || 'BR',
        street: user?.address?.street || '',
        number: user?.address?.number || '',
        complement: user?.address?.complement || '',
        neighborhood: user?.address?.neighborhood || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zipCode: user?.address?.zipCode || '',
      },
    },
  })

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // Converter a imagem para Base64
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        const base64String = reader.result as string
        
        await updateProfile({
          ...user!,
          avatarUrl: base64String,
        })
        
        toast.success('Foto atualizada com sucesso!')
      }
    } catch (error) {
      toast.error('Erro ao atualizar a foto')
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsUpdating(true)
      await updateProfile({
        ...user!,
        ...data,
        address: {
          ...user!.address,
          ...(data.address || {}),
          country: user!.address.country // Mantendo o país original
        }
      })
      toast.success('Perfil atualizado com sucesso!')
      onClose()
    } catch (error) {
      toast.error('Erro ao atualizar perfil')
    } finally {
      setIsUpdating(false)
    }
  }

  const { stats, isLoading: statsLoading } = useStats()

  const calculateFavoritePercentage = () => {
    if (!stats) return '0'
    if (stats.totalNotes === 0) return '0'
    return ((stats.favoriteNotes / stats.totalNotes) * 100).toFixed(1)
  }

  const handleCEPSearch = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '')
    if (cleanCEP.length !== 8) return

    try {
      setIsLoadingCEP(true)
      const data = await searchCEP(cep)
      
      setValue('address.street', data.logradouro)
      setValue('address.neighborhood', data.bairro)
      setValue('address.city', data.localidade)
      setValue('address.state', data.uf)
      
      // Foca no campo número após preencher o endereço
      const numberInput = document.querySelector('input[name="address.number"]')
      if (numberInput) {
        (numberInput as HTMLInputElement).focus()
      }
    } catch (error) {
      toast.error('Erro ao buscar CEP')
    } finally {
      setIsLoadingCEP(false)
    }
  }

  return (
    <Box p={8} maxW="1200px" mx="auto">
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
        {/* Coluna da Esquerda - Informações do Perfil */}
        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <VStack spacing={6} align="center">
              <Box position="relative" cursor="pointer" onClick={handleAvatarClick}>
                <Avatar
                  size="2xl"
                  name={userName}
                  src={user?.avatarUrl}
                  bg="brand.primary"
                  color="white"
                />
                <Tooltip label="Alterar foto">
                  <IconButton
                    aria-label="Alterar foto"
                    icon={<Camera weight="bold" />}
                    position="absolute"
                    bottom="0"
                    right="0"
                    rounded="full"
                    colorScheme="brand"
                    size="sm"
                  />
                </Tooltip>
              </Box>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <VStack spacing={1}>
                <Heading size="md">{userName}</Heading>
                <Text color="gray.500" fontSize="sm">{user?.email}</Text>
                <Badge colorScheme="green">Conta Gratuita</Badge>
              </VStack>

              {user?.bio && (
                <Box w="100%">
                  <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={1}>
                    Sobre mim
                  </Text>
                  <Text fontSize="sm" whiteSpace="pre-wrap">
                    {user.bio}
                  </Text>
                </Box>
              )}

              <Button
                leftIcon={<PencilSimple />}
                variant="outline"
                size="sm"
                onClick={onOpen}
                w="full"
              >
                Editar Perfil
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* Nova seção de Estatísticas */}
        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px" gridColumn={{ base: "1", lg: "2 / span 2" }}>
          <CardBody>
            <VStack align="stretch" spacing={6}>
              <Flex justify="space-between" align="center">
                <Heading size="md" display="flex" alignItems="center" gap={2}>
                  <ChartLine weight="bold" />
                  Estatísticas
                </Heading>
                <Badge variant="subtle" colorScheme="green">Últimos 30 dias</Badge>
              </Flex>

              {statsLoading ? (
                <Flex justify="center" py={8}>
                  <Spinner size="xl" color="brand.primary" />
                </Flex>
              ) : (
                <>
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                    <Stat>
                      <StatLabel color="gray.500">Total de Notas</StatLabel>
                      <StatNumber display="flex" alignItems="center" gap={2}>
                        <Note weight="bold" />
                        {stats?.totalNotes || 0}
                      </StatNumber>
                      <StatHelpText>
                        <StatArrow type={stats?.notesGrowth && stats.notesGrowth > 0 ? "increase" : "decrease"} />
                        {stats?.notesGrowth?.toFixed(1) || 0}% este mês
                      </StatHelpText>
                    </Stat>

                    <Stat>
                      <StatLabel color="gray.500">Notas Favoritas</StatLabel>
                      <StatNumber display="flex" alignItems="center" gap={2}>
                        <Star weight="bold" />
                        {stats?.favoriteNotes || 0}
                      </StatNumber>
                      <StatHelpText>
                        {calculateFavoritePercentage()}% do total
                      </StatHelpText>
                    </Stat>

                    <Stat>
                      <StatLabel color="gray.500">Tags Criadas</StatLabel>
                      <StatNumber display="flex" alignItems="center" gap={2}>
                        <TagIcon weight="bold" />
                        {stats?.tags || 0}
                      </StatNumber>
                      <StatHelpText>
                        Média de {stats ? (stats.totalNotes / stats.tags).toFixed(1) : 0} notas/tag
                      </StatHelpText>
                    </Stat>

                    <Stat>
                      <StatLabel color="gray.500">Última Semana</StatLabel>
                      <StatNumber display="flex" alignItems="center" gap={2}>
                        <Clock weight="bold" />
                        {stats?.lastWeekNotes || 0}
                      </StatNumber>
                      <StatHelpText>
                        Novas notas criadas
                      </StatHelpText>
                    </Stat>
                  </SimpleGrid>

                  <Divider />

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Box>
                      <Heading size="sm" mb={4}>Uso do Armazenamento</Heading>
                      <HStack spacing={6} align="center">
                        <CircularProgress 
                          value={stats?.storageUsed || 0} 
                          color="brand.primary"
                          size="100px"
                        >
                          <CircularProgressLabel>
                            {stats?.storageUsed?.toFixed(1) || 0}%
                          </CircularProgressLabel>
                        </CircularProgress>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium">
                            {stats ? formatBytes(stats.storageDetails.used) : '0 B'} de{' '}
                            {stats ? formatBytes(stats.storageDetails.total) : '0 B'}
                          </Text>
                          <Text fontSize="sm" color="gray.500">Espaço utilizado</Text>
                          <Button size="sm" leftIcon={<ArrowUp />} variant="outline" colorScheme="brand">
                            Aumentar Plano
                          </Button>
                        </VStack>
                      </HStack>
                    </Box>

                    <Box>
                      <Heading size="sm" mb={4}>Tags Mais Usadas</Heading>
                      <Wrap spacing={2}>
                        {stats?.topTags.map((tag) => (
                          <WrapItem key={tag.name}>
                            <Badge 
                              colorScheme="brand" 
                              variant="subtle" 
                              px={3} 
                              py={1} 
                              borderRadius="full"
                            >
                              {tag.name} ({tag.count})
                            </Badge>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Box>
                  </SimpleGrid>
                </>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Card das Configurações */}
        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px" gridColumn={{ base: "1", lg: "1 / span 3" }}>
          <CardBody>
            <Tabs variant="soft-rounded">
              <TabList mb={4} bg={tabBg} p={2} borderRadius="lg">
                <Tab gap={2}><User /> Perfil</Tab>
                <Tab gap={2}><Shield /> Segurança</Tab>
                <Tab gap={2}><Bell /> Notificações</Tab>
                <Tab gap={2}><Gear /> Preferências</Tab>
              </TabList>

              <TabPanels>
                {/* Painel de Perfil */}
                <TabPanel>
                  <VStack align="stretch" spacing={6}>
                    <Box>
                      <Heading size="sm" mb={4}>Informações Pessoais</Heading>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box>
                          <Text fontWeight="medium" fontSize="sm" color="gray.500">Nome</Text>
                          <Text>{user?.name}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" fontSize="sm" color="gray.500">Email</Text>
                          <Text>{user?.email}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" fontSize="sm" color="gray.500">Profissão</Text>
                          <Text>{user?.profession || 'Não informado'}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" fontSize="sm" color="gray.500">Telefone</Text>
                          <Text>{user?.phone || 'Não informado'}</Text>
                        </Box>
                      </SimpleGrid>
                    </Box>

                    <Divider />

                    <Box>
                      <Heading size="sm" mb={4}>Endereço</Heading>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box>
                          <Text fontWeight="medium" fontSize="sm" color="gray.500">CEP</Text>
                          <Text>{user?.address?.zipCode || 'Não informado'}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" fontSize="sm" color="gray.500">Cidade/Estado</Text>
                          <Text>
                            {user?.address?.city && user?.address?.state 
                              ? `${user.address.city}/${user.address.state}`
                              : 'Não informado'}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" fontSize="sm" color="gray.500">Endereço</Text>
                          <Text>
                            {user?.address?.street && user?.address?.number
                              ? `${user.address.street}, ${user.address.number}`
                              : 'Não informado'}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" fontSize="sm" color="gray.500">Complemento</Text>
                          <Text>{user?.address?.complement || 'Não informado'}</Text>
                        </Box>
                      </SimpleGrid>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Painel de Segurança */}
                <TabPanel>
                  <VStack align="stretch" spacing={6}>
                    <Box>
                      <Heading size="sm" mb={4}>Segurança da Conta</Heading>
                      <VStack align="stretch" spacing={4}>
                        <HStack justify="space-between">
                          <Box>
                            <Text fontWeight="medium">Autenticação em duas etapas</Text>
                            <Text fontSize="sm" color="gray.500">
                              Adicione uma camada extra de segurança à sua conta
                            </Text>
                          </Box>
                          <Switch colorScheme="brand" />
                        </HStack>
                        <Button leftIcon={<Key />} variant="outline">
                          Alterar Senha
                        </Button>
                      </VStack>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Painel de Notificações */}
                <TabPanel>
                  <VStack align="stretch" spacing={6}>
                    <Box>
                      <Heading size="sm" mb={4}>Preferências de Notificação</Heading>
                      <VStack align="stretch" spacing={4}>
                        <HStack justify="space-between">
                          <Box>
                            <Text fontWeight="medium">Notificações por email</Text>
                            <Text fontSize="sm" color="gray.500">
                              Receba atualizações importantes por email
                            </Text>
                          </Box>
                          <Switch colorScheme="brand" defaultChecked />
                        </HStack>
                        <HStack justify="space-between">
                          <Box>
                            <Text fontWeight="medium">Lembretes</Text>
                            <Text fontSize="sm" color="gray.500">
                              Receba lembretes sobre suas notas
                            </Text>
                          </Box>
                          <Switch colorScheme="brand" defaultChecked />
                        </HStack>
                      </VStack>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Painel de Preferências */}
                <TabPanel>
                  <VStack align="stretch" spacing={6}>
                    <Box>
                      <Heading size="sm" mb={4}>Preferências do Sistema</Heading>
                      <VStack align="stretch" spacing={4}>
                        <HStack justify="space-between">
                          <Box>
                            <Text fontWeight="medium">Modo escuro automático</Text>
                            <Text fontSize="sm" color="gray.500">
                              Alterne automaticamente entre temas claro e escuro
                            </Text>
                          </Box>
                          <Switch colorScheme="brand" />
                        </HStack>
                        <HStack justify="space-between">
                          <Box>
                            <Text fontWeight="medium">Salvar rascunhos automaticamente</Text>
                            <Text fontSize="sm" color="gray.500">
                              Salve suas notas automaticamente enquanto escreve
                            </Text>
                          </Box>
                          <Switch colorScheme="brand" defaultChecked />
                        </HStack>
                      </VStack>
                    </Box>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Modal de Edição */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Perfil</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack 
              as="form" 
              spacing={4} 
              pb={6}
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormControl isInvalid={!!errors.bio}>
                <FormLabel>Sobre mim</FormLabel>
                <VStack align="stretch" spacing={1}>
                  <Textarea
                    placeholder="Conte um pouco sobre você..."
                    {...register('bio', {
                      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setBioLength(e.target.value.length)
                    })}
                    resize="vertical"
                    minH="100px"
                    maxH="200px"
                    maxLength={255}
                  />
                  <Flex justify="flex-end">
                    <Text 
                      fontSize="sm" 
                      color={bioLength > 230 ? "red.500" : "gray.500"}
                    >
                      {bioLength}/255
                    </Text>
                  </Flex>
                  <FormErrorMessage>{errors.bio?.message}</FormErrorMessage>
                </VStack>
              </FormControl>

              <Divider />

              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Nome</FormLabel>
                <Input {...register('name')} />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Profissão</FormLabel>
                <Input {...register('profession')} />
              </FormControl>

              <FormControl>
                <FormLabel>País do Telefone</FormLabel>
                <Select
                  value={phoneCountry}
                  onChange={(e) => setPhoneCountry(e.target.value)}
                >
                  <option value="BR">Brasil (+55)</option>
                  <option value="US">Estados Unidos (+1)</option>
                  {/* Adicione mais países conforme necessário */}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Telefone</FormLabel>
                <MaskedInput
                  control={control}
                  name="phone"
                  mask={phoneCountry === 'BR' ? '(99) 99999-9999' : '(999) 999-9999'}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Data de Nascimento</FormLabel>
                <Input type="date" {...register('birthDate')} />
              </FormControl>

              <Heading size="sm" alignSelf="flex-start" mt={4}>Endereço</Heading>

              <SimpleGrid columns={2} spacing={4} w="100%">
                <FormControl>
                  <FormLabel>CEP</FormLabel>
                  <InputGroup>
                    <MaskedInput
                      control={control}
                      name="address.zipCode"
                      mask="99999-999"
                      onBlur={(e) => handleCEPSearch(e.target.value)}
                    />
                    {isLoadingCEP && (
                      <InputRightElement>
                        <Spinner size="sm" color="brand.primary" />
                      </InputRightElement>
                    )}
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Estado</FormLabel>
                  <Input {...register('address.state')} readOnly />
                </FormControl>

                <FormControl>
                  <FormLabel>Cidade</FormLabel>
                  <Input {...register('address.city')} readOnly />
                </FormControl>

                <FormControl>
                  <FormLabel>Bairro</FormLabel>
                  <Input {...register('address.neighborhood')} readOnly />
                </FormControl>

                <FormControl>
                  <FormLabel>Rua</FormLabel>
                  <Input {...register('address.street')} readOnly />
                </FormControl>

                <FormControl>
                  <FormLabel>Número</FormLabel>
                  <Input {...register('address.number')} />
                </FormControl>

                <FormControl gridColumn="span 2">
                  <FormLabel>Complemento</FormLabel>
                  <Input {...register('address.complement')} />
                </FormControl>
              </SimpleGrid>

              <Button
                type="submit"
                colorScheme="brand"
                w="100%"
                mt={4}
                isLoading={isUpdating}
              >
                Salvar Alterações
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
} 