import axios from 'axios'

interface ViaCEPResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
}

export async function searchCEP(cep: string): Promise<ViaCEPResponse> {
  const cleanCEP = cep.replace(/\D/g, '')
  
  if (cleanCEP.length !== 8) {
    throw new Error('CEP inválido')
  }

  const response = await axios.get(`https://viacep.com.br/ws/${cleanCEP}/json/`)
  
  if (response.data.erro) {
    throw new Error('CEP não encontrado')
  }

  return response.data
} 