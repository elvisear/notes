import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Input,
  Button,
  useColorModeValue,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Divider
} from '@chakra-ui/react'
import { useState } from 'react'
import { useTags } from '../contexts/TagsContext'
import { useNotes } from '../contexts/NotesContext'
import { 
  Pencil, 
  Trash, 
  Plus,
  CaretDown,
  Tag as TagIcon
} from 'phosphor-react'
import { toast } from 'sonner'

interface Tag {
  id: string
  name: string
  color: string
  notesCount: number
}

interface ColorOption {
  name: string
  value: string
}

const colorOptions: ColorOption[] = [
  { name: 'Vermelho', value: '#FF6B6B' },
  { name: 'Verde', value: '#4ECDC4' },
  { name: 'Azul', value: '#45B7D1' },
  { name: 'Roxo', value: '#9B59B6' },
  { name: 'Amarelo', value: '#F1C40F' },
  // ... outras cores
]

export function TagsManager() {
  const { tags, createTag, deleteTag, updateTag } = useTags()
  const { notes } = useNotes()
  const [newTagName, setNewTagName] = useState('')
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700')

  const handleCreateTag = () => {
    if (!newTagName.trim()) return

    try {
      createTag(newTagName, selectedColor)
      setNewTagName('')
      toast.success('Tag criada com sucesso!')
    } catch (error) {
      toast.error('Erro ao criar tag')
    }
  }

  const handleDeleteTag = (tagId: string, tagName: string) => {
    toast.custom((t) => (
      <Box p={4} bg={bgColor} borderRadius="md" boxShadow="lg">
        <Text mb={4}>
          Tem certeza que deseja excluir a tag "{tagName}"?
          {notes.some(note => note.tags.includes(tagId)) && (
            <Text color="red.500" mt={2} fontSize="sm">
              Esta tag está sendo usada em algumas notas.
            </Text>
          )}
        </Text>
        <HStack spacing={2} justify="flex-end">
          <Button size="sm" variant="ghost" onClick={() => toast.dismiss(t)}>
            Cancelar
          </Button>
          <Button
            size="sm"
            colorScheme="red"
            onClick={() => {
              deleteTag(tagId)
              toast.dismiss(t)
              toast.success('Tag excluída com sucesso!')
            }}
          >
            Excluir
          </Button>
        </HStack>
      </Box>
    ))
  }

  const handleUpdateTag = () => {
    if (!editingTag || !editingTag.name.trim()) return

    try {
      updateTag(editingTag.id, editingTag)
      setEditingTag(null)
      onClose()
      toast.success('Tag atualizada com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar tag')
    }
  }

  return (
    <Box maxW="800px" mx="auto" p={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <HStack>
            <TagIcon size={24} />
            <Text fontSize="2xl" fontWeight="bold">Gerenciar Tags</Text>
          </HStack>
          <Text color="gray.500">
            {tags.length} {tags.length === 1 ? 'tag' : 'tags'}
          </Text>
        </Flex>

        {/* Nova Tag */}
        <HStack spacing={4}>
          <Input
            placeholder="Nome da nova tag"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
          />
          <Menu>
            <MenuButton as={Button} rightIcon={<CaretDown />}>
              <Box w={4} h={4} borderRadius="full" bg={selectedColor} mr={2} />
              Cor
            </MenuButton>
            <MenuList>
              {colorOptions.map(color => (
                <MenuItem
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                >
                  <HStack>
                    <Box w={4} h={4} borderRadius="full" bg={color.value} />
                    <Text>{color.name}</Text>
                  </HStack>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Button
            leftIcon={<Plus />}
            colorScheme="brand"
            onClick={handleCreateTag}
            isDisabled={!newTagName.trim()}
          >
            Criar Tag
          </Button>
        </HStack>

        <Divider />

        {/* Lista de Tags */}
        <VStack spacing={2} align="stretch">
          {tags.map(tag => (
            <Flex
              key={tag.id}
              p={4}
              bg={bgColor}
              borderRadius="md"
              border="1px"
              borderColor={borderColor}
              justify="space-between"
              align="center"
              _hover={{ bg: hoverBgColor }}
            >
              <HStack>
                <Box w={4} h={4} borderRadius="full" bg={tag.color} />
                <Text>{tag.name}</Text>
                <Text color="gray.500" fontSize="sm">
                  ({tag.notesCount} {tag.notesCount === 1 ? 'nota' : 'notas'})
                </Text>
              </HStack>

              <HStack>
                <Tooltip label="Editar">
                  <IconButton
                    aria-label="Editar tag"
                    icon={<Pencil />}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingTag(tag)
                      onOpen()
                    }}
                  />
                </Tooltip>
                <Tooltip label="Excluir">
                  <IconButton
                    aria-label="Excluir tag"
                    icon={<Trash />}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTag(tag.id, tag.name)}
                  />
                </Tooltip>
              </HStack>
            </Flex>
          ))}
        </VStack>
      </VStack>

      {/* Modal de Edição */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Tag</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Nome</FormLabel>
                <Input
                  value={editingTag?.name || ''}
                  onChange={(e) => setEditingTag(prev => 
                    prev ? { ...prev, name: e.target.value } : null
                  )}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Cor</FormLabel>
                <Menu>
                  <MenuButton as={Button} rightIcon={<CaretDown />}>
                    <Box 
                      w={4} 
                      h={4} 
                      borderRadius="full" 
                      bg={editingTag?.color} 
                      mr={2} 
                    />
                    Cor
                  </MenuButton>
                  <MenuList>
                    {colorOptions.map(color => (
                      <MenuItem
                        key={color.value}
                        onClick={() => setEditingTag(prev => 
                          prev ? { ...prev, color: color.value } : null
                        )}
                      >
                        <HStack>
                          <Box w={4} h={4} borderRadius="full" bg={color.value} />
                          <Text>{color.name}</Text>
                        </HStack>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="brand" onClick={handleUpdateTag}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
} 