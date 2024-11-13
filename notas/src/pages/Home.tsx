import { 
  Box, 
  VStack, 
  Text, 
  Icon, 
  Button,
  HStack,
  useColorModeValue 
} from '@chakra-ui/react'
import { NotePencil, Plus } from 'phosphor-react'
import { useNavigate } from 'react-router-dom'

export function Home() {
  const navigate = useNavigate()
  const textColor = useColorModeValue('gray.600', 'gray.400')

  return (
    <Box h="100vh" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={6}>
        <Icon as={NotePencil} fontSize="64px" color={textColor} />
        <Text color={textColor} fontSize="lg">
          Selecione uma nota ou crie uma nova
        </Text>
        <Button
          w="100%"
          bg="brand.primary"
          color="white"
          p={2}
          borderRadius="md"
          _hover={{ bg: 'brand.primary', opacity: 0.9 }}
          onClick={() => navigate('/new')}
        >
          <HStack spacing={2}>
            <Plus weight="bold" />
            <Text>Nova Nota</Text>
          </HStack>
        </Button>
      </VStack>
    </Box>
  )
} 