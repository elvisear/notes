import { Flex, Box, useColorModeValue } from '@chakra-ui/react'
import { Sidebar } from './Sidebar'
import { NotesList } from './NotesList'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'

export function Layout() {
  const [sidebarWidth, setSidebarWidth] = useState("240px")
  const bg = useColorModeValue('white', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Flex h="100vh" bg={bg}>
      {/* Sidebar */}
      <Box 
        position="fixed"
        left={0}
        top={0}
        h="100vh"
        w={sidebarWidth}
        transition="width 0.2s"
        zIndex={30}
        borderRight="1px"
        borderColor={borderColor}
        bg={bg}
      >
        <Sidebar onResize={(width) => setSidebarWidth(width)} />
      </Box>

      {/* Lista de Notas */}
      <Box 
        position="fixed"
        left={sidebarWidth}
        top={0}
        h="100vh"
        w="360px"
        transition="left 0.2s"
        zIndex={20}
        borderRight="1px"
        borderColor={borderColor}
        bg={bg}
        overflowY="auto"
      >
        <NotesList sidebarWidth={sidebarWidth} />
      </Box>

      {/* Área do Editor/Conteúdo */}
      <Box 
        position="fixed"
        left={`calc(${sidebarWidth} + 360px)`}
        top={0}
        right={0}
        h="100vh"
        transition="left 0.2s"
        bg={bg}
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#4A5568',
            borderRadius: '24px',
          },
        }}
      >
        <Outlet />
      </Box>
    </Flex>
  )
} 