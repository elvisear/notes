import { 
  Box, 
  Grid, 
  Text, 
  Card, 
  CardBody, 
  CardHeader,
  Heading,
  IconButton,
  HStack,
  useToast
} from '@chakra-ui/react'
import { Trash, Star } from 'phosphor-react'
import { useNotes } from '../contexts/NotesContext'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Link } from 'react-router-dom'

export function Favorites() {
  const { notes, deleteNote, toggleFavorite } = useNotes()
  const toast = useToast()

  const favoriteNotes = notes.filter(note => note.favorite)

  const handleDelete = (id: string) => {
    deleteNote(id)
    toast({
      title: 'Nota excluída com sucesso!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Box w="100%">
      <Heading mb={6}>Notas Favoritas</Heading>
      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
        {favoriteNotes.map(note => (
          <Card key={note.id}>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">{note.title}</Heading>
                <HStack>
                  <IconButton
                    aria-label="Favoritar nota"
                    icon={<Star weight={note.favorite ? 'fill' : 'regular'} />}
                    variant="ghost"
                    colorScheme="yellow"
                    onClick={() => toggleFavorite(note.id)}
                  />
                  <IconButton
                    aria-label="Excluir nota"
                    icon={<Trash />}
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleDelete(note.id)}
                  />
                </HStack>
              </HStack>
              <Text fontSize="sm" color="gray.500">
                {format(new Date(note.createdAt), "dd 'de' MMMM 'às' HH:mm", {
                  locale: ptBR,
                })}
              </Text>
            </CardHeader>
            <CardBody>
              <Link to={`/edit/${note.id}`}>
                <Text noOfLines={3}>{note.content}</Text>
              </Link>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Box>
  )
} 