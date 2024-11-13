import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Grid,
  Avatar,
  Box,
  Button,
  VStack,
  Image,
  useToast
} from '@chakra-ui/react'
import { useRef, useState } from 'react'

interface AvatarSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (avatarUrl: string) => void
  currentAvatar?: string
}

const DEFAULT_AVATARS = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  // Adicione mais avatares padrão aqui
]

export function AvatarSelector({ isOpen, onClose, onSelect, currentAvatar }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'Arquivo muito grande',
          description: 'O tamanho máximo permitido é 5MB',
          status: 'error',
          duration: 3000,
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setUploadedImage(result)
        setSelectedAvatar(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleConfirm = () => {
    if (selectedAvatar) {
      onSelect(selectedAvatar)
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Escolha seu avatar</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6}>
            <Box>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                Fazer upload de foto
              </Button>
            </Box>

            {uploadedImage && (
              <Box>
                <Image
                  src={uploadedImage}
                  alt="Uploaded avatar"
                  boxSize="100px"
                  objectFit="cover"
                  borderRadius="full"
                  cursor="pointer"
                  onClick={() => setSelectedAvatar(uploadedImage)}
                  border={selectedAvatar === uploadedImage ? '2px solid' : 'none'}
                  borderColor="brand.primary"
                />
              </Box>
            )}

            <Grid templateColumns="repeat(4, 1fr)" gap={4}>
              {DEFAULT_AVATARS.map((avatar, index) => (
                <Avatar
                  key={index}
                  src={avatar}
                  size="xl"
                  cursor="pointer"
                  onClick={() => setSelectedAvatar(avatar)}
                  border={selectedAvatar === avatar ? '2px solid' : 'none'}
                  borderColor="brand.primary"
                />
              ))}
            </Grid>

            <Button colorScheme="brand" onClick={handleConfirm}>
              Confirmar
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
} 