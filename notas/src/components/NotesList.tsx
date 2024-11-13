import {
  Box,
  VStack,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Button,
  Card,
  CardBody,
  Flex,
  Center,
  useColorModeValue,
  Tag,
  TagLabel
} from '@chakra-ui/react'
import {
  MagnifyingGlass,
  Star,
  Trash,
  CaretDown,
  Plus
} from 'phosphor-react'
import { useState, useCallback } from 'react'
import { useNotes } from '../contexts/NotesContext'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useTags } from '../contexts/TagsContext'

interface NotesListProps {
  sidebarWidth?: string;
}

export function NotesList({ sidebarWidth = "240px" }: NotesListProps) {
  const bg = useColorModeValue('white', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.900', 'white')
  const cardBg = useColorModeValue('white', 'gray.800')
  const cardHoverBg = useColorModeValue('gray.50', 'gray.700')
  const selectedCardBg = useColorModeValue('gray.50', 'gray.700')
  const inputBg = useColorModeValue('gray.50', 'gray.800')
  const toastBg = useColorModeValue('white', 'gray.800')

  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { notes, deleteNote, toggleFavorite, notebooks } = useNotes()
  const { getTagById } = useTags()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNotebook, setSelectedNotebook] = useState('Todas as notas')

  const filterType = searchParams.get('filter')
  const tagFilter = searchParams.get('tag')

  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesNotebook = selectedNotebook === 'Todas as notas' || note.notebook === selectedNotebook
      
      const matchesFavorites = filterType === 'favorites' ? note.favorite : true
      
      const matchesTag = tagFilter ? note.tags.includes(tagFilter) : true
      
      return matchesSearch && matchesNotebook && matchesFavorites && matchesTag
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const handleNoteClick = useCallback((noteId: string) => {
    const currentParams = new URLSearchParams(location.search)
    navigate(`/notes/${noteId}${currentParams.toString() ? `?${currentParams.toString()}` : ''}`)
  }, [location.search, navigate])

  const handleToggleFavorite = useCallback((e: React.MouseEvent, noteId: string) => {
    e.stopPropagation()
    toggleFavorite(noteId)
  }, [toggleFavorite])

  const handleDeleteNote = useCallback((e: React.MouseEvent, noteId: string) => {
    e.stopPropagation()
    
    toast.custom((t) => (
      <Box
        p={4}
        bg={toastBg}
        borderRadius="md"
        boxShadow="lg"
      >
        <Text mb={4}>Tem certeza que deseja excluir esta nota?</Text>
        <HStack spacing={2} justify="flex-end">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toast.dismiss(t)}
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            colorScheme="red"
            onClick={() => {
              deleteNote(noteId)
              if (location.pathname === `/notes/${noteId}`) {
                navigate('/notes')
              }
              toast.dismiss(t)
              toast.success('Nota excluída com sucesso!')
            }}
          >
            Excluir
          </Button>
        </HStack>
      </Box>
    ))
  }, [deleteNote, location.pathname, navigate, toastBg])

  return (
    <Box h="100%" bg={bg}>
      {/* Header */}
      <Box p={4} borderBottom="1px" borderColor={borderColor}>
        <Menu>
          <MenuButton
            as={Button}
            w="100%"
            variant="ghost"
            rightIcon={<CaretDown />}
            textAlign="left"
            fontSize="sm"
            fontWeight="medium"
            color={textColor}
          >
            {selectedNotebook}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => setSelectedNotebook('Todas as notas')}>
              Todas as notas
            </MenuItem>
            <Divider />
            {notebooks.map(notebook => (
              <MenuItem 
                key={notebook}
                onClick={() => setSelectedNotebook(notebook)}
              >
                {notebook}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Text fontSize="sm" color="gray.500" mt={2}>
          {filteredNotes.length} {filteredNotes.length === 1 ? 'nota' : 'notas'}
        </Text>
        {/* Search */}
      <Box p={4}>
        <InputGroup size="sm">
          <InputLeftElement>
            <Icon as={MagnifyingGlass} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Buscar notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg={inputBg}
            border="1px"
            borderColor={borderColor}
            _focus={{ borderColor: 'brand.primary' }}
            color={textColor}
          />
        </InputGroup>
      </Box>
      </Box>

      {/* Notes List */}
      <Box
        overflowY="auto"
        maxH="calc(100vh - 120px - 60px)"
        pb="60px"
      >
        <VStack
          spacing={2}
          align="stretch"
          px={4}
          py={3}
        >
          {filteredNotes.length === 0 ? (
            <Center py={8}>
              <Text color="gray.500">
                {tagFilter 
                  ? 'Nenhuma nota encontrada com esta tag'
                  : filterType === 'favorites'
                  ? 'Nenhuma nota favorita encontrada'
                  : 'Nenhuma nota encontrada'}
              </Text>
            </Center>
          ) : (
            filteredNotes.map(note => (
              <Card
                key={note.id}
                onClick={() => handleNoteClick(note.id)}
                cursor="pointer"
                variant="outline"
                bg={location.pathname === `/notes/${note.id}` ? selectedCardBg : cardBg}
                _hover={{ bg: cardHoverBg }}
                position="relative"
                borderColor={borderColor}
              >
                <CardBody py={3} px={4}>
                  <Flex justify="space-between" align="start">
                    <VStack align="stretch" flex={1} spacing={2}>
                      <Text
                        fontWeight="medium"
                        fontSize="sm"
                        color={textColor}
                        noOfLines={1}
                      >
                        {note.title}
                      </Text>

                      <Text
                        fontSize="xs"
                        color="gray.500"
                        noOfLines={2}
                      >
                        {note.content ? note.content.replace(/<[^>]*>/g, '') : ''}
                      </Text>

                      {/* Tags da nota */}
                      {note.tags.length > 0 && (
                        <Flex gap={1} flexWrap="wrap">
                          {note.tags.map(tagId => {
                            const tag = getTagById(tagId)
                            if (!tag) return null
                            return (
                              <Tag
                                key={tag.id}
                                size="sm"
                                variant="subtle"
                                bgColor={`${tag.color}20`}
                                color={tag.color}
                              >
                                <TagLabel fontSize="xs">{tag.name}</TagLabel>
                              </Tag>
                            )
                          })}
                        </Flex>
                      )}

                      <Text fontSize="xs" color="gray.400">
                        {format(new Date(note.createdAt), "dd MMM yyyy", {
                          locale: ptBR,
                        })}
                      </Text>
                    </VStack>

                    <HStack spacing={1}>
                      <IconButton
                        aria-label="Favoritar nota"
                        icon={<Star weight={note.favorite ? "fill" : "regular"} />}
                        size="sm"
                        variant="ghost"
                        color={note.favorite ? "brand.primary" : "gray.400"}
                        onClick={(e) => handleToggleFavorite(e, note.id)}
                        _hover={{
                          color: "brand.primary",
                          transform: "scale(1.1)",
                          bg: useColorModeValue('orange.50', 'whiteAlpha.200')
                        }}
                        _active={{
                          transform: "scale(0.95)",
                        }}
                        transition="all 0.2s"
                      />
                      <IconButton
                        aria-label="Excluir nota"
                        icon={<Trash />}
                        size="sm"
                        variant="ghost"
                        color="gray.400"
                        onClick={(e) => handleDeleteNote(e, note.id)}
                        _hover={{
                          color: "red.500",
                          transform: "scale(1.1)",
                          bg: useColorModeValue('red.50', 'whiteAlpha.200')
                        }}
                        _active={{
                          transform: "scale(0.95)",
                        }}
                        transition="all 0.2s"
                      />
                    </HStack>
                  </Flex>
                </CardBody>
              </Card>
            ))
          )}
        </VStack>
      </Box>

      {/* Footer Fixo */}
      <Box
        position="fixed"
        bottom={0}
        left={sidebarWidth}
        width="360px"
        height="60px"
        borderTop="1px"
        borderColor={borderColor}
        bg={bg}
        p={2}
        zIndex={10}
        transition="left 0.2s"
      >
        <Flex align="center" justify="space-between">
          <Text fontSize="sm" color="gray.500">
            {filteredNotes.length} {filteredNotes.length === 1 ? 'nota' : 'notas'}
          </Text>
          <Button
            size="sm"
            colorScheme="brand"
            leftIcon={<Plus />}
            onClick={() => navigate('/new')}
          >
            Nova Nota
          </Button>
        </Flex>
      </Box>
    </Box>
  )
} 