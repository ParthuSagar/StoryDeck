import React, { useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SendIcon from "@mui/icons-material/Send";

const MotionBox = motion(Box);

const chatList = [
  { id: 1, name: "Priya Sharma", msg: "Hey! How are you?", img: "/img/u1.jpg" },
  { id: 2, name: "John Carter", msg: "Let's meet tomorrow", img: "/img/u2.jpg" },
  { id: 3, name: "Anisha Patel", msg: "Did you see my post? 😍", img: "/img/u3.jpg" },
  { id: 4, name: "Rahul Verma", msg: "Send me the files", img: "/img/u4.jpg" },
  { id: 5, name: "Emily Rose", msg: "What's up!", img: "/img/u5.jpg" },
  { id: 6, name: "Kunal", msg: "Bro check this reel", img: "/img/u6.jpg" },
  { id: 7, name: "Simran", msg: "Good morning ☀️", img: "/img/u7.jpg" },
  { id: 8, name: "Dev", msg: "Call me asap", img: "/img/u8.jpg" },
  { id: 9, name: "Neha Gupta", msg: "❤️❤️❤️", img: "/img/u9.jpg" },
  { id: 10, name: "Sahil", msg: "You free?", img: "/img/u10.jpg" },
  { id: 11, name: "Julia", msg: "Hi!", img: "/img/u11.jpg" },
  { id: 12, name: "Ravi", msg: "Bro help", img: "/img/u12.jpg" },
  { id: 13, name: "Aditi", msg: "Send photo", img: "/img/u13.jpg" },
  { id: 14, name: "Ankur", msg: "Reaching home", img: "/img/u14.jpg" },
  { id: 15, name: "Rose", msg: "I miss you 😘", img: "/img/u15.jpg" },
  { id: 16, name: "Meera", msg: "Typing…", img: "/img/u16.jpg" },
  { id: 17, name: "Pooja", msg: "Call ?", img: "/img/u17.jpg" },
  { id: 18, name: "Aman", msg: "Check story", img: "/img/u18.jpg" },
  { id: 19, name: "David", msg: "Broooo 😂", img: "/img/u19.jpg" },
  { id: 20, name: "Sara", msg: "Send link", img: "/img/u20.jpg" },
];

const demoMessages = [
  { text: "Hey! How are you?", sender: "them" },
  { text: "I’m fine, what about you?", sender: "me" },
  { text: "Great! Working on a new project.", sender: "them" },
  { text: "Nice 🔥🔥", sender: "me" },
];

const Chats = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <Box sx={{ width: "100%", height: "100vh", bgcolor: "background.default" }}>
      {/* ----------------- CHAT LIST SCREEN ----------------- */}
      {!selectedChat && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" fontWeight={700} mb={2}>
            Chats
          </Typography>

          {chatList.map((chat) => (
            <MotionBox
              key={chat.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedChat(chat)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1.5,
                borderRadius: 2,
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
              }}
            >
              <Avatar src={chat.img} sx={{ width: 55, height: 55 }} />
              <Box>
                <Typography fontWeight={600}>{chat.name}</Typography>
                <Typography fontSize={14} color="text.secondary">
                  {chat.msg}
                </Typography>
              </Box>
            </MotionBox>
          ))}
        </Box>
      )}

      {/* ----------------- OPEN CHAT SCREEN ----------------- */}
      {selectedChat && (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              borderBottom: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <IconButton onClick={() => setSelectedChat(null)}>
              <ArrowBackIosNewIcon />
            </IconButton>
            <Avatar src={selectedChat.img} />
            <Typography fontWeight={600}>{selectedChat.name}</Typography>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {demoMessages.map((m, i) => (
              <MotionBox
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                sx={{
                  alignSelf: m.sender === "me" ? "flex-end" : "flex-start",
                  bgcolor: m.sender === "me" ? "#1976d2" : "#e0e0e0",
                  color: m.sender === "me" ? "#fff" : "#000",
                  p: 1.2,
                  px: 2,
                  borderRadius: 3,
                  maxWidth: "70%",
                }}
              >
                {m.text}
              </MotionBox>
            ))}
          </Box>

          {/* Input Box */}
          <Box
            sx={{
              p: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
              borderTop: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <TextField
              fullWidth
              placeholder="Message..."
              size="small"
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "25px",
                  bgcolor: "background.paper",
                },
              }}
            />
            <IconButton color="primary">
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Chats;
