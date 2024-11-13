export function formatPhoneNumber(phone: string, country: string = 'BR'): string {
  const cleaned = phone.replace(/\D/g, '')
  
  switch (country) {
    case 'BR':
      if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
      } else if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
      }
      break
    case 'US':
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
      }
      break
    // Adicione mais países conforme necessário
  }
  
  return phone
} 