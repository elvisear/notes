import {
  Box,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Input,
  Text,
  Flex
} from '@chakra-ui/react'
import {
  CaretDown,
  Share,
  Clock,
  DotsThree,
  Star,
  Trash,
  Books
} from 'phosphor-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface NoteToolbarProps {
  title: string
  notebook: string
  lastUpdated?: Date
  isFavorite?: boolean
  onTitleChange: (title: string) => void
  onNotebookChange: (notebook: string) => void
  onToggleFavorite: () => void
  onDelete: () => void
  notebooks: string[]
}

export function NoteToolbar({
  title,
  notebook,
  lastUpdated,
  isFavorite,
  onTitleChange,
  onNotebookChange,
  onToggleFavorite,
  onDelete,
  notebooks
}: NoteToolbarProps) {
  return (
    <Box 
      py={2} 
      px={4} 
      borderBottom="1px" 
      borderColor="gray.700"
      bg="gray.800"
    >
      <Flex direction="column" gap={2}>
        <HStack justify="space-between">
          <HStack spacing={4}>
            <Menu>
              <MenuButton 
                as={Button} 
                rightIcon={<CaretDown />}
                variant="ghost"
                size="sm"
              >
                {notebook}
              </MenuButton>
              <MenuList>
                {notebooks.map(nb => (
                  <MenuItem 
                    key={nb}
                    onClick={() => onNotebookChange(nb)}
                  >
                    {nb}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Divider orientation="vertical" h="20px" />
            <IconButton
              aria-label="Favoritar"
              icon={<Star weight={isFavorite ? "fill" : "regular"} />}
              variant="ghost"
              size="sm"
              onClick={onToggleFavorite}
            />
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Mais opções"
                icon={<DotsThree />}
                variant="ghost"
                size="sm"
              />
              <MenuList>
                <MenuItem icon={<Share />}>Compartilhar</MenuItem>
                <MenuItem icon={<Books />}>Mover para notebook</MenuItem>
                <MenuItem icon={<Trash />} onClick={onDelete}>Excluir</MenuItem>
              </MenuList>
            </Menu>
          </HStack>

          {lastUpdated && (
            <HStack spacing={2} color="gray.400" fontSize="sm">
              <Clock />
              <Text>
                {format(lastUpdated, "dd 'de' MMMM 'às' HH:mm", {
                  locale: ptBR,
                })}
              </Text>
            </HStack>
          )}
        </HStack>

        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          variant="unstyled"
          fontSize="xl"
          fontWeight="bold"
          placeholder="Título da nota"
          _placeholder={{ color: 'gray.500' }}
        />
      </Flex>
    </Box>
  )
} 