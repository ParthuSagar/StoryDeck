import React, { useState, useEffect } from 'react'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme as useMuiTheme,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  Divider
} from '@mui/material'
import { useTheme } from '../hooks/useTheme'
import Logo from '../assets/StoryDeck.svg'
import {
  Sun02Icon,
  GibbousMoonIcon,
  MessengerIcon,
  Notification01Icon,
  UserMultipleIcon,
  AccountSetting03Icon,
  InformationDiamondIcon,
  Logout04Icon
} from "hugeicons-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../api/axiosInstance';
import { useToast } from '../components/Toast/useToast';

const Header = ({ userName = 'Abhinav Khare' }) => {
  const { isDarkMode, toggleTheme } = useTheme()
  const { showError, showSuccess } = useToast();
  const muiTheme = useMuiTheme()
  const navigate = useNavigate();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'))
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [userData, setUserData] = useState();
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  
  const handleLogout = async () => {
    try {
      // Clear local storage or any other necessary cleanup
      const tokens = JSON.parse(localStorage.getItem("authTokens") || "{}");
      const refreshToken = tokens.refresh;
      
      const response = await axiosInstance.post('/api/auth/logout', { refreshToken });
      if (response.status === 200) {
        localStorage.clear();
        showSuccess("Logged out successfully");
        
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }
    } catch (err) {
      console.error("Logout error:", err);
      showError("Error logging out. Please try again.");
    }
  }

  const handleChatPage = () => {
      navigate('/chats');
  }
  
  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
      }
    } catch (err) {
      console.error("Error retrieving user data in Sidebar:", err);
    }
  }, []);
  return (
    <AppBar
      position="sticky"
      sx={{
        width: '100%',
        backgroundColor: 'background.default',
        backgroundImage: 'none',
        elevation: 0,
        '--Paper-shadow0': 'none',
        boxShadow: 'none',
        borderBottom: { xs: 'none', sm: `0px solid ${muiTheme.palette.divider}`, md: `0px solid ${muiTheme.palette.divider}` },
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          paddingX: isMobile ? 1 : 3,
        }}
      >
        {/* Left Section - Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isMobile && (
            <>
              <img src={Logo} alt='StoryDeck' width={30} />
              <Typography sx={{ fontSize: 20, fontWeight: 500, ml: 0, color: 'error.main' }}>
                STORYDECK
              </Typography>
            </>
          )}
        </Box>

        {/* Right Section - Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Notification IconButton */}
          <Tooltip title='Notification'>
            <IconButton>
              <Badge color='error' variant='dot' >
                <Notification01Icon size={21} strokeWidth={2} />
              </Badge>
            </IconButton>
          </Tooltip>
          {/* Messganers IconButton */}
          <Tooltip title='Messages'>
            <IconButton onClick={handleChatPage}>
              <Badge color='error' variant='dot'>
                <MessengerIcon size={21} strokeWidth={2} />
              </Badge>
            </IconButton>
          </Tooltip>
          {/* Theme Toggle */}
          <Tooltip title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                display: { xs: 'none', sm: 'none', md: 'block' },
                mt: 1,
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'rotate(20deg)' },
              }}
            >
              {isDarkMode ? <Sun02Icon size={21} strokeWidth={2} /> : <GibbousMoonIcon size={21} strokeWidth={2} />}
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              display: { xs: 'none', sm: 'none', md: 'block' },
              padding: 0,
              ml: 0,
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                color: isDarkMode ? '#424242' : '#fff',
                backgroundColor: 'primary.main',
                fontSize: 20,
                letterSpacing: 0.5,
                fontFamily: 'monospace',
                cursor: 'pointer',
              }}
              src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
            >
              {userName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </Avatar>
          </IconButton>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            elevation={0}
            slotProps={{
              paper: {
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                  padding: 1.2,
                  '& .MuiAvatar-root': {
                    width: 42,
                    height: 42,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleMenuClose} sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    color: isDarkMode ? '#424242' : '#fff',
                    backgroundColor: 'primary.main',
                    fontSize: 20,
                    letterSpacing: 0,
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    mr: 0,
                  }}
                  src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
                >
                  {userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </Avatar>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{
                    fontSize: 15
                  }}>
                    {userData ? `${userData.name}` : 'Guest User'}
                  </Typography>
                  <Typography fontSize={13} color="text.secondary">{userData ? `${userData.username}` : 'Guest@User800'}</Typography>
                </Box>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
              <UserMultipleIcon size={22} style={{ marginRight: 20 }} />
              <Typography sx={{
                fontSize: 15
              }}>Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
              <AccountSetting03Icon size={22} style={{ marginRight: 20 }} />
              <Typography sx={{
                fontSize: 15
              }}>Account Settings</Typography>
            </MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
              <InformationDiamondIcon size={22} style={{ marginRight: 20 }} />
              <Typography sx={{
                fontSize: 15
              }}>Help</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main', p: 1, display: 'flex', alignItems: 'center' }}>
              <Logout04Icon size={22} style={{ marginRight: 20 }} />
              <Typography sx={{
                fontSize: 15
              }}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
