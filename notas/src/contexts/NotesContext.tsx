import { createContext, useContext, useState, ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface Note {
  id: string
  userId: string
  title: string
  content: string
  createdAt: Date
  updatedAt?: Date
  tags: string[]
  favorite: boolean
  notebook: string
}

interface NotesContextData {
  notes: Note[]
  notebooks: string[]
  createNote: (title: string, content: string, tags: string[], notebook: string) => string
  deleteNote: (id: string) => void
  updateNote: (id: string, title: string, content: string, tags: string[]) => void
  toggleFavorite: (id: string) => void
  searchNotes: (query: string) => Note[]
  filterByTag: (tag: string) => Note[]
  filterByNotebook: (notebook: string) => Note[]
  createNotebook: (name: string) => void
  deleteNotebook: (name: string) => void
  removeTagFromAllNotes: (tagId: string) => void
}

const NotesContext = createContext<NotesContextData>({} as NotesContextData)

export function NotesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>(() => {
    const storedNotes = localStorage.getItem('@Evernote:notes')
    return storedNotes ? JSON.parse(storedNotes) : []
  })

  const [notebooks, setNotebooks] = useState<string[]>(() => {
    const storedNotebooks = localStorage.getItem(`@Evernote:notebooks:${user?.id}`)
    return storedNotebooks ? JSON.parse(storedNotebooks) : ['Geral']
  })

  const createNote = (title: string = '', content: string = '', tags: string[] = [], notebook: string = 'Geral') => {
    if (!user) return ''

    const newNote = {
      id: crypto.randomUUID(),
      userId: user.id,
      title,
      content,
      createdAt: new Date(),
      tags,
      favorite: false,
      notebook
    }

    const updatedNotes = [...notes, newNote]
    setNotes(updatedNotes)
    localStorage.setItem('@Evernote:notes', JSON.stringify(updatedNotes))
    
    return newNote.id
  }

  const deleteNote = (id: string) => {
    if (!user) return

    const updatedNotes = notes.filter(note => 
      note.id !== id || note.userId !== user.id
    )
    setNotes(updatedNotes)
    localStorage.setItem('@Evernote:notes', JSON.stringify(updatedNotes))
  }

  const updateNote = (id: string, title: string, content: string, tags: string[]) => {
    if (!user) return

    const updatedNotes = notes.map(note => 
      note.id === id && note.userId === user.id
        ? { 
            ...note, 
            title, 
            content, 
            tags,
            updatedAt: new Date() 
          } 
        : note
    )

    setNotes(updatedNotes)
    localStorage.setItem('@Evernote:notes', JSON.stringify(updatedNotes))
  }

  const toggleFavorite = (id: string) => {
    if (!user) return

    const updatedNotes = notes.map(note =>
      note.id === id && note.userId === user.id 
        ? { ...note, favorite: !note.favorite } 
        : note
    )
    setNotes(updatedNotes)
    localStorage.setItem('@Evernote:notes', JSON.stringify(updatedNotes))
  }

  const getUserNotes = () => {
    if (!user) return []
    return notes.filter(note => note.userId === user.id)
  }

  const searchNotes = (query: string) => {
    const userNotes = getUserNotes()
    const searchTerm = query.toLowerCase()
    return userNotes.filter(note =>
      note.title.toLowerCase().includes(searchTerm) ||
      note.content.toLowerCase().includes(searchTerm) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  const filterByTag = (tag: string) => {
    const userNotes = getUserNotes()
    return userNotes.filter(note => note.tags.includes(tag))
  }

  const filterByNotebook = (notebook: string) => {
    const userNotes = getUserNotes()
    return userNotes.filter(note => note.notebook === notebook)
  }

  const createNotebook = (name: string) => {
    if (!user || notebooks.includes(name)) return

    const updatedNotebooks = [...notebooks, name]
    setNotebooks(updatedNotebooks)
    localStorage.setItem(`@Evernote:notebooks:${user.id}`, JSON.stringify(updatedNotebooks))
  }

  const deleteNotebook = (name: string) => {
    if (!user || name === 'Geral') return

    const updatedNotebooks = notebooks.filter(n => n !== name)
    setNotebooks(updatedNotebooks)
    localStorage.setItem(`@Evernote:notebooks:${user.id}`, JSON.stringify(updatedNotebooks))
    
    const storedNotes = localStorage.getItem('@Evernote:notes')
    const allNotes = storedNotes ? JSON.parse(storedNotes) : []
    const updatedNotes = allNotes.map((note: Note) =>
      note.userId === user.id && note.notebook === name ? { ...note, notebook: 'Geral' } : note
    )

    setNotes(updatedNotes.filter((note: Note) => note.userId === user.id))
    localStorage.setItem('@Evernote:notes', JSON.stringify(updatedNotes))
  }

  const removeTagFromAllNotes = (tagId: string) => {
    if (!user) return

    const storedNotes = localStorage.getItem('@Evernote:notes')
    const allNotes = storedNotes ? JSON.parse(storedNotes) : []
    const updatedNotes = allNotes.map((note: Note) => 
      note.userId === user.id 
        ? { ...note, tags: note.tags.filter(t => t !== tagId) }
        : note
    )
    
    setNotes(updatedNotes.filter((note: Note) => note.userId === user.id))
    localStorage.setItem('@Evernote:notes', JSON.stringify(updatedNotes))
  }

  return (
    <NotesContext.Provider value={{
      notes: getUserNotes(),
      notebooks,
      createNote,
      deleteNote,
      updateNote,
      toggleFavorite,
      searchNotes,
      filterByTag,
      filterByNotebook,
      createNotebook,
      deleteNotebook,
      removeTagFromAllNotes,
    }}>
      {children}
    </NotesContext.Provider>
  )
}

export const useNotes = () => useContext(NotesContext)