import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Grid,
  GridItem
} from '@chakra-ui/react'
import { useState } from 'react'
import axios from 'axios'
import { formatCEP } from '@brazilian-utils/brazilian-utils'

interface AddressFormProps {
  onAddressChange: (address: Address) => void
  initialAddress?: Address
  country: string
}

interface Address {
  zipCode: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  country: string
}

export function AddressForm({ onAddressChange, initialAddress, country }: AddressFormProps) {
  const [address, setAddress] = useState<Address>(initialAddress || {
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    country: country
  })
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleZipCodeSearch = async () => {
    if (!address.zipCode) return

    setIsLoading(true)
    try {
      if (country === 'BR') {
        const formattedCEP = address.zipCode.replace(/\D/g, '')
        const response = await axios.get(`https://viacep.com.br/ws/${formattedCEP}/json/`)
        const data = response.data

        if (data.erro) {
          toast({
            title: 'CEP não encontrado',
            status: 'error',
            duration: 3000,
          })
          return
        }

        setAddress(prev => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
        }))
      }
      // Adicione mais APIs de CEP para outros países aqui
    } catch (error) {
      toast({
        title: 'Erro ao buscar endereço',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof Address) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    const newAddress = { ...address, [field]: value }
    setAddress(newAddress)
    onAddressChange(newAddress)
  }

  return (
    <VStack spacing={4} align="stretch">
      <Grid templateColumns="repeat(6, 1fr)" gap={4}>
        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>CEP</FormLabel>
            <Input
              value={formatCEP(address.zipCode)}
              onChange={handleChange('zipCode')}
              placeholder="00000-000"
              maxLength={9}
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={1}>
          <Button
            onClick={handleZipCodeSearch}
            isLoading={isLoading}
            mt={8}
          >
            Buscar
          </Button>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(6, 1fr)" gap={4}>
        <GridItem colSpan={4}>
          <FormControl>
            <FormLabel>Rua</FormLabel>
            <Input
              value={address.street}
              onChange={handleChange('street')}
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>Número</FormLabel>
            <Input
              value={address.number}
              onChange={handleChange('number')}
            />
          </FormControl>
        </GridItem>
      </Grid>

      <FormControl>
        <FormLabel>Complemento</FormLabel>
        <Input
          value={address.complement}
          onChange={handleChange('complement')}
        />
      </FormControl>

      <Grid templateColumns="repeat(6, 1fr)" gap={4}>
        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>Bairro</FormLabel>
            <Input
              value={address.neighborhood}
              onChange={handleChange('neighborhood')}
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>Cidade</FormLabel>
            <Input
              value={address.city}
              onChange={handleChange('city')}
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>Estado</FormLabel>
            <Input
              value={address.state}
              onChange={handleChange('state')}
            />
          </FormControl>
        </GridItem>
      </Grid>
    </VStack>
  )
} 