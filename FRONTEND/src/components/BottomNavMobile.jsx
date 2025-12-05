import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    useTheme as useMuiTheme,
    useMediaQuery,
    Avatar
} from '@mui/material';
import {
  Home11Icon,
  MessengerIcon,
  AccountSetting03Icon,
} from "hugeicons-react";
import { useTheme } from '../hooks/useTheme'; // Assuming you have a useTheme hook

// Define the navigation items matching the image icons/labels
const bottomNavItems = [
    { label: 'Home', icon: Home11Icon, path: '/home' }, // Using a generic profile path
    { label: 'Chats', icon: MessengerIcon, path: '/chats' },
    { label: 'Profile', icon: AccountSetting03Icon, path: '/settings' },
];

const BottomNavMobile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
    const { isDarkMode } = useTheme();

    // Function to determine if an item is active
    const getIsActive = (path) => location.pathname === path;

    // Render this component only on mobile screens
    if (!isMobile) {
        return null;
    }


    return (
        <Box
            sx={{
                // Fixed positioning at the bottom center
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1100, // Above content, below high z-index modals

                // Ensures content doesn't get hidden under the navigation bar
                paddingBottom: muiTheme.spacing(1.5),

                // Background and rounded box style matching the image
                backgroundColor: 'transparent',
                display: 'flex',
                justifyContent: 'center',

                // This box holds the rounded content container
                pointerEvents: 'none', // Allows clicking through the transparent container background
            }}
        >
            <Box
                sx={{
                    pointerEvents: 'auto', // Re-enable pointer events for the items
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    height: 70, // Height of the nav bar container

                    // Styling for the floating card effect (matching the image)
                    width: '100%',
                    maxWidth: 600,
                    borderRadius: '35px',
                    backgroundColor: 'background.paper',
                    border: `1px solid ${muiTheme.palette.divider}`,
                }}
            >
                {bottomNavItems.map((item) => {
                    const isActive = getIsActive(item.path);
                    const IconComponent = item.icon;

                    // Determine color based on active state
                    const iconColor = isActive ? muiTheme.palette.primary.main : muiTheme.palette.text.primary;
                    

                    return (
                        <Box
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexGrow: 1,
                                cursor: 'pointer',
                                p: 0.5,
                                transition: 'color 0.2s ease',
                            }}
                        >
                            {/* Active Tab Indicator (the small blue line above "Bookmark" in the image) */}
                            <Box
                                sx={{
                                    height: '2px',
                                    width: '15%',
                                    backgroundColor: isActive ? muiTheme.palette.primary.main : 'transparent',
                                    borderRadius: '10%',
                                    position: 'absolute',
                                    top: 0,
                                    transition: 'background-color 0.2s ease',
                                }}
                            />

                            {/* Icon */}
                            <IconComponent size={26} color={iconColor} strokeWidth={isActive ? 2 : 1.5} />

                            {/* Label */}
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: isActive ? 600 : 500,
                                    color: iconColor,
                                    mt: 0.5,
                                    transition: 'color 0.2s ease',
                                    whiteSpace: 'nowrap',
                                    letterSpacing : 1
                                }}
                            >
                                {item.label}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default BottomNavMobile;