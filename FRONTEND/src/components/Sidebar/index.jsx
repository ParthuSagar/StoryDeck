import React, { useState, useEffect } from 'react'; // Added explicit React import for best practice
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import { useTheme } from '../../hooks/useTheme';
import Logo from '../../assets/StoryDeck.svg'
import {
  Home11Icon,
  MessengerIcon,
  AccountSetting03Icon,
  PlusSignIcon,
  Logout01Icon,
} from "hugeicons-react";
import axiosInstance from '../../api/axiosInstance';
import { useToast } from '../Toast/useToast';

// Define constants
const SIDEBAR_WIDTH = 320;
const MOBILE_DRAWER_WIDTH = 320;

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const muiTheme = useMuiTheme();
  const { showError , showSuccess} = useToast();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [userData, setUserData] = useState();


  const menuItems = [
    { label: 'Home', icon: Home11Icon, path: '/home' },
    { label: 'Chats', icon: MessengerIcon, path: '/chats' },
    { label: 'Settings', icon: AccountSetting03Icon, path: '/settings' },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

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

  const sidebarContent = (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
        p: 1.5,
        m: 0,
        // Custom scrollbar styles for cleanliness
        '&::-webkit-scrollbar': { width: '0px' },
        '&::-webkit-scrollbar-track': { background: 'none' },
        '&::-webkit-scrollbar-thumb': {
          background: 'none',
          borderRadius: '4px',
          '&:hover': { background: 'none' },
        },
      }}
    >
      {/* Header Section (Logo/App Name) */}
      <Box
        sx={{
          width: '100%',
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <img src={Logo} alt='StoryDeck' width={30} />
        <Box sx={{
          display: 'flex'
        }}>
          <Typography sx={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
            fontSize: 28
          }}>
            STORYDECK
          </Typography>
        </Box>
      </Box>

      {/* Menu Items and Profile Content */}
      <List sx={{ flex: 1, py: 1 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          mb: 3
        }}>
          {/* Profile Card */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            alignItems: 'center',
            gap: 0
          }}>
            <Avatar alt="Remy Sharp" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" sx={{ width: 90, height: 90 }} />
            <Typography sx={{
              fontSize: 20,
              fontWeight: 500,
              mt: 1
            }}>
              {userData?.name || 'Guest User'}
            </Typography>
            <Typography sx={{
              fontSize: 14,
              fontWeight: 500,
              color: 'text.secondary'
            }}>
              {userData?.username || 'Guest@User800'}
            </Typography>
          </Box>

          {/* Stats Section */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            mt: 2,
            gap: 0.5,
            justifyContent: 'space-around'
          }}>
            {/* POSTS */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignContent: 'center',
              alignItems: 'center',
              p: 1,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                right: -2,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1px',
                height: '70%',
                bgcolor: 'divider', // Changed to divider for theme consistency
              },
            }}>
              <Typography sx={{
                fontSize: 16,
                fontWeight: 500
              }}>
                {userData ? (userData.postsCount ?? '0') : '0'}
              </Typography>
              <Typography>
                POSTS
              </Typography>
            </Box>
            {/* FOLLOWERS */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignContent: 'center',
              alignItems: 'center',
              p: 1,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                right: -2,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1px',
                height: '70%',
                bgcolor: 'divider', // Changed to divider for theme consistency
              },
            }}>
              <Typography sx={{
                fontSize: 16,
                fontWeight: 500
              }}>
                {userData ? (userData.followersCount ?? '0') : '0'}
              </Typography>
              <Typography>
                FOLLOWERS
              </Typography>
            </Box>
            {/* FOLLOWING */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignContent: 'center',
              alignItems: 'center',
              p: 1
            }}>
              <Typography sx={{
                fontSize: 16,
                fontWeight: 500
              }}>
                {userData ? (userData.followingCount ?? '0') : '0'}
              </Typography>
              <Typography>
                FOLLOWING
              </Typography>
            </Box>
          </Box>

          {/* Bio Section */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'start',
            alignItems: 'start',
            mt: 2,
            p: 1
          }}>
            <Typography sx={{
              fontSize: 16,
              fontWeight: 500
            }}>
              {userData?.name || 'Guest User'}
            </Typography>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 1,
              mt: 1,
              alignItems: 'center' // Align vertical dividers with text
            }}>
              <Typography sx={{
                fontSize: 14,
                fontWeight: 400
              }}>
                UI Designer
              </Typography>
              <Divider orientation='vertical' flexItem />
              <Typography sx={{
                fontSize: 14,
                fontWeight: 400
              }}>
                Travel
              </Typography>
              <Divider orientation='vertical' flexItem />
              <Typography sx={{
                fontSize: 14,
                fontWeight: 400
              }}>
                Blogger
              </Typography>
            </Box>
          </Box>

          {/* Story Highlights Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              mt: 2,
              p: 1
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 500, mb: 1 }}>
              Story Highlights
            </Typography>

            {/* SCROLLABLE ROW */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2, // Increased gap for visual space
                mt: 1,
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                minWidth: 0,
                width: '100%',
                paddingBottom: 1,
                // Hide scrollbar for clean look
                '&::-webkit-scrollbar': { height: '0px' },
                scrollbarWidth: 'none',
              }}
            >
              {/* New Highlight */}
              <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 45, height: 45, bgcolor: 'action.hover' }}>
                  <PlusSignIcon size={20}  color='#424242'/>
                </Avatar>
                <Typography sx={{ fontSize: 12 }}>New</Typography>
              </Box>

              {/* Repeat items (Example data) */}
              {['U.K', 'BirthDate', 'Collage', 'Pets', 'Work'].map((label) => (
                <Box key={label} sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Avatar src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&h=500&fit=crop" sx={{ width: 45, height: 45 }} />
                  <Typography sx={{ fontSize: 12 }}>{label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Navigation Menu */}
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              // 🟢 FIX: Removed the 'button' prop to resolve the console warning.
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              sx={{
                mx: 1,
                mb: 1,
                borderRadius: 1,
                backgroundColor: isActive
                  ? isDarkMode
                    ? '#333333'
                    : '#f0f0f0'
                  : 'transparent',
                color: isActive ? 'primary.main' : 'text.primary',
                cursor: 'pointer', // Keep cursor pointer to indicate clickability
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: isDarkMode ? '#1f1f1f' : '#f5f5f5',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? 'primary.main' : 'inherit',
                  minWidth: 40,
                }}
              >
                <item.icon />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: isActive ? 500 : 400,
                  },
                }}
              />
            </ListItem>
          );
        })}
      </List>

      {/* Logout Button */}
      <Box sx={{ p: 1 }}>
        <ListItem
          // 🟢 FIX: Removed the 'button' prop here as well.
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: 'error.main',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: isDarkMode ? '#333333' : '#ffe0e0',
              transform: 'translateX(4px)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
            <Logout01Icon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </Box>
    </Box>
  );

  // Mobile Drawer
  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        // Setting PaperProps to apply styles directly to the drawer's content container
        PaperProps={{
          sx: {
            width: MOBILE_DRAWER_WIDTH,
          }
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  // Desktop Sidebar
  return (
    <Box
      component="aside"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        borderRight: `0px solid ${isDarkMode ? muiTheme.palette.divider : muiTheme.palette.grey[300]}`,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      {sidebarContent}
    </Box>
  );
};

export default Sidebar;