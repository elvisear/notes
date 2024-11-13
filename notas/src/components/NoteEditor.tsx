import {
  Box,
  Input,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Button,
  Text,
  useBreakpointValue,
  Flex,
  Tooltip,
  Tag,
  TagLabel,
  TagCloseButton,
  Portal,
  useColorModeValue
} from '@chakra-ui/react'
import {
  Star,
  Clock,
  CaretDown,
  Trash,
  FunnelSimple,
  X,
  PushPin
} from 'phosphor-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { RichTextEditor } from './RichTextEditor'
import { useState, useEffect, useRef} from 'react'
import { toast } from 'sonner'
import { useTags } from '../contexts/TagsContext'
import { useNavigate } from 'react-router-dom'
import { TagInputWithSuggestions } from './TagInputWithSuggestions'
import { usePinnedTags } from '../contexts/PinnedTagsContext'

interface NoteEditorProps {
  id: string
  title: string
  content: string
  notebook: string
  lastUpdated?: Date
  isFavorite?: boolean
  onTitleChange: (title: string) => void
  onContentChange: (content: string) => void
  onNotebookChange: (notebook: string) => void
  onToggleFavorite: () => void
  onShare?: () => void
  notebooks: string[]
  onDelete: () => void
  onTagsChange: (tags: string[]) => void
  tags: string[]
  sidebarWidth: string
}

