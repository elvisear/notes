import {
  Box,
  HStack,
  Tag as ChakraTag,
  TagLabel,
  TagCloseButton,
  Input,
  Text,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useColorModeValue
} from '@chakra-ui/react'
import { useState, useRef, useEffect } from 'react'
import { useTags } from '../contexts/TagsContext'

interface TagManagerProps {
  noteId: string
  onTagsChange?: () => void
}

export function TagManager({ noteId, onTagsChange }: TagManagerProps) {
  const {
    tags: allTags,
    createTag,
    addTagToNote,
    removeTagFromNote,
    getNoteTags,
    searchTags
  } = useTags()

  const [inputValue, setInputValue] = useState('')
  const [searchResults, setSearchResults] = useState<typeof allTags>([])
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const currentTags = getNoteTags(noteId)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700')

  useEffect(() => {
    if (inputValue.trim()) {
      const results = searchTags(inputValue)
      setSearchResults(results.filter(tag => 
        !currentTags.some(ct => ct.id === tag.id)
      ))
      setIsOpen(true)
    } else {
      setSearchResults([])
      setIsOpen(false)
    }
  }, [inputValue, currentTags])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      
      // Se houver resultados de busca, usa a primeira tag encontrada
      if (searchResults.length > 0) {
        addTagToNote(noteId, searchResults[0].id)
      } else {
        // Se não houver resultados, cria uma nova tag
        const newTag = createTag(inputValue)
        addTagToNote(noteId, newTag.id)
      }

      setInputValue('')
      onTagsChange?.()
    }
  }

  const handleRemoveTag = (tagId: string) => {
    removeTagFromNote(noteId, tagId)
    onTagsChange?.()
  }

  const handleSelectTag = (tagId: string) => {
    addTagToNote(noteId, tagId)
    setInputValue('')
    setIsOpen(false)
    onTagsChange?.()
  }

  return (
    <Box>
      <HStack spacing={2} mb={2} flexWrap="wrap">
        {currentTags.map(tag => (
          <ChakraTag
            key={tag.id}
            size="md"
            borderRadius="full"
            variant="subtle"
            bgColor={tag.color + '20'}
            color={tag.color}
          >
            <TagLabel>{tag.name}</TagLabel>
            <TagCloseButton
              onClick={() => handleRemoveTag(tag.id)}
            />
          </ChakraTag>
        ))}
      </HStack>

      <Popover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="bottom-start"
        matchWidth
      >
        <PopoverTrigger>
          <Input
            ref={inputRef}
            placeholder="Adicionar tag..."
            size="sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            bg={bgColor}
            borderColor={borderColor}
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody p={0}>
            <VStack align="stretch" spacing={0}>
              {searchResults.map(tag => (
                <Box
                  key={tag.id}
                  px={4}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: hoverBgColor }}
                  onClick={() => handleSelectTag(tag.id)}
                >
                  <HStack>
                    <Box w={2} h={2} borderRadius="full" bg={tag.color} />
                    <Text fontSize="sm">{tag.name}</Text>
                    <Text fontSize="xs" color="gray.500">
                      ({tag.notesCount} {tag.notesCount === 1 ? 'nota' : 'notas'})
                    </Text>
                  </HStack>
                </Box>
              ))}
              {inputValue.trim() && searchResults.length === 0 && (
                <Box px={4} py={2}>
                  <Text fontSize="sm" color="gray.500">
                    Pressione Enter para criar a tag "{inputValue}"
                  </Text>
                </Box>
              )}
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  )
} 