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
  Divider,
  Card,
  CardBody
} from '@chakra-ui/react'
import { useState } from 'react'
import { useTags } from '../contexts/TagsContext'
import { useNotes } from '../contexts/NotesContext'
import { 
  Pencil, 
  Trash, 
  Plus, 
  CaretDown,
  Tag as TagIcon,
  Note
} from 'phosphor-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

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
  { name: 'Laranja', value: '#FE7028' },
  { name: 'Rosa', value: '#FF69B4' },
  { name: 'Marrom', value: '#8B4513' }
]

interface Tag {
  id: string
  name: string
  color: string
  notesCount: number
}

export function Tags() {
  const { tags, createTag, deleteTag, updateTag } = useTags()
  const { notes } = useNotes()
  const navigate = useNavigate()
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
    const notesWithTag = notes.filter(note => note.tags.includes(tagId))

    toast.custom((t) => (
      <Card p={4} bg={bgColor} boxShadow="lg">
        <CardBody>
          <VStack align="stretch" spacing={4}>
            <Text>
              Tem certeza que deseja excluir a tag "{tagName}"?
            </Text>
            
            {notesWithTag.length > 0 && (
              <Box>
                <Text color="red.500" fontWeight="medium" mb={2}>
                  Esta tag está sendo usada em {notesWithTag.length} {notesWithTag.length === 1 ? 'nota' : 'notas'}:
                </Text>
                <VStack align="stretch" maxH="100px" overflowY="auto" spacing={1}>
                  {notesWithTag.map(note => (
                    <Text key={note.id} fontSize="sm" color="gray.500" noOfLines={1}>
                      • {note.title}
                    </Text>
                  ))}
                </VStack>
              </Box>
            )}

            <HStack justify="flex-end" spacing={2}>
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
          </VStack>
        </CardBody>
      </Card>
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

  const handleViewNotes = (tagId: string) => {
    navigate(`/notes?tag=${tagId}`)
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
              <HStack flex={1}>
                <Box w={4} h={4} borderRadius="full" bg={tag.color} />
                <Text>{tag.name}</Text>
                <Text color="gray.500" fontSize="sm">
                  ({tag.notesCount} {tag.notesCount === 1 ? 'nota' : 'notas'})
                </Text>
              </HStack>

              <HStack>
                <Tooltip label="Ver notas">
                  <IconButton
                    aria-label="Ver notas"
                    icon={<Note />}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewNotes(tag.id)}
                    isDisabled={tag.notesCount === 0}
                  />
                </Tooltip>
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