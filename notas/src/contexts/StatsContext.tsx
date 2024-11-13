import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { useTags } from './TagsContext'
import { useNotes } from './NotesContext'

interface Stats {
  totalNotes: number
  favoriteNotes: number
  tags: number
  lastWeekNotes: number
  storageUsed: number
  notesGrowth: number
  favoritePercentage: number
  topTags: Array<{
    name: string
    count: number
  }>
  storageDetails: {
    used: number // em bytes
    total: number // em bytes
  }
}

interface StatsContextData {
  stats: Stats | null
  isLoading: boolean
  refreshStats: () => Promise<void>
}

const StatsContext = createContext<StatsContextData>({} as StatsContextData)

export function StatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { tags } = useTags()
  const { notes } = useNotes()

  const calculateStorageSize = (data: any): number => {
    const str = JSON.stringify(data)
    const bytes = new TextEncoder().encode(str).length
    return bytes
  }

  const getFavoriteNotes = () => {
    if (!notes) return []
    return notes.filter(note => note.favorite === true)
  }

  const getLastWeekNotes = () => {
    if (!notes) return []
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    return notes.filter(note => {
      const noteDate = new Date(note.createdAt)
      return noteDate >= oneWeekAgo
    })
  }

  const getNotesGrowth = () => {
    if (!notes) return 0
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    
    const lastMonthNotes = notes.filter(note => {
      const noteDate = new Date(note.createdAt)
      return noteDate >= oneMonthAgo
    })

    const previousMonthNotes = notes.filter(note => {
      const noteDate = new Date(note.createdAt)
      return noteDate < oneMonthAgo && noteDate >= new Date(oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1))
    })

    if (previousMonthNotes.length === 0) return 0

    return ((lastMonthNotes.length - previousMonthNotes.length) / previousMonthNotes.length) * 100
  }

  const getTopTags = () => {
    if (!notes) return []
    const tagCounts = new Map<string, number>()

    notes.forEach(note => {
      note.tags?.forEach(tagId => {
        const count = tagCounts.get(tagId) || 0
        tagCounts.set(tagId, count + 1)
      })
    })

    const sortedTags = Array.from(tagCounts.entries())
      .map(([tagId, count]) => {
        const tag = tags.find(t => t.id === tagId)
        return { tagId, tag, count }
      })
      .filter(item => item.tag)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(({ tag, count }) => ({
        name: tag!.name,
        count
      }))

    return sortedTags
  }

  const calculateStorageUsed = () => {
    const totalBytes = calculateStorageSize(notes || [])
    const maxStorage = 1024 * 1024 * 1024 // 1GB em bytes
    
    return {
      used: totalBytes,
      total: maxStorage,
      percentage: (totalBytes / maxStorage) * 100
    }
  }

  const calculateStats = () => {
    const totalNotes = notes?.length || 0
    const favoriteNotes = getFavoriteNotes().length
    const lastWeekNotes = getLastWeekNotes().length
    const storage = calculateStorageUsed()
    const notesGrowth = getNotesGrowth()

    const favoritePercentage = totalNotes > 0 
      ? (favoriteNotes / totalNotes) * 100 
      : 0

    const notesPerTag = totalNotes > 0 && tags.length > 0
      ? totalNotes / tags.length
      : 0

    return {
      totalNotes,
      favoriteNotes,
      notesPerTag,
      tags: tags.length,
      lastWeekNotes,
      storageUsed: storage.percentage,
      notesGrowth,
      favoritePercentage,
      topTags: getTopTags(),
      storageDetails: {
        used: storage.used,
        total: storage.total
      }
    }
  }

  const refreshStats = async () => {
    try {
      setIsLoading(true)
      setStats(calculateStats())
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user && notes) {
      refreshStats()
    }
  }, [user, tags, notes])

  return (
    <StatsContext.Provider value={{ stats, isLoading, refreshStats }}>
      {children}
    </StatsContext.Provider>
  )
}

export const useStats = () => {
  const context = useContext(StatsContext)
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider')
  }
  return context
} 