import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import FontFamily from '@tiptap/extension-font-family'
import History from '@tiptap/extension-history'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import { FontSize } from '../extensions/fontSize'

import {
  Box,
  ButtonGroup,
  IconButton,
  Tooltip,
  Divider,
  useBreakpointValue,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  SimpleGrid,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react'
import {
  TextBolder,
  TextItalic,
  TextUnderline,
  TextStrikethrough,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  TextAlignJustify,
  ListBullets,
  ListNumbers,
  TextH,
  Quotes,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Palette,
  ArrowCounterClockwise,
  ArrowClockwise,
  PaintBrush,
  ListChecks,
  CaretDown,
} from 'phosphor-react'
import { useEffect, useState, useCallback } from 'react'

// Definindo as fontes disponíveis
const FONTS = [
  { name: 'Sans Serif', value: 'Helvetica, sans-serif' },
  { name: 'Serif', value: 'Georgia, Times New Roman, serif' },
  { name: 'Slab Serif', value: 'Roboto Slab, Rockwell, serif' },
  { name: 'Monospace', value: 'monospace' },
  { name: 'Script', value: 'Dancing Script, cursive' },
  { name: 'Escrito à mão', value: 'Handlee, cursive' },
]

// Definindo as cores disponíveis
const COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#cccccc',
  '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4',
  '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899',
]

// Definindo as cores de destaque
const HIGHLIGHT_COLORS = [
  'transparent', // Cor para remover o destaque
  '#fef08a', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b',
  '#d9f99d', '#bef264', '#a3e635', '#84cc16', '#65a30d',
  '#67e8f9', '#22d3ee', '#06b6d4', '#0891b2', '#0e7490',
]

// Definindo os tamanhos de fonte disponíveis
const FONT_SIZES = [
  { label: '8', value: '8pt' },
  { label: '9', value: '9pt' },
  { label: '10', value: '10pt' },
  { label: '12', value: '12pt' },
  { label: '14', value: '14pt' },
  { label: '15', value: '15pt' },
  { label: '16', value: '16pt' },
  { label: '18', value: '18pt' },
  { label: '20', value: '20pt' },
  { label: '24', value: '24pt' },
  { label: '30', value: '30pt' },
  { label: '36', value: '36pt' },
  { label: '48', value: '48pt' },
  { label: '64', value: '64pt' },
  { label: '72', value: '72pt' },
  { label: '96', value: '96pt' },
]

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

// Componente personalizado para o ícone de sobrescrito (x²)
const SuperscriptIcon = () => (
  <Box fontSize="sm" fontFamily="monospace" display="flex" alignItems="center">
    x
    <Box as="span" fontSize="xs" position="relative" top="-4px">
      2
    </Box>
  </Box>
)

