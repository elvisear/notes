import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'

export interface Tag {
  id: string
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
  const [tags, setTags] = useState<Tag[]>([])
  const [noteTagsMap, setNoteTagsMap] = useState<Record<string, string[]>>({})

// Função para calcular contagens
const calculateTagCounts = useCallback((tagsList: Tag[], notesMap: Record<string, string[]>) => {
  return tagsList.map(tag => {
    // Conta quantas notas contêm esta tag
    const count = Object.values(notesMap).reduce((total, noteTags) => {
      return total + (noteTags.includes(tag.id) ? 1 : 0)
    }, 0)
    
    return { ...tag, notesCount: count }
  })
}, [])

// Função para atualizar todas as tags de uma nota
const updateNoteTags = useCallback((noteId: string, tagIds: string[]) => {
  setNoteTagsMap(prev => {
    const newMap = {
      ...prev,
      [noteId]: tagIds
    }
    
    localStorage.setItem('@Evernote:noteTagsMap', JSON.stringify(newMap))
    
    // Atualiza as contagens imediatamente
    setTags(prevTags => {
      const updatedTags = calculateTagCounts(prevTags, newMap)
      localStorage.setItem('@Evernote:tags', JSON.stringify(updatedTags))
      return updatedTags
    })
    
    return newMap
  })
}, [calculateTagCounts])

const addTagToNote = useCallback((noteId: string, tagId: string) => {
  setNoteTagsMap(prev => {
    const noteTags = prev[noteId] || []
    if (noteTags.includes(tagId)) return prev

    const newMap = {
      ...prev,
      [noteId]: [...noteTags, tagId]
    }
    
    localStorage.setItem('@Evernote:noteTagsMap', JSON.stringify(newMap))
    
    // Atualiza as contagens imediatamente
    setTags(prevTags => {
      const updatedTags = calculateTagCounts(prevTags, newMap)
      localStorage.setItem('@Evernote:tags', JSON.stringify(updatedTags))
      return updatedTags
    })

    return newMap
  })
}, [calculateTagCounts])

const removeTagFromNote = useCallback((noteId: string, tagId: string) => {
  setNoteTagsMap(prev => {
    const noteTags = prev[noteId] || []
    if (!noteTags.includes(tagId)) return prev

    const newMap = {
      ...prev,
      [noteId]: noteTags.filter(id => id !== tagId)
    }
    
    localStorage.setItem('@Evernote:noteTagsMap', JSON.stringify(newMap))
    
    // Atualiza as contagens imediatamente
    setTags(prevTags => {
      const updatedTags = calculateTagCounts(prevTags, newMap)
      localStorage.setItem('@Evernote:tags', JSON.stringify(updatedTags))
      return updatedTags
    })

    return newMap
  })
}, [calculateTagCounts])

  // Carrega os dados iniciais
  useEffect(() => {
    try {
      const storedTags = localStorage.getItem('@Evernote:tags')
      const storedMap = localStorage.getItem('@Evernote:noteTagsMap')
      
      console.log('=== Carregando dados iniciais ===')
      console.log('StoredTags:', storedTags)
      console.log('StoredMap:', storedMap)
      
      if (!storedTags || !storedMap) return
      
      const parsedTags: Tag[] = JSON.parse(storedTags)
      const notesMap: Record<string, string[]> = JSON.parse(storedMap)
      
      setNoteTagsMap(notesMap)
      const tagsWithCounts = calculateTagCounts(parsedTags, notesMap)
      setTags(tagsWithCounts)
    } catch (error) {
      console.error('Erro ao carregar tags:', error)
    }
  }, [calculateTagCounts])

  const createTag = useCallback((name: string, color?: string): Tag => {
    const normalizedName = name.toLowerCase().trim()
    const existingTag = tags.find(tag => tag.name.toLowerCase() === normalizedName)
    
    if (existingTag) {
      return existingTag
    }

    const newTag: Tag = {
      id: crypto.randomUUID(),
      name: name.trim(),
      color: color || DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)],
      createdAt: new Date(),
      notesCount: 0
    }

    const newTags = [...tags, newTag]
    setTags(newTags)
    localStorage.setItem('@Evernote:tags', JSON.stringify(newTags))
    
    return newTag
  }, [tags])

  const removeTagFromAllNotes = useCallback((tagId: string) => {
    const newNoteTagsMap = Object.fromEntries(
      Object.entries(noteTagsMap).map(([noteId, noteTags]) => [
        noteId,
        noteTags.filter(id => id !== tagId)
      ])
    )
    setTags(prev => {
      const newTags = prev.map(tag => 
        tag.id === tagId 
          ? { ...tag, notesCount: 0 }
          : tag
      )
      localStorage.setItem('@Evernote:tags', JSON.stringify(newTags))
      return newTags
    })
    setNoteTagsMap(newNoteTagsMap)
  }, [tags, noteTagsMap])

  const deleteTag = useCallback((id: string) => {
    console.log('=== Deletando tag ===')
    console.log('TagId:', id)

    // Remove a tag da lista de tags
    setTags(prev => {
      const newTags = prev.filter(tag => tag.id !== id)
      localStorage.setItem('@Evernote:tags', JSON.stringify(newTags))
      return newTags
    })

    // Remove a tag de todas as notas
    setNoteTagsMap(prev => {
      const newMap = Object.fromEntries(
        Object.entries(prev).map(([noteId, noteTags]) => [
          noteId,
          noteTags.filter(tagId => tagId !== id)
        ])
      )
      console.log('Novo mapa após deletar tag:', newMap)
      localStorage.setItem('@Evernote:noteTagsMap', JSON.stringify(newMap))
      return newMap
    })
  }, [])

  const updateTag = useCallback((id: string, data: Partial<Tag>) => {
    const newTags = tags.map(tag =>
      tag.id === id ? { ...tag, ...data } : tag
    )
    setTags(newTags)
    localStorage.setItem('@Evernote:tags', JSON.stringify(newTags))
  }, [tags])

  const getTagById = useCallback((id: string) => {
    return tags.find(tag => tag.id === id)
  }, [tags])

  const getTagByName = useCallback((name: string) => {
    return tags.find(tag => tag.name.toLowerCase() === name.toLowerCase().trim())
  }, [tags])

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
      tags,
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