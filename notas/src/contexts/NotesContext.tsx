import { createContext, useContext, useState, ReactNode } from 'react'

interface Note {
  id: string
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
  const [notes, setNotes] = useState<Note[]>(() => {
    const storedNotes = localStorage.getItem('@Evernote:notes')
    return storedNotes ? JSON.parse(storedNotes) : []
  })

  const [notebooks, setNotebooks] = useState<string[]>(() => {
    const storedNotebooks = localStorage.getItem('@Evernote:notebooks')
    return storedNotebooks ? JSON.parse(storedNotebooks) : ['Geral']
  })

  const createNote = (title: string = '', content: string = '', tags: string[] = [], notebook: string = 'Geral') => {
    const newNote = {
      id: crypto.randomUUID(),
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
    const updatedNotes = notes.filter(note => note.id !== id)
    setNotes(updatedNotes)
    localStorage.setItem('@Evernote:notes', JSON.stringify(updatedNotes))
  }

  const updateNote = (id: string, title: string, content: string, tags: string[]) => {
    const updatedNotes = notes.map(note => 
      note.id === id 
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
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, favorite: !note.favorite } : note
    )
    setNotes(updatedNotes)
    localStorage.setItem('@Evernote:notes', JSON.stringify(updatedNotes))
  }

  const searchNotes = (query: string) => {
    const searchTerm = query.toLowerCase()
    return notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm) ||
      note.content.toLowerCase().includes(searchTerm) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  const filterByTag = (tag: string) => {
    return notes.filter(note => note.tags.includes(tag))
  }

  const filterByNotebook = (notebook: string) => {
    return notes.filter(note => note.notebook === notebook)
  }

  const createNotebook = (name: string) => {
    if (!notebooks.includes(name)) {
      const updatedNotebooks = [...notebooks, name]
      setNotebooks(updatedNotebooks)
      localStorage.setItem('@Evernote:notebooks', JSON.stringify(updatedNotebooks))
    }
  }

  const deleteNotebook = (name: string) => {
    if (name === 'Geral') return // Não permite deletar o notebook padrão
    
    const updatedNotebooks = notebooks.filter(n => n !== name)
    setNotebooks(updatedNotebooks)
    localStorage.setItem('@Evernote:notebooks', JSON.stringify(updatedNotebooks))
    
    // Move as notas do notebook deletado para o notebook 'Geral'
    const updatedNotes = notes.map(note =>
      note.notebook === name ? { ...note, notebook: 'Geral' } : note
    )
    setNotes(updatedNotes)
    localStorage.setItem('@Evernote:notes', JSON.stringify(updatedNotes))
  }

  const removeTagFromAllNotes = (tagId: string) => {
    const updatedNotes = notes.map(note => ({
      ...note,
      tags: note.tags.filter(t => t !== tagId)
    }))
    
    setNotes(updatedNotes)
    localStorage.setItem('@Evernote:notes', JSON.stringify(updatedNotes))
  }

  return (
    <NotesContext.Provider value={{
      notes,
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