import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'

export interface Tag {
  id: string
  userId: string
  name: string
  color: string
  createdAt: Date
  notesCount: number
}

interface TagsContextData {
  tags: Tag[]
  createTag: (name: string, color?: string) => Tag
  deleteTag: (id: string) => void
  updateTag: (id: string, data: Partial<Tag>) => void
  getTagById: (id: string) => Tag | undefined
  getTagByName: (name: string) => Tag | undefined
  addTagToNote: (noteId: string, tagId: string) => void
  removeTagFromNote: (noteId: string, tagId: string) => void
  getNoteTags: (noteId: string) => Tag[]
  searchTags: (query: string) => Tag[]
  removeTagFromAllNotes: (tagId: string) => void
  updateNoteTags: (noteId: string, tagIds: string[]) => void
}

const TagsContext = createContext<TagsContextData>({} as TagsContextData)

const DEFAULT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
  '#D4A5A5', '#9B59B6', '#3498DB', '#1ABC9C', '#F1C40F'
]

export function TagsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [tags, setTags] = useState<Tag[]>(() => {
    const storedTags = localStorage.getItem('@Evernote:tags')
    if (!storedTags) return []
    try {
      return JSON.parse(storedTags)
    } catch {
      return []
    }
  })
  
  const [noteTagsMap, setNoteTagsMap] = useState<Record<string, string[]>>(() => {
    const storedMap = localStorage.getItem('@Evernote:noteTagsMap')
    return storedMap ? JSON.parse(storedMap) : {}
  })

  // Monitora mudanças nas notas
  useEffect(() => {
    if (!user) return

    const handleStorageChange = () => {
      const storedNotes = localStorage.getItem('@Evernote:notes')
      if (!storedNotes) return

      const allNotes = JSON.parse(storedNotes)
      const userNotes = allNotes.filter((note: any) => note.userId === user.id)

      setTags(prevTags => {
        const updatedTags = prevTags.map(tag => {
          if (tag.userId !== user.id) return tag

          // Conta notas que contêm esta tag
          const count = userNotes.reduce((total: number, note: any) => {
            return note.tags?.includes(tag.id) ? total + 1 : total
          }, 0)

          return { ...tag, notesCount: count }
        })

        localStorage.setItem('@Evernote:tags', JSON.stringify(updatedTags))
        return updatedTags
      })
    }

    // Atualiza contagens iniciais
    handleStorageChange()

    // Adiciona listener para mudanças no localStorage
    window.addEventListener('storage', handleStorageChange)
    
    // Cria um evento customizado para mudanças locais
    const notesChangeEvent = new Event('notesChange')
    const originalSetItem = localStorage.setItem
    localStorage.setItem = function(key: string, value: string) {
      if (key === '@Evernote:notes') {
        originalSetItem.apply(this, [key, value])
        window.dispatchEvent(notesChangeEvent)
      } else {
        originalSetItem.apply(this, [key, value])
      }
    }

    // Adiciona listener para o evento customizado
    window.addEventListener('notesChange', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('notesChange', handleStorageChange)
      localStorage.setItem = originalSetItem
    }
  }, [user])

  const addTagToNote = useCallback((noteId: string, tagId: string) => {
    if (!user) return

    const storedNotes = localStorage.getItem('@Evernote:notes')
    const allNotes = storedNotes ? JSON.parse(storedNotes) : []
    let wasUpdated = false
    
    const updatedNotes = allNotes.map((note: any) => {
      if (note.id === noteId && note.userId === user.id) {
        const currentTags = note.tags || []
        if (!currentTags.includes(tagId)) {
          wasUpdated = true
          return { ...note, tags: [...currentTags, tagId] }
        }
      }
      return note
    })

    if (wasUpdated) {
      localStorage.setItem('@Evernote:notes', JSON.stringify(updatedNotes))
    }
  }, [user])

  const removeTagFromNote = useCallback((noteId: string, tagId: string) => {
    if (!user) return

    const storedNotes = localStorage.getItem('@Evernote:notes')
    const allNotes = storedNotes ? JSON.parse(storedNotes) : []
    let wasUpdated = false
    
    const updatedNotes = allNotes.map((note: any) => {
      if (note.id === noteId && note.userId === user.id) {
        const currentTags = note.tags || []
        if (currentTags.includes(tagId)) {
          wasUpdated = true
          return {
            ...note,
            tags: currentTags.filter((id: string) => id !== tagId)
          }
        }
      }
      return note
    })

    if (wasUpdated) {
      localStorage.setItem('@Evernote:notes', JSON.stringify(updatedNotes))
    }
  }, [user])

  const updateNoteTags = useCallback((noteId: string, tagIds: string[]) => {
    if (!user) return

    const storedNotes = localStorage.getItem('@Evernote:notes')
    const allNotes = storedNotes ? JSON.parse(storedNotes) : []
    let wasUpdated = false
    
    const updatedNotes = allNotes.map((note: any) => {
      if (note.id === noteId && note.userId === user.id) {
        const currentTags = note.tags || []
        if (JSON.stringify(currentTags) !== JSON.stringify(tagIds)) {
          wasUpdated = true
          return { ...note, tags: tagIds }
        }
      }
      return note
    })

    if (wasUpdated) {
      localStorage.setItem('@Evernote:notes', JSON.stringify(updatedNotes))
    }
  }, [user])

  const removeTagFromAllNotes = useCallback((tagId: string) => {
    if (!user) return

    const storedNotes = localStorage.getItem('@Evernote:notes')
    const allNotes = storedNotes ? JSON.parse(storedNotes) : []
    let wasUpdated = false

    const updatedNotes = allNotes.map((note: any) => {
      if (note.userId === user.id && note.tags?.includes(tagId)) {
        wasUpdated = true
        return {
          ...note,
          tags: note.tags.filter((id: string) => id !== tagId)
        }
      }
      return note
    })

    if (wasUpdated) {
      localStorage.setItem('@Evernote:notes', JSON.stringify(updatedNotes))
    }
  }, [user])

  const createTag = useCallback((name: string, color?: string): Tag => {
    if (!user) throw new Error('Usuário não autenticado')

    const normalizedName = name.toLowerCase().trim()
    const existingTag = tags.find(tag => 
      tag.name.toLowerCase() === normalizedName && 
      tag.userId === user.id
    )
    
    if (existingTag) {
      return existingTag
    }

    const newTag: Tag = {
      id: crypto.randomUUID(),
      userId: user.id, // Garante que a tag tenha o userId
      name: name.trim(),
      color: color || DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)],
      createdAt: new Date(),
      notesCount: 0
    }

    // Mantém as tags de outros usuários e adiciona a nova
    const newTags = [...tags, newTag]
    setTags(newTags)
    localStorage.setItem('@Evernote:tags', JSON.stringify(newTags))
    
    return newTag
  }, [tags, user])

  const deleteTag = useCallback((id: string) => {
    if (!user) return

    setTags(prev => {
      const newTags = prev.filter(tag => 
        !(tag.id === id && tag.userId === user.id)
      )
      localStorage.setItem('@Evernote:tags', JSON.stringify(newTags))
      return newTags
    })

    setNoteTagsMap(prev => {
      const newMap = Object.fromEntries(
        Object.entries(prev).map(([noteId, noteTags]) => [
          noteId,
          noteTags.filter(tagId => tagId !== id)
        ])
      )
      localStorage.setItem('@Evernote:noteTagsMap', JSON.stringify(newMap))
      return newMap
    })
  }, [user])

  const updateTag = useCallback((id: string, data: Partial<Tag>) => {
    if (!user) return

    setTags(prev => {
      const newTags = prev.map(tag =>
        tag.id === id && tag.userId === user.id ? { ...tag, ...data } : tag
      )
      localStorage.setItem('@Evernote:tags', JSON.stringify(newTags))
      return newTags
    })
  }, [user])

  const getTagById = useCallback((id: string) => {
    return tags.find(tag => tag.id === id)
  }, [tags])

  const getTagByName = useCallback((name: string) => {
    if (!user) return undefined
    return tags.find(tag => 
      tag.name.toLowerCase() === name.toLowerCase().trim() && 
      tag.userId === user.id
    )
  }, [tags, user])

  const getNoteTags = useCallback((noteId: string): Tag[] => {
    const tagIds = noteTagsMap[noteId] || []
    return tagIds.map(id => getTagById(id)).filter(Boolean) as Tag[]
  }, [noteTagsMap, getTagById])

  const searchTags = useCallback((query: string): Tag[] => {
    const searchTerm = query.toLowerCase()
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(searchTerm)
    )
  }, [tags])

  return (
    <TagsContext.Provider value={{
      tags: user ? tags.filter(tag => tag.userId === user.id) : [],
      createTag,
      deleteTag,
      updateTag,
      getTagById,
      getTagByName,
      addTagToNote,
      removeTagFromNote,
      getNoteTags,
      searchTags,
      removeTagFromAllNotes,
      updateNoteTags
    }}>
      {children}
    </TagsContext.Provider>
  )
}

export const useTags = () => useContext(TagsContext)