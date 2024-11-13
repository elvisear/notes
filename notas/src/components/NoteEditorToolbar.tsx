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
  Select,
  Tooltip,
  Text
} from '@chakra-ui/react'
import {
  TextBolder,
  TextItalic,
  TextUnderline,
  ListBullets,
  ListNumbers,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  TextH,
  CaretDown,
  TextT,
  PaintBucket,
  Image as ImageIcon
} from 'phosphor-react'

interface NoteEditorToolbarProps {
  onImageAdd?: () => void
}

export function NoteEditorToolbar({ onImageAdd }: NoteEditorToolbarProps) {
  return (
    <Box 
      py={2} 
      px={4} 
      borderBottom="1px" 
      borderColor="gray.700"
      bg="gray.800"
    >
      <HStack spacing={2}>
        {/* Fonte e Tamanho */}
        <Menu>
          <MenuButton 
            as={Button}
            rightIcon={<CaretDown />}
            variant="ghost"
            size="sm"
            px={2}
          >
            <HStack>
              <TextT size={20} />
              <Text>Sans Serif</Text>
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem>Sans Serif</MenuItem>
            <MenuItem>Serif</MenuItem>
            <MenuItem>Monospace</MenuItem>
          </MenuList>
        </Menu>

        <Select
          variant="ghost"
          size="sm"
          w="100px"
          icon={<CaretDown />}
          defaultValue="11"
        >
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="14">14</option>
          <option value="18">18</option>
          <option value="24">24</option>
          <option value="30">30</option>
          <option value="36">36</option>
          <option value="48">48</option>
          <option value="60">60</option>
          <option value="72">72</option>
        </Select>

        <Divider orientation="vertical" h="24px" />

        {/* Formatação de Texto */}
        <HStack>
          <Tooltip label="Negrito">
            <IconButton
              aria-label="Negrito"
              icon={<TextBolder />}
              variant="ghost"
              size="sm"
            />
          </Tooltip>
          <Tooltip label="Itálico">
            <IconButton
              aria-label="Itálico"
              icon={<TextItalic />}
              variant="ghost"
              size="sm"
            />
          </Tooltip>
          <Tooltip label="Sublinhado">
            <IconButton
              aria-label="Sublinhado"
              icon={<TextUnderline />}
              variant="ghost"
              size="sm"
            />
          </Tooltip>
        </HStack>

        <Divider orientation="vertical" h="24px" />

        {/* Listas */}
        <HStack>
          <Tooltip label="Lista com marcadores">
            <IconButton
              aria-label="Lista com marcadores"
              icon={<ListBullets />}
              variant="ghost"
              size="sm"
            />
          </Tooltip>
          <Tooltip label="Lista numerada">
            <IconButton
              aria-label="Lista numerada"
              icon={<ListNumbers />}
              variant="ghost"
              size="sm"
            />
          </Tooltip>
        </HStack>

        <Divider orientation="vertical" h="24px" />

        {/* Alinhamento */}
        <HStack>
          <Tooltip label="Alinhar à esquerda">
            <IconButton
              aria-label="Alinhar à esquerda"
              icon={<TextAlignLeft />}
              variant="ghost"
              size="sm"
            />
          </Tooltip>
          <Tooltip label="Centralizar">
            <IconButton
              aria-label="Centralizar"
              icon={<TextAlignCenter />}
              variant="ghost"
              size="sm"
            />
          </Tooltip>
          <Tooltip label="Alinhar à direita">
            <IconButton
              aria-label="Alinhar à direita"
              icon={<TextAlignRight />}
              variant="ghost"
              size="sm"
            />
          </Tooltip>
        </HStack>

        <Divider orientation="vertical" h="24px" />

        {/* Cabeçalhos */}
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Cabeçalhos"
            icon={<TextH />}
            variant="ghost"
            size="sm"
          />
          <MenuList>
            <MenuItem>Título 1</MenuItem>
            <MenuItem>Título 2</MenuItem>
            <MenuItem>Título 3</MenuItem>
            <MenuItem>Normal</MenuItem>
          </MenuList>
        </Menu>

        {/* Cores */}
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Cores"
            icon={<PaintBucket />}
            variant="ghost"
            size="sm"
          />
          <MenuList>
            <MenuItem>Preto</MenuItem>
            <MenuItem>Vermelho</MenuItem>
            <MenuItem>Verde</MenuItem>
            <MenuItem>Azul</MenuItem>
            <MenuItem>Amarelo</MenuItem>
          </MenuList>
        </Menu>

        {/* Imagem */}
        <Tooltip label="Adicionar imagem">
          <IconButton
            aria-label="Adicionar imagem"
            icon={<ImageIcon />}
            variant="ghost"
            size="sm"
            onClick={onImageAdd}
          />
        </Tooltip>
      </HStack>
    </Box>
  )
} 