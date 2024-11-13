import {
  Box,
  VStack,
  IconButton,
  Avatar,
  Tooltip,
  Text,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Divider,
  Collapse,
  useColorModeValue,
  Button,
} from '@chakra-ui/react'
import {
  House,
  Star,
  Plus,
  CaretRight,
  CaretLeft,
  SignOut,
  CaretDown,
  User,
  Tag as TagIcon,
  Trash
} from 'phosphor-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import { useTags } from '../contexts/TagsContext'
import type { Tag } from '../contexts/TagsContext'
import { usePinnedTags } from '../contexts/PinnedTagsContext'
import { toast } from 'sonner'
import { ThemeToggle } from './ThemeToggle'

interface SidebarProps {
  onResize: (width: string) => void
}

const TagRow = ({ tag, onDelete }: { tag: Tag, onDelete: () => void }) => {
  const hoverBg = useColorModeValue('gray.100', 'gray.700')
  
  return (
    <HStack
      w="100%"
      p={2}
      borderRadius="md"
      _hover={{ bg: hoverBg }}
      spacing={2}
    >
      {/* Coluna Nome */}
      <HStack flex={1} minW={0}>
        <Box w={2} h={2} borderRadius="full" bg={tag.color} flexShrink={0} />
        <Text fontSize="sm" noOfLines={1}>
          {tag.name}
        </Text>
      </HStack>

      {/* Coluna Contagem */}
      <Text fontSize="xs" color="gray.500" w="40px" textAlign="center">
        {tag.notesCount}
      </Text>

      {/* Coluna Ações */}
      <IconButton
        aria-label="Excluir tag"
        icon={<Trash />}
        size="xs"
        variant="ghost"
        colorScheme="red"
        opacity={0}
        _groupHover={{ opacity: 1 }}
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      />
    </HStack>
  )
}