// Componente personalizado para o ícone de subscrito (x₂)
const SubscriptIcon = () => (
  <Box fontSize="sm" fontFamily="monospace" display="flex" alignItems="center">
    x
    <Box as="span" fontSize="xs" position="relative" bottom="-4px">
      2
    </Box>
  </Box>
)

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [taskCount, setTaskCount] = useState({ completed: 0, total: 0 })
  const isMobile = useBreakpointValue({ base: true, md: false })
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const updateTaskCount = useCallback((editor: any) => {
    const tasks = editor.getJSON().content?.filter((node: any) => 
      node.type === 'taskList'
    ).flatMap((list: any) => 
      list.content?.filter((item: any) => item.type === 'taskItem')
    ) || []
    
    const completed = tasks.filter((task: any) => task?.attrs?.checked).length || 0
    setTaskCount({ completed, total: tasks.length })
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'bullet-list',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'list-item',
          },
        },
      }),
      Placeholder.configure({
        placeholder: 'Comece a escrever...',
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'task-list',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item',
        },
      }),
      FontFamily,
      History,
      Superscript,
      Subscript,
      FontSize.configure({
        types: ['textStyle']
      }),
    ],
    content,
    onBlur: ({ editor }) => {
      onChange(editor.getHTML())
    },
    onUpdate: ({ editor }) => {
      updateTaskCount(editor)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        'data-placeholder': 'Comece a escrever...',
      },
      handleKeyDown: (_, event) => {
        // Adiciona suporte para Tab e Shift+Tab
        if (event.key === 'Tab') {
          if (event.shiftKey) {
            // Shift+Tab: diminui o recuo
            editor?.chain().focus().liftListItem('listItem').run()
          } else {
            // Tab: aumenta o recuo
            editor?.chain().focus().sinkListItem('listItem').run()
          }
          return true // Previne o comportamento padrão do Tab
        }
        return false
      },
    },
  })

  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL:', previousUrl)

    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return

    const url = window.prompt('URL da imagem:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  useEffect(() => {
    if (editor) {
      updateTaskCount(editor)
    }
  }, [editor, updateTaskCount])

  if (!editor) return null

  return (
    <Box position="relative" h="100%">
      {/* Barra de ferramentas */}
      <Box 
        position="sticky"
        top={0}
        left={0}
        right={0}
        zIndex={10}
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        p={2}
        shadow="md"
      >
        <ButtonGroup spacing={1} flexWrap="wrap" gap={1}>
          {/* Desfazer/Refazer */}
          <ButtonGroup spacing={1}>
            <Tooltip label="Desfazer (Ctrl+Z)">
              <IconButton
                aria-label="Desfazer"
                icon={<ArrowCounterClockwise />}
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                isDisabled={!editor.can().undo()}
              />
            </Tooltip>
            <Tooltip label="Refazer (Ctrl+Y)">
              <IconButton
                aria-label="Refazer"
                icon={<ArrowClockwise />}
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                isDisabled={!editor.can().redo()}
              />
            </Tooltip>
          </ButtonGroup>

          <Divider orientation="vertical" h="24px" alignSelf="center" />

          {/* Fonte */}
          <Menu>
            <Tooltip label="Fonte">
              <MenuButton 
                as={Button} 
                variant="ghost"
                size="sm"
                w="110px"
                px={2}
                rightIcon={<CaretDown />}
                style={{ 
                  fontFamily: FONTS.find(font => 
                    editor.isActive('textStyle', { fontFamily: font.value })
                  )?.value || 'Arial, sans-serif'
                }}
              >
                {FONTS.find(font => editor.isActive('textStyle', { fontFamily: font.value }))?.name || 'Sans Serif'}
              </MenuButton>
            </Tooltip>
            <MenuList maxH="300px" overflowY="auto">
              {FONTS.map(font => (
                <MenuItem
                  key={font.value}
                  onClick={() => editor.chain().focus().setFontFamily(font.value).run()}
                  sx={{
                    fontSize: 'md',
                    height: 'auto',
                    py: 1,
                    fontWeight: editor.isActive('textStyle', { fontFamily: font.value }) ? 'bold' : 'normal',
                    bg: editor.isActive('textStyle', { fontFamily: font.value }) ? 'brand.50' : 'transparent',
                    color: editor.isActive('textStyle', { fontFamily: font.value }) ? 'brand.500' : 'inherit',
                    minH: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: font.value, // Aplicando a fonte ao próprio item do menu
                    '&:hover': {
                      bg: 'gray.50',
                    },
                  }}
                >
                  {font.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Divider orientation="vertical" h="24px" alignSelf="center" />

          {/* Tamanho */}
          <Menu>
            <Tooltip label="Tamanho da fonte">
              <MenuButton 
                as={Button} 
                variant="ghost"
                size="sm"
                px={2}
                rightIcon={<CaretDown />}
                w="50px"
                textAlign="left"
              >
                {editor.getAttributes('textStyle').fontSize?.replace('pt', '') || '16'}
              </MenuButton>
            </Tooltip>
            <MenuList maxH="auto" overflowY="auto" minW="unset" w="70px">
              {FONT_SIZES.map(size => (
                <MenuItem
                  key={size.value}
                  onClick={() => editor.chain().focus().setFontSize(size.value).run()}
                  sx={{
                    fontSize: 'sm',
                    height: 'auto',
                    py: 1,
                    fontWeight: editor.getAttributes('textStyle').fontSize === size.value ? 'bold' : 'normal',
                    bg: editor.getAttributes('textStyle').fontSize === size.value ? 'brand.50' : 'transparent',
                    color: editor.getAttributes('textStyle').fontSize === size.value ? 'brand.500' : 'inherit',
                    minH: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      bg: 'gray.50',
                    },
                  }}
                >
                  {size.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Divider orientation="vertical" h="24px" alignSelf="center" />

          {/* Formatação de Texto */}
          <ButtonGroup spacing={1}>
            <Tooltip label="Negrito (Ctrl+B)">
              <IconButton
                aria-label="Negrito"
                icon={<TextBolder />}
                variant={editor.isActive('bold') ? 'solid' : 'ghost'}
                size="sm"
                bg={editor.isActive('bold') ? 'brand.primary' : undefined}
                color={editor.isActive('bold') ? 'white' : undefined}
                _hover={{
                  bg: editor.isActive('bold') ? 'brand.primaryDark' : 'gray.100'
                }}
                onClick={() => editor.chain().focus().toggleBold().run()}
              />
            </Tooltip>
            <Tooltip label="Itálico (Ctrl+I)">
              <IconButton
                aria-label="Itálico"
                icon={<TextItalic />}
                variant={editor.isActive('italic') ? 'solid' : 'ghost'}
                size="sm"
                bg={editor.isActive('italic') ? 'brand.primary' : undefined}
                color={editor.isActive('italic') ? 'white' : undefined}
                _hover={{
                  bg: editor.isActive('italic') ? 'brand.primaryDark' : 'gray.100'
                }}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              />
            </Tooltip>
            <Tooltip label="Sublinhado (Ctrl+U)">
              <IconButton
                aria-label="Sublinhado"
                icon={<TextUnderline />}
                variant={editor.isActive('underline') ? 'solid' : 'ghost'}
                size="sm"
                bg={editor.isActive('underline') ? 'brand.primary' : undefined}
                color={editor.isActive('underline') ? 'white' : undefined}
                _hover={{
                  bg: editor.isActive('underline') ? 'brand.primaryDark' : 'gray.100'
                }}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              />
            </Tooltip>
            <Tooltip label="Tachado">
              <IconButton
                aria-label="Tachado"
                icon={<TextStrikethrough />}
                variant={editor.isActive('strike') ? 'solid' : 'ghost'}
                size="sm"
                bg={editor.isActive('strike') ? 'brand.primary' : undefined}
                color={editor.isActive('strike') ? 'white' : undefined}
                _hover={{
                  bg: editor.isActive('strike') ? 'brand.primaryDark' : 'gray.100'
                }}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              />
            </Tooltip>
            <Tooltip label="Sobrescrito (x²)">
              <IconButton
                aria-label="Sobrescrito"
                icon={<SuperscriptIcon />}
                variant={editor.isActive('superscript') ? 'solid' : 'ghost'}
                size="sm"
                bg={editor.isActive('superscript') ? 'brand.primary' : undefined}
                color={editor.isActive('superscript') ? 'white' : undefined}
                _hover={{
                  bg: editor.isActive('superscript') ? 'brand.primaryDark' : 'gray.100'
                }}
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
              />
            </Tooltip>
            <Tooltip label="Subscrito (x₂)">
              <IconButton
                aria-label="Subscrito"
                icon={<SubscriptIcon />}
                variant={editor.isActive('subscript') ? 'solid' : 'ghost'}
                size="sm"
                bg={editor.isActive('subscript') ? 'brand.primary' : undefined}
                color={editor.isActive('subscript') ? 'white' : undefined}
                _hover={{
                  bg: editor.isActive('subscript') ? 'brand.primaryDark' : 'gray.100'
                }}
                onClick={() => editor.chain().focus().toggleSubscript().run()}
              />
            </Tooltip>
          </ButtonGroup>

          <Divider orientation="vertical" h="24px" alignSelf="center" />

          {/* Cor e Destaque */}
          <ButtonGroup spacing={1}>
            <Popover placement="bottom-start">
              <Tooltip label="Cor do texto">
                <Box>
                  <PopoverTrigger>
                    <IconButton
                      aria-label="Cor do texto"
                      icon={
                        <Box position="relative">
                          <Palette />
                          <Box
                            position="absolute"
                            bottom="-2px"
                            right="-2px"
                            w="8px"
                            h="8px"
                            borderRadius="full"
                            bg={editor.getAttributes('textStyle').color || 'currentColor'}
                            border="1px solid"
                            borderColor="gray.200"
                          />
                        </Box>
                      }
                      variant="ghost"
                      size="sm"
                    />
                  </PopoverTrigger>
                </Box>
              </Tooltip>
              <PopoverContent w="auto">
                <PopoverBody>
                  <SimpleGrid columns={5} spacing={2}>
                    {COLORS.map(color => (
                      <Box
                        key={color}
                        w="24px"
                        h="24px"
                        bg={color}
                        borderRadius="sm"
                        cursor="pointer"
                        onClick={() => editor.chain().focus().setColor(color).run()}
                        border={editor.getAttributes('textStyle').color === color ? '2px solid' : '1px solid'}
                        borderColor={editor.getAttributes('textStyle').color === color ? 'brand.500' : 'gray.200'}
                        _hover={{ transform: 'scale(1.1)' }}
                      />
                    ))}
                  </SimpleGrid>
                </PopoverBody>
              </PopoverContent>
            </Popover>

            <Popover placement="bottom-start">
              <Tooltip label="Destacar texto">
                <Box>
                  <PopoverTrigger>
                    <IconButton
                      aria-label="Destacar texto"
                      icon={
                        <Box position="relative">
                          <PaintBrush />
                          <Box
                            position="absolute"
                            bottom="-2px"
                            right="-2px"
                            w="8px"
                            h="8px"
                            borderRadius="full"
                            bg={editor.getAttributes('highlight').color || 'transparent'}
                            border="1px solid"
                            borderColor="gray.200"
                          />
                        </Box>
                      }
                      variant="ghost"
                      size="sm"
                    />
                  </PopoverTrigger>
                </Box>
              </Tooltip>
              <PopoverContent w="auto">
                <PopoverBody>
                  <SimpleGrid columns={5} spacing={2}>
                    {HIGHLIGHT_COLORS.map((color) => (
                      <Box
                        key={color}
                        w="24px"
                        h="24px"
                        bg={color === 'transparent' ? 'white' : color}
                        borderRadius="sm"
                        cursor="pointer"
                        onClick={() => {
                          if (color === 'transparent') {
                            editor.chain().focus().unsetHighlight().run()
                          } else {
                            editor.chain().focus().toggleHighlight({ color }).run()
                          }
                        }}
                        border={editor.getAttributes('highlight').color === color ? '2px solid' : '1px solid'}
                        borderColor={editor.getAttributes('highlight').color === color ? 'brand.500' : 'gray.200'}
                        _hover={{ transform: 'scale(1.1)' }}
                        position="relative"
                      >
                        {color === 'transparent' && (
                          <Box
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                            fontSize="lg"
                            color="red.500"
                            fontWeight="bold"
                          >
                            ×
                          </Box>
                        )}
                      </Box>
                    ))}
                  </SimpleGrid>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </ButtonGroup>

          <Divider orientation="vertical" h="24px" alignSelf="center" />

          {/* Alinhamento */}
          <ButtonGroup spacing={1}>
            <Tooltip label="Alinhar à esquerda">
              <IconButton
                aria-label="Alinhar à esquerda"
                icon={<TextAlignLeft />}
                variant="ghost"
                size="sm"
                isActive={editor.isActive({ textAlign: 'left' })}
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
              />
            </Tooltip>
            <Tooltip label="Centralizar">
              <IconButton
                aria-label="Centralizar"
                icon={<TextAlignCenter />}
                variant="ghost"
                size="sm"
                isActive={editor.isActive({ textAlign: 'center' })}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
              />
            </Tooltip>
            <Tooltip label="Alinhar à direita">
              <IconButton
                aria-label="Alinhar à direita"
                icon={<TextAlignRight />}
                variant="ghost"
                size="sm"
                isActive={editor.isActive({ textAlign: 'right' })}
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
              />
            </Tooltip>
            <Tooltip label="Justificar">
              <IconButton
                aria-label="Justificar"
                icon={<TextAlignJustify />}
                variant="ghost"
                size="sm"
                isActive={editor.isActive({ textAlign: 'justify' })}
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              />
            </Tooltip>
          </ButtonGroup>

          <Divider orientation="vertical" h="24px" alignSelf="center" />

          {/* Listas */}
          <ButtonGroup spacing={1}>
            <Tooltip label="Lista com marcadores">
              <IconButton
                aria-label="Lista com marcadores"
                icon={<ListBullets />}
                variant="ghost"
                size="sm"
                isActive={editor.isActive('bulletList')}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              />
            </Tooltip>
            <Tooltip label="Lista numerada">
              <IconButton
                aria-label="Lista numerada"
                icon={<ListNumbers />}
                variant="ghost"
                size="sm"
                isActive={editor.isActive('orderedList')}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              />
            </Tooltip>
            <Tooltip label="Lista de tarefas">
              <IconButton
                aria-label="Lista de tarefas"
                icon={<ListChecks />}
                variant="ghost"
                size="sm"
                isActive={editor.isActive('taskList')}
                onClick={() => editor.chain().focus().toggleTaskList().run()}
              />
            </Tooltip>
          </ButtonGroup>

          <Divider orientation="vertical" h="24px" alignSelf="center" />

          <ButtonGroup spacing={1}>
            <Tooltip label="Título">
              <IconButton
                aria-label="Título"
                icon={<TextH />}
                variant="ghost"
                size="sm"
                isActive={editor.isActive('heading')}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              />
            </Tooltip>
            <Tooltip label="Citação">
              <IconButton
                aria-label="Citação"
                icon={<Quotes />}
                variant="ghost"
                size="sm"
                isActive={editor.isActive('blockquote')}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
              />
            </Tooltip>
          </ButtonGroup>

          <Divider orientation="vertical" h="24px" alignSelf="center" />

          <ButtonGroup spacing={1}>
            <Tooltip label="Adicionar link">
              <IconButton
                aria-label="Adicionar link"
                icon={<LinkIcon />}
                variant="ghost"
                size="sm"
                onClick={setLink}
                isActive={editor.isActive('link')}
              />
            </Tooltip>
            <Tooltip label="Adicionar imagem">
              <IconButton
                aria-label="Adicionar imagem"
                icon={<ImageIcon />}
                variant="ghost"
                size="sm"
                onClick={addImage}
              />
            </Tooltip>
            <Tooltip label="Código">
              <IconButton
                aria-label="Código"
                icon={<Code />}
                variant="ghost"
                size="sm"
                isActive={editor.isActive('code')}
                onClick={() => editor.chain().focus().toggleCode().run()}
              />
            </Tooltip>
          </ButtonGroup>
        </ButtonGroup>
      </Box>

      {/* Box do contador de tarefas */}
      {taskCount.total > 0 && (
        <Box
          w="100%"
          p={2}
          borderBottom="1px"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          bg={useColorModeValue('purple.50', 'purple.900')}
          color={useColorModeValue('purple.700', 'purple.200')}
          fontSize="sm"
          fontWeight="medium"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <ListChecks weight="bold" />
          <Text>
            {taskCount.completed} de {taskCount.total} {taskCount.total === 1 ? 'tarefa concluída' : 'tarefas concluídas'}
          </Text>
        </Box>
      )}

      {/* Área do editor */}
      <Box 
        p={isMobile ? 2 : 4}
        bg={bgColor}
        overflowY="auto"
        h={taskCount.total > 0 ? "calc(100% - 88px)" : "calc(100% - 48px)"}
        position="relative"
      >
        <Box
          sx={{
            '.ProseMirror': {
              outline: 'none',
              minH: isMobile ? '200px' : '300px',
              position: 'relative',
              '&.is-editor-empty:first-of-type::before': {
                content: 'attr(data-placeholder)',
                float: 'left',
                color: 'gray.400',
                pointerEvents: 'none',
                height: 0,
                fontStyle: 'italic',
                position: 'absolute',
                top: 0,
                left: 0,
              },
              '& p': {
                minH: '1.5em'
              },
              '& ul[data-type="taskList"]': {
                listStyle: 'none',
                padding: 0,
                margin: '0.5em 0',
                '& li': {
                  display: 'flex',
                  marginBottom: '0.5em',
                  position: 'relative',
                  paddingLeft: '1.5em',
                  '& > label': {
                    userSelect: 'none',
                    cursor: 'pointer',
                    position: 'absolute',
                    left: 0,
                    top: '0.25em',
                    width: '1em',
                    height: '1em',
                    opacity: 0,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '0.25em',
                    width: '1em',
                    height: '1em',
                    border: '1.5px solid',
                    borderColor: 'purple.400',
                    borderRadius: '50%',
                    transition: 'all 0.2s',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                  },
                  '&[data-checked="true"]': {
                    '&::before': {
                      backgroundColor: 'purple.400',
                      borderColor: 'purple.400',
                    },
                    '& > div': {
                      color: 'gray.400',
                      textDecoration: 'line-through',
                      textDecorationColor: 'gray.300',
                      textDecorationThickness: '1px',
                    },
                  },
                  '& > div': {
                    flex: 1,
                    transition: 'all 0.2s',
                    marginLeft: '0.5em',
                  },
                  '& ul': {
                    marginTop: '0.5em',
                    marginLeft: '1.5em',
                  },
                },
              },
              '& ul.bullet-list': {
                listStyle: 'none',
                padding: 0,
                margin: '0.5em 0',
                '& li.list-item': {
                  position: 'relative',
                  paddingLeft: '1.5em',
                  marginBottom: '0.3em',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: '0.4em',
                    top: '0.7em',
                    width: '6px',
                    height: '6px',
                    backgroundColor: 'gray.500',
                    borderRadius: '50%',
                  },
                  '& ul li.list-item': {
                    '&::before': {
                      backgroundColor: 'transparent',
                      border: '1px solid',
                      borderColor: 'gray.500',
                    },
                    '& ul li.list-item': {
                      '&::before': {
                        borderRadius: '0',
                        backgroundColor: 'gray.500',
                        border: 'none',
                      },
                    },
                  },
                  '& ul': {
                    margin: 0,
                    marginLeft: '2em',
                  },
                },
              },
              '& ol.ordered-list': {
                listStyle: 'none',
                padding: 0,
                margin: '0.5em 0',
                counterReset: 'item',
                '& li': {
                  position: 'relative',
                  paddingLeft: '2em',
                  marginBottom: '0.3em',
                  counterIncrement: 'item',
                  '&::before': {
                    content: 'counter(item) "."',
                    position: 'absolute',
                    left: '0.4em',
                    color: 'gray.500',
                    fontWeight: 'normal',
                  },
                  '& ol': {
                    margin: 0,
                    paddingLeft: '2em',
                    counterReset: 'subitem',
                    '& li': {
                      counterIncrement: 'subitem',
                      '&::before': {
                        content: 'counter(item, lower-alpha) "."',
                      },
                      '& ol': {
                        paddingLeft: '2em',
                        '& li::before': {
                          content: 'counter(item, lower-roman) "."',
                        },
                      },
                    },
                  },
                },
              },
            }
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Box>
    </Box>
  )
} 