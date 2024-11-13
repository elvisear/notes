import {
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  HStack,
  Select,
  Tag,
  Wrap,
  WrapItem
} from '@chakra-ui/react'
import { MagnifyingGlass } from 'phosphor-react'
import { useNotes } from '../contexts/NotesContext'
import { useState, useEffect } from 'react'

interface SearchBarProps {
  onSearch: (notes: Note[]) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const { notes, notebooks, searchNotes, filterByNotebook, filterByTag } = useNotes()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNotebook, setSelectedNotebook] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  // Obter todas as tags únicas das notas
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)))

  useEffect(() => {
    let filteredNotes = notes

    if (searchTerm) {
      filteredNotes = searchNotes(searchTerm)
    }

    if (selectedNotebook) {
      filteredNotes = filteredNotes.filter(note => note.notebook === selectedNotebook)
    }

    if (selectedTag) {
      filteredNotes = filteredNotes.filter(note => note.tags.includes(selectedTag))
    }

    onSearch(filteredNotes)
  }, [searchTerm, selectedNotebook, selectedTag, notes])

  return (
    <Box mb={6}>
      <HStack spacing={4} mb={4}>
        <InputGroup>
          <InputLeftElement>
            <MagnifyingGlass />
          </InputLeftElement>
          <Input
            placeholder="Pesquisar notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Select
          placeholder="Todos os notebooks"
          value={selectedNotebook}
          onChange={(e) => setSelectedNotebook(e.target.value)}
        >
          {notebooks.map(notebook => (
            <option key={notebook} value={notebook}>
              {notebook}
            </option>
          ))}
        </Select>
      </HStack>

      <Wrap spacing={2}>
        <WrapItem>
          <Tag
            cursor="pointer"
            onClick={() => setSelectedTag('')}
            colorScheme={selectedTag === '' ? 'green' : 'gray'}
          >
            Todas as tags
          </Tag>
        </WrapItem>
        {allTags.map(tag => (
          <WrapItem key={tag}>
            <Tag
              cursor="pointer"
              onClick={() => setSelectedTag(tag)}
              colorScheme={selectedTag === tag ? 'green' : 'gray'}
            >
              {tag}
            </Tag>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  )
} 