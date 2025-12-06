import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Typography,
    useTheme as useMuiTheme,
    useMediaQuery,
} from "@mui/material";

import {
    Home11Icon,
    MessengerIcon,
    AccountSetting03Icon,
} from "hugeicons-react";

import { useTheme } from "../hooks/useTheme";

const bottomNavItems = [
    { label: "Home", icon: Home11Icon, path: "/home" },
    { label: "Chats", icon: MessengerIcon, path: "/chats" },
    { label: "Profile", icon: AccountSetting03Icon, path: "/settings" },
];

const BottomNavMobile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
    const { isDarkMode } = useTheme();

    if (!isMobile) return null;

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 20,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                zIndex: 1200,
                pointerEvents: "none",
            }}
        >
            <Box
                className="bottom-nav-container"
                sx={{
                    pointerEvents:"painted",
                    width: "92%",
                    maxWidth: 420,
                    cursor: "pointer",
                    backgroundColor: isDarkMode ? "#0E0E0E" : "rgba(255,255,255,0.85)",
                    padding: "25px 1px",
                    borderRadius: "40px",
                    display: "flex",
                    justifyContent: "center",
                    boxShadow:
                        isDarkMode
                            ? "0 8px 25px rgba(255,255,255,0.08)"
                            : "0 8px 25px rgba(0,0,0,0.18)",
                    backdropFilter: "blur(40px)",
                    border: isDarkMode ? "4px solid #222" : "4px solid #ddd",
                    transition: "background-color 0.10s ease",
                }}
            >
                {bottomNavItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Box
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className="nav-item"
                            sx={{
                                flex: 1,
                                mx: 1,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                            }}
                        >
                            {/* Animated pill */}
                            <Box
                                className="active-pill"
                                sx={{
                                    position: "absolute",
                                    width: isActive ? "85%" : "0%",
                                    height: isActive ? "44px" : "0px",
                                    backgroundColor: isDarkMode ? "#fff" : "#0E0E0E",
                                    borderRadius: "30px",
                                    transition: "all 0.50s cubic-bezier(.4,0,.2,1)",
                                    zIndex: 1,
                                }}
                            />

                            {/* Icon + Text */}
                            <Box
                                className="nav-item-content"
                                sx={{
                                    position: "relative",
                                    zIndex: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: isActive ? "10px" : "0px",
                                    px: isActive ? "12px" : "0px",
                                    transition: "all 0.35s",
                                    transform: isActive ? "scale(1.05)" : "scale(1)",
                                }}
                            >
                                <Icon
                                    size={24}
                                    className={isActive ? "icon-active" : "icon-default"}
                                    color={
                                        isActive
                                            ? isDarkMode
                                                ? "#000"
                                                : "#fff"
                                            : isDarkMode
                                            ? "#e6e6e6"
                                            : "#555"
                                    }
                                    strokeWidth={1.9}
                                />

                                {isActive && (
                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: isDarkMode ? "#000" : "#fff",
                                            letterSpacing: 0.3,
                                            opacity: 1,
                                            transition: "opacity 0.25s",
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default BottomNavMobile;
