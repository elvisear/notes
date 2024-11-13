import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  VStack,
} from '@chakra-ui/react'
import { parsePhoneNumberFromString, AsYouType, CountryCode } from 'libphonenumber-js'
import { useState, useEffect } from 'react'
import countryList from 'react-select-country-list'

interface PhoneInputProps {
  value: string
  onChange: (value: string, isValid: boolean) => void
  country: string
  onCountryChange: (country: string) => void
  label?: string
}

export function PhoneInput({ value, onChange, country, onCountryChange, label = "Telefone" }: PhoneInputProps) {
  const [formattedValue, setFormattedValue] = useState('')
  const countries = countryList().getData()

  useEffect(() => {
    const asYouType = new AsYouType(country as CountryCode)
    setFormattedValue(asYouType.input(value))
  }, [value, country])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '')
    const phoneNumber = parsePhoneNumberFromString(newValue, country as CountryCode)
    const isValid = phoneNumber?.isValid() || false
    onChange(newValue, isValid)
  }

  const getPlaceholder = () => {
    switch (country) {
      case 'BR':
        return '(XX) X XXXX-XXXX'
      case 'US':
        return '(XXX) XXX-XXXX'
      case 'PT':
        return 'XXX XXX XXX'
      default:
        return 'Digite seu telefone'
    }
  }

  const getExample = () => {
    switch (country) {
      case 'BR':
        return '+55 (11) 9 9999-9999'
      case 'US':
        return '+1 (555) 123-4567'
      case 'PT':
        return '+351 123 456 789'
      default:
        return ''
    }
  }

  return (
    <VStack align="stretch" spacing={2}>
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <InputGroup>
          <InputLeftAddon>
            <Select
              value={country}
              onChange={(e) => onCountryChange(e.target.value)}
              variant="unstyled"
              w="auto"
            >
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.value} ({country.label})
                </option>
              ))}
            </Select>
          </InputLeftAddon>
          <Input
            value={formattedValue}
            onChange={handlePhoneChange}
            placeholder={getPlaceholder()}
            title={`Exemplo: ${getExample()}`}
          />
        </InputGroup>
      </FormControl>
    </VStack>
  )
} 