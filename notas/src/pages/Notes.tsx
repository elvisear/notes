import { 
  Text, 
  Center,
  Icon,
  VStack
} from '@chakra-ui/react'
import { NotePencil } from 'phosphor-react'
import { useNotes } from '../contexts/NotesContext'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { NoteEditor } from '../components/NoteEditor'

interface NoteData {
  title: string
  content: string
  notebook: string
  tags: string[]
  favorite: boolean
  lastUpdated: Date
}

export function Notes() {
  const { id } = useParams()
  const { notes, updateNote, toggleFavorite, notebooks } = useNotes()
  const navigate = useNavigate()
  const [currentNote, setCurrentNote] = useState<NoteData | null>(null)

  useEffect(() => {
    // Se houver notas mas nenhuma selecionada, seleciona a primeira
    if (notes.length > 0 && !id) {
      navigate(`/notes/${notes[0].id}`)
    }

    // Quando o ID mudar, atualiza a nota atual
    if (id) {
      const selectedNote = notes.find(note => note.id === id)
      if (selectedNote) {
        setCurrentNote({
          title: selectedNote.title,
          content: selectedNote.content,
          notebook: selectedNote.notebook,
          tags: selectedNote.tags,
          favorite: selectedNote.favorite,
          lastUpdated: new Date(selectedNote.createdAt)
        })
      }
    }
  }, [notes, id, navigate])

  const handleUpdate = (field: string, value: any) => {
    if (!id || !currentNote) return

    const updatedNote = { ...currentNote, [field]: value }
    setCurrentNote(updatedNote)
    updateNote(id, updatedNote.title, updatedNote.content, updatedNote.tags)
  }

  const handleToggleFavorite = () => {
    if (!id || !currentNote) return
    
    toggleFavorite(id)
    setCurrentNote(prev => prev ? { ...prev, favorite: !prev.favorite } : null)
  }

  if (!currentNote) {
    return (
      <Center h="100%" flexDirection="column" color="gray.500">
        <Icon as={NotePencil} fontSize="48px" mb={4} />
        <Text>Selecione uma nota para visualizar</Text>
      </Center>
    )
  }

  return (
    <VStack h="100%" spacing={0}>
      <NoteEditor
        id={id!}
        title={currentNote.title}
        content={currentNote.content}
        notebook={currentNote.notebook}
        tags={currentNote.tags}
        lastUpdated={currentNote.lastUpdated}
        isFavorite={currentNote.favorite}
        onTitleChange={(title) => handleUpdate('title', title)}
        onContentChange={(content) => handleUpdate('content', content)}
        onNotebookChange={(notebook) => handleUpdate('notebook', notebook)}
        onTagsChange={(tags) => handleUpdate('tags', tags)}
        onToggleFavorite={handleToggleFavorite}
        onDelete={() => {/* Implemente a função de deletar */}}
        notebooks={notebooks}
        sidebarWidth="250"
      />
    </VStack>
  )
} 