export function NoteEditor({
  id,
  title,
  content,
  notebook,
  lastUpdated,
  isFavorite,
  onTitleChange,
  onContentChange,
  onNotebookChange,
  onToggleFavorite,
  notebooks,
  onDelete,
  onTagsChange,
  tags,
  sidebarWidth
}: NoteEditorProps) {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [localTitle, setLocalTitle] = useState(title)
  const [localContent, setLocalContent] = useState(content)
  const [isAddingTag] = useState(false)
  const tagInputRef = useRef<HTMLInputElement>(null)
  const { getTagById, removeTagFromNote, removeTagFromAllNotes } = useTags()
  const navigate = useNavigate()
  const { isPinned, addPinnedTag, removePinnedTag } = usePinnedTags()

  const bg = useColorModeValue('white', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.900', 'white')

  const headerBg = useColorModeValue('white', 'gray.800')
  const titleBg = useColorModeValue('white', 'gray.800')
  const footerBg = useColorModeValue('white', 'gray.800')

  useEffect(() => {
    setLocalTitle(title)
    setLocalContent(content)
  }, [id, title, content])

  const handleTitleBlur = () => {
    if (localTitle !== title) {
      onTitleChange(localTitle)
    }
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTitleBlur()
    }
  }

  const handleDelete = () => {
    toast.custom((t) => (
      <Box
        p={4}
        bg="white"
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
              onDelete()
              toast.dismiss(t)
            }}
          >
            Excluir
          </Button>
        </HStack>
      </Box>
    ))
  }

  const handleRemoveTag = (tagId: string) => {
    try {
      const updatedTags = tags.filter(t => t !== tagId)
      onTagsChange(updatedTags)
      removeTagFromNote(id, tagId)
    } catch (error) {
      console.error('Erro ao remover tag:', error)
      toast.error('Erro ao remover tag')
    }
  }

  useEffect(() => {
    if (isAddingTag && tagInputRef.current) {
      tagInputRef.current.focus()
    }
  }, [isAddingTag])

  const renderTagWithMenu = (tagId: string) => {
    const tag = getTagById(tagId)
    if (!tag) return null

    const isTagPinned = isPinned(tagId)

    return (
      <Tag
        key={tag.id}
        size="sm"
        borderRadius="full"
        variant="subtle"
        bgColor={`${tag.color}20`}
        color={tag.color}
      >
        <TagLabel>{tag.name}</TagLabel>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Opções da tag"
            icon={<CaretDown />}
            variant="unstyled"
            size="xs"
            height="auto"
            minWidth="auto"
            padding={0}
            marginLeft={1}
            marginRight={1}
            color={tag.color}
            _hover={{ opacity: 0.8 }}
          />
          <Portal>
            <MenuList>
              <MenuItem
                icon={<FunnelSimple />}
                onClick={() => {
                  navigate(`/notes?tag=${tag.id}`)
                }}
              >
                Filtrar por etiqueta
              </MenuItem>
              <MenuItem
                icon={<X />}
                onClick={() => {
                  handleRemoveTag(tag.id)
                }}
              >
                Remover etiqueta
              </MenuItem>
              <MenuItem
                icon={<X />}
                onClick={() => {
                  removeTagFromAllNotes(tag.id)
                  toast.success('Etiqueta removida de todas as notas')
                }}
              >
                Remover etiqueta de todas as notas...
              </MenuItem>
              <MenuItem
                icon={<PushPin />}
                onClick={() => {
                  if (isTagPinned) {
                    removePinnedTag(tag.id)
                    toast.success('Tag removida dos atalhos')
                  } else {
                    addPinnedTag(tag.id)
                    toast.success('Tag adicionada aos atalhos')
                  }
                }}
              >
                {isTagPinned ? 'Remover dos Atalhos' : 'Adicionar aos Atalhos'}
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
        <TagCloseButton
          onClick={() => handleRemoveTag(tag.id)}
        />
      </Tag>
    )
  }

  return (
    <Box h="100vh" position="relative" bg={bg}>
      {/* Header Fixo */}
      <Box 
        position="fixed"
        top={0}
        left={`calc(${sidebarWidth} + 360px)`}
        right={0}
        bg={headerBg}
        borderBottom="1px"
        borderColor={borderColor}
        zIndex={10}
        color={textColor}
        transition="left 0.2s"
      >
        {/* Menu e Ferramentas */}
        <Box p={2}>
          <Flex 
            direction={isMobile ? "column" : "row"} 
            justify="space-between"
            gap={2}
          >
            <HStack spacing={2}>
              <Menu>
                <MenuButton 
                  as={Button}
                  rightIcon={<CaretDown />}
                  variant="ghost"
                  size="sm"
                >
                  {notebook || 'Geral'}
                </MenuButton>
                <MenuList>
                  {notebooks.map(nb => (
                    <MenuItem 
                      key={nb}
                      onClick={() => onNotebookChange(nb)}
                    >
                      {nb}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <Divider orientation="vertical" h="20px" />
              <HStack spacing={1}>
                <Tooltip label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
                  <IconButton
                    aria-label="Favoritar"
                    icon={<Star weight={isFavorite ? "fill" : "regular"} />}
                    variant="ghost"
                    size="sm"
                    onClick={onToggleFavorite}
                    color={isFavorite ? "brand.primary" : "gray.500"}
                    _hover={{
                      color: "brand.primary",
                      transform: "scale(1.1)",
                      bg: useColorModeValue('orange.50', 'whiteAlpha.200')
                    }}
                    _active={{
                      transform: "scale(0.95)",
                    }}
                    transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                  />
                </Tooltip>
                <Tooltip label="Excluir nota">
                  <IconButton
                    aria-label="Excluir nota"
                    icon={<Trash />}
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    color="gray.500"
                    _hover={{
                      color: "red.500",
                      transform: "scale(1.1)",
                      bg: useColorModeValue('red.50', 'whiteAlpha.200')
                    }}
                    _active={{
                      transform: "scale(0.95)",
                    }}
                    transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                  />
                </Tooltip>
              </HStack>
            </HStack>

            {lastUpdated && (
              <HStack spacing={2} color="gray.500" fontSize="sm">
                <Clock />
                <Text>
                  {format(lastUpdated, isMobile ? "dd/MM/yy HH:mm" : "dd 'de' MMMM 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </Text>
              </HStack>
            )}
          </Flex>
        </Box>

        {/* Título Fixo */}
        <Box p={4} bg={titleBg}>
          <Input
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            variant="unstyled"
            fontSize="2xl"
            fontWeight="bold"
            placeholder="Título da nota"
            _placeholder={{ 
              color: 'gray.400',
              fontStyle: 'italic'
            }}
            color={textColor}
          />
        </Box>
      </Box>

      {/* Área de Conteúdo Rolável */}
      <Box
        position="fixed"
        top="120px"
        bottom="60px"
        left={`calc(${sidebarWidth} + 360px)`}
        right={0}
        overflowY="auto"
        px={4}
        transition="left 0.2s"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#4A5568',
            borderRadius: '24px',
          },
        }}
      >
        <Box key={`editor-${id}`}>
          <RichTextEditor
            key={`content-${id}`}
            content={localContent}
            onChange={(newContent) => {
              setLocalContent(newContent)
              onContentChange(newContent)
            }}
          />
        </Box>
      </Box>

      {/* Footer Fixo */}
      <Box
        position="fixed"
        bottom={0}
        left={`calc(${sidebarWidth} + 360px)`}
        right={0}
        borderTop="1px"
        borderColor={borderColor}
        bg={footerBg}
        p={2}
        zIndex={10}
        transition="left 0.2s"
      >
        <Flex align="center">
          <HStack spacing={2} flex={1} flexWrap="wrap">
            {tags.map(tagId => renderTagWithMenu(tagId))}
            <TagInputWithSuggestions
              onTagCreate={(tagId) => {
                const updatedTags = [...tags, tagId]
                onTagsChange(updatedTags)
              }}
              existingTags={tags}
            />
          </HStack>
        </Flex>
      </Box>
    </Box>
  )
} 