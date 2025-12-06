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


// Configure CORS for the frontend app (allow credentials and required methods/headers)
const CLIENT_ORIGIN  = [
  process.env.CLIENT_ORIGIN,
  process.env.CLIENT_ORIGIN_2
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || CLIENT_ORIGIN.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS BLOCKED:", origin);
        callback(new Error("CORS blocked: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// Enable preflight for all routes
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/messages', messagesRoutes);

// connect to MongoDB
const MONGO = process.env.MONGO_URI;

if (!MONGO) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(MONGO).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

// socket.io setup for realtime chat
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  }
});

// In-memory store for online users: { userId: socketId }
const onlineUsers = new Map();

// When a client connects, they should send a `setup` event with their userId to join a personal room.
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // User comes online
  socket.on('setup', (userId) => {
    if (!userId) return;
    socket.join(userId);
    onlineUsers.set(userId, socket.id);

    // Broadcast user online status
    io.emit('userOnline', { userId, socketId: socket.id });

    socket.emit('connected');
    console.log(`User ${userId} came online`);
  });

  // Send a message (will broadcast via socket and also save to DB via REST API)
  socket.on('sendMessage', (message) => {
    const { from, to, text } = message;
    if (to) {
      // Emit to recipient's room
      io.to(to).emit('messageReceived', { from, to, text, createdAt: new Date() });
      console.log(`Message from ${from} to ${to}`);
    }
  });

  // Mark message as read (real-time notification)
  socket.on('messageRead', (data) => {
    const { messageId, from, to } = data;
    // Notify sender that message was read
    io.to(from).emit('messageReadNotification', { messageId, readAt: new Date() });
    console.log(`Message ${messageId} marked as read`);
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { from, to } = data;
    if (to) {
      io.to(to).emit('userTyping', { from });
      console.log(`${from} is typing to ${to}`);
    }
  });

  // Stop typing
  socket.on('typingStop', (data) => {
    const { from, to } = data;
    if (to) {
      io.to(to).emit('userStoppedTyping', { from });
      console.log(`${from} stopped typing to ${to}`);
    }
  });

  // User goes offline
  socket.on('disconnect', () => {
    // Find and remove user from onlineUsers
    for (const [userId, sid] of onlineUsers.entries()) {
      if (sid === socket.id) {
        onlineUsers.delete(userId);
        // Broadcast user offline status
        io.emit('userOffline', { userId });
        console.log(`User ${userId} went offline`);
        break;
      }
    }
    console.log('Socket disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
