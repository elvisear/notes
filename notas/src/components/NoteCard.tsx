import { Link } from 'react-router-dom'
import { Box, useColorModeValue, Text, VStack, HStack, Tag } from '@chakra-ui/react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ListChecks } from 'phosphor-react'

interface NoteCardProps {
  note: {
    id: string
    title?: string
    content?: string
    createdAt?: Date
    tags?: string[]
  }
  isActive?: boolean
}

export function NoteCard({ note, isActive = false }: NoteCardProps) {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.900', 'white')
  const selectedBg = useColorModeValue('purple.50', 'purple.900')
  const selectedBorderColor = useColorModeValue('purple.500', 'purple.500')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  // Função para contar as tarefas
  const countTasks = (content: string) => {
    if (!content) return null

    try {
      const taskRegex = /<li data-type="taskItem"[^>]*data-checked="(true|false)"[^>]*>/g
      const matches = content.match(taskRegex)

      if (!matches) return null

      const total = matches.length
      const completed = content.match(/<li data-type="taskItem"[^>]*data-checked="true"[^>]*>/g)?.length || 0

      return { completed, total }
    } catch (error) {
      return null
    }
  }

  const taskCount = note.content ? countTasks(note.content) : null

  return (
    <Link to={`/notes/${note.id}`} style={{ display: 'block', width: '100%' }}>
      <Box
        p={3}
        bg={isActive ? selectedBg : bgColor}
        borderBottom="1px"
        borderColor={isActive ? selectedBorderColor : borderColor}
        borderLeft="4px"
        borderLeftColor={isActive ? selectedBorderColor : 'transparent'}
        cursor="pointer"
        transition="all 0.2s ease-in-out"
        position="relative"
        _hover={{
          bg: isActive ? selectedBg : hoverBg,
          borderLeftColor: selectedBorderColor,
          transform: 'translateX(4px)',
        }}
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-4px',
          width: '4px',
          height: '100%',
          bg: isActive ? selectedBorderColor : 'transparent',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <VStack align="stretch" spacing={2}>
          <Text
            fontWeight={isActive ? "bold" : "medium"}
            fontSize="sm"
            color={textColor}
            noOfLines={1}
          >
            {note.title || 'Sem título'}
          </Text>

          {taskCount && taskCount.total > 0 && (
            <HStack spacing={1} color="gray.500" fontSize="xs">
              <ListChecks />
              <Text>
                {taskCount.completed}/{taskCount.total}
              </Text>
            </HStack>
          )}

          <Text
            fontSize="xs"
            color="gray.500"
            noOfLines={2}
          >
            {note.content ? note.content.replace(/<[^>]*>/g, '') : ''}
          </Text>

          {note.createdAt && (
            <Text fontSize="xs" color="gray.500">
              {format(new Date(note.createdAt), "dd MMM yyyy", {
                locale: ptBR,
              })}
            </Text>
          )}
        </VStack>
      </Box>
    </Link>
  )
} 