export function Sidebar({ onResize }: SidebarProps) {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const isFavoritesActive = location.search.includes('filter=favorites')
  const [showTags, setShowTags] = useState(false)
  const { tags, getTagById, deleteTag } = useTags()
  const { pinnedTags } = usePinnedTags()
  const [activeTagId, setActiveTagId] = useState<string | null>(() => {
    const params = new URLSearchParams(location.search)
    return params.get('tag')
  })

  const bg = useColorModeValue('white', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.900', 'white')
  const hoverBg = useColorModeValue('gray.100', 'gray.700')
  const activeBg = useColorModeValue('gray.100', 'gray.700')
  const toastBg = useColorModeValue('white', 'gray.800')

  const userName = typeof user?.name === 'string' ? user.name : 'Usuário'
  const userEmail = typeof user?.email === 'string' ? user.email : ''
  const userAvatar = typeof user?.avatarUrl === 'string' ? user.avatarUrl : ''

  const handleToggle = () => {
    const newWidth = !isExpanded ? "240px" : "72px"
    setIsExpanded(!isExpanded)
    onResize(newWidth)
  }

  const handleFavoritesClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isFavoritesActive) {
      navigate('/notes')
    } else {
      navigate('/notes?filter=favorites')
    }
  }

  const handleTagClick = (tagId: string) => {
    if (activeTagId === tagId) {
      setActiveTagId(null)
      navigate('/notes')
    } else {
      setActiveTagId(tagId)
      navigate(`/notes?tag=${tagId}`)
    }
  }

  const handleDeleteTag = (tagId: string, tagName: string) => {
    toast.custom((t) => (
      <Box
        p={4}
        bg={toastBg}
        borderRadius="md"
        boxShadow="lg"
      >
        <Text mb={4}>
          Tem certeza que deseja excluir a tag "{tagName}"? 
          Esta ação não pode ser desfeita.
        </Text>
        <HStack spacing={2} justify="flex-end">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toast.dismiss(t)}
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            colorScheme="red"
            onClick={() => {
              deleteTag(tagId)
              toast.dismiss(t)
              toast.success('Tag excluída com sucesso!')
            }}
          >
            Excluir
          </Button>
        </HStack>
      </Box>
    ))
  }

  const renderTag = (tag: Tag) => {
    return (
      <Box 
        key={tag.id} 
        role="group" 
        w="100%"
        cursor="pointer"
        onClick={() => handleTagClick(tag.id)}
        bg={activeTagId === tag.id ? activeBg : 'transparent'}
      >
        <TagRow
          tag={tag}
          onDelete={() => handleDeleteTag(tag.id, tag.name)}
        />
      </Box>
    )
  }

  return (
    <Box
      w={isExpanded ? "240px" : "72px"}
      h="100vh"
      bg={bg}
      borderRight="1px"
      borderColor={borderColor}
      py={4}
      position="relative"
      transition="width 0.2s"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      color={textColor}
    >
      {/* Botão de Expandir/Retrair - Visível apenas no hover */}
      {isHovering && (
        <IconButton
          aria-label={isExpanded ? "Retrair menu" : "Expandir menu"}
          icon={isExpanded ? <CaretLeft /> : <CaretRight />}
          position="absolute"
          right="-12px"
          top="50%"
          transform="translateY(-50%)"
          size="sm"
          borderRadius="full"
          onClick={handleToggle}
          zIndex={20}
          opacity={isHovering ? 1 : 0}
          transition="opacity 0.2s"
        />
      )}

      <VStack spacing={4} h="100%" justify="space-between">
        <VStack spacing={4} w="100%">
          {/* Perfil do Usuário */}
          <Box w="100%" px={4}>
            {isExpanded ? (
              <Menu>
                <MenuButton w="100%">
                  <HStack spacing={3} justify="space-between">
                    <HStack spacing={3}>
                      <Avatar 
                        size="sm" 
                        name={userName}
                        src={userAvatar}
                        bg="brand.primary"
                        color="white"
                      />
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                          {userName}
                        </Text>
                        <Text fontSize="xs" color="gray.500" noOfLines={1}>
                          {userEmail}
                        </Text>
                      </Box>
                    </HStack>
                    <CaretDown />
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem 
                    icon={<User />}
                    onClick={() => navigate('/profile')}
                  >
                    Perfil
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem 
                    icon={<SignOut />}
                    onClick={signOut}
                  >
                    Sair
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Menu>
                <Tooltip label={userName} placement="right">
                  <MenuButton>
                    <Avatar 
                      size="sm" 
                      name={userName}
                      src={userAvatar}
                      bg="brand.primary"
                      color="white"
                    />
                  </MenuButton>
                </Tooltip>
                <MenuList>
                  <MenuItem 
                    icon={<User />}
                    onClick={() => navigate('/profile')}
                  >
                    Perfil
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem 
                    icon={<SignOut />}
                    onClick={signOut}
                  >
                    Sair
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Box>

          {/* Botão de Nova Nota */}
          <Link to="/new" style={{ width: '100%' }}>
            <Tooltip label="Nova nota" placement="right" hasArrow isDisabled={isExpanded}>
              <Box px={4}>
                <HStack 
                  spacing={2} 
                  bg="brand.primary" 
                  color="white" 
                  p={2} 
                  borderRadius="md"
                  justify={isExpanded ? "flex-start" : "center"}
                  w="100%"
                >
                  <Plus weight="bold" />
                  {isExpanded && <Text>Nova Nota</Text>}
                </HStack>
              </Box>
            </Tooltip>
          </Link>

          {/* Navegação */}
          <VStack spacing={2} w="100%" align="stretch">
            <Link to="/notes">
              <Tooltip label="Início" placement="right" hasArrow isDisabled={isExpanded}>
                <Box px={4}>
                  <HStack 
                    spacing={2} 
                    p={2} 
                    borderRadius="md"
                    bg={location.pathname === '/notes' && !isFavoritesActive ? activeBg : 'transparent'}
                    _hover={{ bg: hoverBg }}
                    justify={isExpanded ? "flex-start" : "center"}
                  >
                    <House weight="bold" />
                    {isExpanded && <Text>Início</Text>}
                  </HStack>
                </Box>
              </Tooltip>
            </Link>

            <Box 
              as="a" 
              href="#" 
              onClick={handleFavoritesClick}
            >
              <Tooltip label="Favoritos" placement="right" hasArrow isDisabled={isExpanded}>
                <Box px={4}>
                  <HStack 
                    spacing={2} 
                    p={2} 
                    borderRadius="md"
                    bg={isFavoritesActive ? activeBg : 'transparent'}
                    _hover={{ bg: hoverBg }}
                    justify={isExpanded ? "flex-start" : "center"}
                  >
                    <Star weight="bold" />
                    {isExpanded && <Text>Favoritos</Text>}
                  </HStack>
                </Box>
              </Tooltip>
            </Box>

            <Divider />

            <Box>
              <HStack 
                px={4} 
                py={2} 
                justify="space-between" 
                cursor="pointer"
                onClick={() => setShowTags(!showTags)}
                _hover={{ bg: hoverBg }}
              >
                <HStack>
                  <TagIcon weight="bold" />
                  {isExpanded && <Text>Tags</Text>}
                </HStack>
                {isExpanded && (
                  <CaretDown 
                    style={{ 
                      transform: showTags ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s'
                    }} 
                  />
                )}
              </HStack>

              <Collapse in={showTags && isExpanded}>
                <VStack align="stretch" pl={4} pr={2} mt={1} spacing={1}>
                  {/* Cabeçalho da tabela */}
                  <HStack px={2} color="gray.500" fontSize="xs">
                    <Text flex={1}>Nome</Text>
                    <Text w="40px" textAlign="center">Notas</Text>
                    <Box w="32px" />
                  </HStack>

                  {/* Tags Fixadas */}
                  {pinnedTags.map(tagId => {
                    const tag = getTagById(tagId)
                    if (!tag) return null
                    return renderTag(tag)
                  })}

                  {/* Divisor se houver tags fixadas */}
                  {pinnedTags.length > 0 && <Divider />}

                  {/* Tags Não Fixadas */}
                  {tags
                    .filter(tag => !pinnedTags.includes(tag.id))
                    .map(tag => renderTag(tag))
                  }
                </VStack>
              </Collapse>
            </Box>
          </VStack>
        </VStack>

        {/* Footer com Theme Toggle */}
        <Box w="100%" px={4} pb={2}>
          <Divider mb={4} />
          <HStack justify={isExpanded ? "space-between" : "center"}>
            {isExpanded && (
              <Text fontSize="sm" color="gray.500">
                Tema
              </Text>
            )}
            <ThemeToggle />
          </HStack>
        </Box>
      </VStack>
    </Box>
  )
} 