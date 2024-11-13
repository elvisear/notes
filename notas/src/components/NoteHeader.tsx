import { Box } from '@chakra-ui/react'
import { RichTextEditor } from './RichTextEditor'

interface NoteHeaderProps {
  sidebarWidth: string
  content: string
  onChange: (content: string) => void
}

export function NoteHeader({ sidebarWidth, content, onChange }: NoteHeaderProps) {
  return (
    <Box 
      position="fixed"
      top={0}
      left={`calc(${sidebarWidth} + 360px)`}
      right={0}
      transition="left 0.2s"
      zIndex={10}
    >
      <RichTextEditor 
        content={content} 
        onChange={onChange}
      />
    </Box>
  )
} 