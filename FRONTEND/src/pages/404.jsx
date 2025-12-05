import React from "react";
import { Box, Typography, Button } from "@mui/material";
import {
    RotateRight03Icon
} from "hugeicons-react";
export default function NotFound() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: 'background.default',
                textAlign: "center",
                px: 2,
            }}
        >
            {/* Large 404 Background Text */}
            <Typography
                sx={{
                    fontSize: { xs: 180, md: 250 },
                    fontWeight: 900,
                    color: "#dfe4ea",
                    position: "absolute",
                    top: "20%",
                    zIndex: 0,
                    userSelect: "none",
                }}
            >
                404
            </Typography>

            {/* Message */}
            <Typography
                sx={{
                    mt: 8,
                    fontSize: { xs: 20, md: 40 },
                    fontWeight: 500,
                    zIndex: 1,
                }}
            >
                So sorry, we couldn’t find what you were looking for...
            </Typography>

            {/* Back button */}
            <Button
                variant="contained"
                sx={{
                    mt: 3,
                    borderRadius: "25px",
                    px: 4,
                    py: 1,
                    color: '#f0f0f0',
                    backgroundColor: "#1a237e",
                    textTransform: "capitalize",
                    ":hover": { backgroundColor: "#000a4d" },
                }}
            >
                Back to the homepage →
            </Button>

            {/* Bottom Section */}
            <Box sx={{ mt: 10, textAlign: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 500, fontSize: 18 }}>
                    Start creating amazing chats, messages, and posts with STORYDECK today
                </Typography>

                <Button
                    variant="contained"
                    endIcon={<RotateRight03Icon size={20} color="#f0f0f0" />}
                    sx={{
                        mt: 3,
                        borderRadius: "25px",
                        px: 4,
                        py: 1,
                        color: '#f0f0f0',
                        backgroundColor: "#1a237e",
                        textTransform: "none",
                        ":hover": { backgroundColor: "#1a237e" },
                    }}
                >
                    Get Started
                </Button>
            </Box>
        </Box>
    );
}
