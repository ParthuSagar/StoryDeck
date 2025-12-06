const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const messagesRoutes = require('./routes/messages');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// -----------------------------
// ✅ SAFE CORS ORIGIN ARRAY
// -----------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "https://story-deck-black.vercel.app"
];

// -----------------------------
// ✅ CORS FIX (GLOBAL)
// -----------------------------
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowedOrigins.includes(req.headers.origin) ? req.headers.origin : "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Also apply cors() middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o))) {
      return callback(null, true);
    }
    console.log("❌ CORS BLOCKED:", origin);
    return callback(new Error("CORS blocked: " + origin));
  },
  credentials: true
}));

// -----------------------------
app.use(express.json());

// API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/messages', messagesRoutes);

// -----------------------------
// MongoDB Connection
// -----------------------------
const MONGO = process.env.MONGO_URI;

if (!MONGO) {
  console.error("❌ ERROR: MONGO_URI missing in .env");
  process.exit(1);
}

mongoose.connect(MONGO)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

// -----------------------------
// SOCKET.IO SETUP
// -----------------------------
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// Store online users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("setup", (userId) => {
    if (!userId) return;
    socket.join(userId);
    onlineUsers.set(userId, socket.id);

    io.emit("userOnline", { userId, socketId: socket.id });
    socket.emit("connected");

    console.log(`🔵 User ${userId} online`);
  });

  socket.on("sendMessage", ({ from, to, text }) => {
    if (to) {
      io.to(to).emit("messageReceived", { from, to, text, createdAt: new Date() });
      console.log(`💬 Message from ${from} → ${to}`);
    }
  });

  socket.on("messageRead", ({ messageId, from }) => {
    io.to(from).emit("messageReadNotification", { messageId, readAt: new Date() });
  });

  socket.on("typing", ({ from, to }) => {
    io.to(to).emit("userTyping", { from });
  });

  socket.on("typingStop", ({ from, to }) => {
    io.to(to).emit("userStoppedTyping", { from });
  });

  socket.on("disconnect", () => {
    for (const [userId, sid] of onlineUsers.entries()) {
      if (sid === socket.id) {
        onlineUsers.delete(userId);
        io.emit("userOffline", { userId });
        console.log(`🔴 User ${userId} offline`);
        break;
      }
    }
  });
});

// -----------------------------
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
