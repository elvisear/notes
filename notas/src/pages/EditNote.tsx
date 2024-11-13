import { VStack } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { NoteEditor } from '../components/NoteEditor'
import { useNotes } from '../contexts/NotesContext'
import { useEffect, useState } from 'react'

export function EditNote() {
  const { id } = useParams()
  const { notes, updateNote } = useNotes()
  const [currentNote, setCurrentNote] = useState(() => 
    notes.find(note => note.id === id)
  )

  // Atualiza a nota atual quando o ID ou as notas mudam
  useEffect(() => {
    const note = notes.find(note => note.id === id)
    if (note) {
      setCurrentNote(note)
    }
  }, [id, notes])

  if (!currentNote) return null

  return (
    <VStack align="stretch" h="100vh">
      <NoteEditor
        key={currentNote.id} // Força recriação do componente quando a nota muda
        id={currentNote.id}
        title={currentNote.title}
        content={currentNote.content}
        notebook={currentNote.notebook}
        lastUpdated={currentNote.updatedAt || currentNote.createdAt}
        isFavorite={currentNote.favorite}
        onTitleChange={(title) => {
          updateNote(currentNote.id, title, currentNote.content, currentNote.tags)
        }}
        onContentChange={(content) => {
          updateNote(currentNote.id, currentNote.title, content, currentNote.tags)
        }}
        onNotebookChange={(notebook) => {
          const updatedNote = { ...currentNote, notebook }
          updateNote(updatedNote.id, updatedNote.title, updatedNote.content, updatedNote.tags)
        }}
        onToggleFavorite={() => {
          // ... lógica do toggle favorite
        }}
        notebooks={['Geral']} // ou passe a lista real de notebooks
        onDelete={() => {
          // ... lógica de delete
        }}
        onTagsChange={(tags) => {
          updateNote(currentNote.id, currentNote.title, currentNote.content, tags)
        }}
        tags={currentNote.tags}
        sidebarWidth="240px" // ou passe a largura real da sidebar
      />
    </VStack>
  )
} 