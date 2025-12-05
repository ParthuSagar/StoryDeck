import React, { useState } from 'react'
import { Box, Container } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar/index'
import Header from '../components/Header'
import BottomNavMobile from '../components/BottomNavMobile'

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex', 
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <Box
        sx={{
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <Container maxWidth="xxl" sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 0 }}>

          {/* Main Content Area - Outlet for nested routes */}
          <Box
            component="main"
            sx={{
              flex: 1, 
              overflowY: 'auto',
              overflowX: 'hidden',
              p: 0,
              m: 0,
              // Custom Scrollbar styles
              '&::-webkit-scrollbar': { width: '0px' },
              '&::-webkit-scrollbar-track': { background: 'none' },
              '&::-webkit-scrollbar-thumb': {
                background: 'none',
                borderRadius: '4px',
                '&:hover': { background: 'none'},
              },
            }}
          >
            <Outlet />
          </Box>
        </Container>
      </Box>
      <BottomNavMobile />
    </Box>
  )
}

export default MainLayout