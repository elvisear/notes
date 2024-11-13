import {
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Box,
  Text,
  HStack,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Portal,
  useColorModeValue
} from '@chakra-ui/react'
import { Tag as TagIcon, Plus } from 'phosphor-react'
import { useRef, useState, useCallback, useMemo } from 'react'
import { useTags } from '../contexts/TagsContext'
import { toast } from 'sonner'

interface TagInputWithSuggestionsProps {
  onTagCreate: (tagId: string) => void
  existingTags: string[]
}

export function TagInputWithSuggestions({ onTagCreate, existingTags }: TagInputWithSuggestionsProps) {
  const [tagInput, setTagInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { createTag, tags } = useTags()

  const bg = useColorModeValue('white', 'gray.800')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  // Filtra as tags que já existem e correspondem à pesquisa
  const searchResults = useMemo(() => {
    if (!tagInput.trim()) return []
    
    const searchTerm = tagInput.toLowerCase()
    return tags
      .filter(tag => 
        tag.name.toLowerCase().includes(searchTerm) && 
        !existingTags.includes(tag.id)
      )
  }, [tagInput, tags, existingTags])

  const handleTagCreate = useCallback(async (tagName: string) => {
    try {
      const newTag = createTag(tagName.trim())
      onTagCreate(newTag.id)
      setTagInput('')
      setShowSuggestions(false)
      
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 0)
    } catch (error) {
      console.error('Erro ao criar tag:', error)
      toast.error('Erro ao criar tag')
    }
  }, [createTag, onTagCreate])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      handleTagCreate(tagInput)
    }
  }, [tagInput, handleTagCreate])

  return (
    <Popover
      isOpen={showSuggestions && (searchResults.length > 0 || tagInput.trim().length > 0)}
      onClose={() => setShowSuggestions(false)}
      placement="top"
      matchWidth
      autoFocus={false}
    >
      <PopoverTrigger>
        <InputGroup size="sm" maxW="200px">
          <InputLeftElement>
            <Icon as={TagIcon} color="gray.400" />
          </InputLeftElement>
          <Input
            ref={inputRef}
            placeholder="Digite para criar ou buscar tag..."
            value={tagInput}
            onChange={(e) => {
              setTagInput(e.target.value)
              setShowSuggestions(!!e.target.value.trim())
            }}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            bg={bg}
          />
        </InputGroup>
      </PopoverTrigger>
      <Portal>
        <PopoverContent width="200px">
          <PopoverBody p={0}>
            <VStack align="stretch" spacing={0}>
              {searchResults.map(tag => (
                <Box
                  key={tag.id}
                  px={4}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: hoverBg }}
                  onClick={() => {
                    onTagCreate(tag.id)
                    setTagInput('')
                    setShowSuggestions(false)
                    setTimeout(() => {
                      if (inputRef.current) {
                        inputRef.current.focus()
                      }
                    }, 0)
                  }}
                >
                  <HStack>
                    <Box w={2} h={2} borderRadius="full" bg={tag.color} />
                    <Text fontSize="sm">{tag.name}</Text>
                  </HStack>
                </Box>
              ))}
              {tagInput.trim() && searchResults.length === 0 && (
                <Box
                  px={4}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: hoverBg }}
                  onClick={() => handleTagCreate(tagInput)}
                >
                  <HStack>
                    <Plus size={16} />
                    <Text fontSize="sm">Criar tag "{tagInput.trim()}"</Text>
                  </HStack>
                </Box>
              )}
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
} 