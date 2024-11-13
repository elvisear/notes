import { createContext, useContext, useState, ReactNode } from 'react'

interface PinnedTagsContextData {
  pinnedTags: string[]
  addPinnedTag: (tagId: string) => void
  removePinnedTag: (tagId: string) => void
  isPinned: (tagId: string) => boolean
}

const PinnedTagsContext = createContext<PinnedTagsContextData>({} as PinnedTagsContextData)

export function PinnedTagsProvider({ children }: { children: ReactNode }) {
  const [pinnedTags, setPinnedTags] = useState<string[]>(() => {
    const stored = localStorage.getItem('@Evernote:pinnedTags')
    console.log('PinnedTags do localStorage:', stored)
    return stored ? JSON.parse(stored) : []
  })

  const addPinnedTag = (tagId: string) => {
    if (!pinnedTags.includes(tagId)) {
      const newPinnedTags = [...pinnedTags, tagId]
      setPinnedTags(newPinnedTags)
      localStorage.setItem('@Evernote:pinnedTags', JSON.stringify(newPinnedTags))
    }
  }

  const removePinnedTag = (tagId: string) => {
    const newPinnedTags = pinnedTags.filter(id => id !== tagId)
    setPinnedTags(newPinnedTags)
    localStorage.setItem('@Evernote:pinnedTags', JSON.stringify(newPinnedTags))
  }

  const isPinned = (tagId: string) => pinnedTags.includes(tagId)

  return (
    <PinnedTagsContext.Provider value={{
      pinnedTags,
      addPinnedTag,
      removePinnedTag,
      isPinned
    }}>
      {children}
    </PinnedTagsContext.Provider>
  )
}

export const usePinnedTags = () => useContext(PinnedTagsContext) 