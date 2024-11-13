import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotes } from '../contexts/NotesContext'

export function NewNote() {
  const navigate = useNavigate()
  const { createNote } = useNotes()

  useEffect(() => {
    // Cria uma nova nota sem título
    const newNoteId = createNote('', '', [], 'Geral')
    // Redireciona para a edição da nova nota
    navigate(`/notes/${newNoteId}`)
  }, [])

  return null // Não precisa renderizar nada pois será redirecionado
} 