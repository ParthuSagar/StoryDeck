# StoryDeck Messaging System - Complete Feature Guide

This guide explains all messaging features: read/unread tracking, real-time updates, typing indicators, online/offline status, and relative timestamps.

---

## 1. Read/Unread System

### Overview
- Every message has two fields: `isRead` (boolean) and `readAt` (timestamp)
- When you open a conversation, unread messages from the other user are auto-marked as read
- You can manually mark individual messages or entire conversations as read

### Endpoints

#### Mark All Messages from a User as Read
```
PUT /api/messages/markAsRead/:userId
Headers: Authorization: Bearer <token>
Response: { success: true, updatedCount: 5 }
```
Marks all unread messages received from userId as read.

#### Mark a Single Message as Read
```
PUT /api/messages/:messageId/read
Headers: Authorization: Bearer <token>
Response: { success: true, msg: { _id, from, to, text, isRead: true, readAt: "2025-11-25T..." } }
```
Only the recipient can mark a message as read.

#### Get Unread Count
```
GET /api/messages/unread/count
Headers: Authorization: Bearer <token>
Response: { unreadCount: 3 }
```
Returns total unread messages for the current user across all conversations.

### Postman Example
1. GET unread count:
   - URL: {{baseUrl}}/api/messages/unread/count
   - Header: Authorization: Bearer {{token}}

2. Mark all from user as read:
   - Method: PUT
   - URL: {{baseUrl}}/api/messages/markAsRead/{{otherUserId}}
   - Header: Authorization: Bearer {{token}}

---

## 2. Chat History with Timestamps

### Overview
- Every message has `createdAt` (when sent) and `readAt` (when recipient read it)
- Relative time is auto-calculated (e.g., "2 minutes ago", "3 hours ago")
- Both absolute timestamps and relative times are returned

### API Responses Include

#### GET /api/messages/:userId (conversation history)
```json
[
  {
    "_id": "...",
    "from": { "_id": "...", "name": "Alice", "username": "alice_42", "avatarUrl": null },
    "to": { "_id": "...", "name": "Bob", "username": "bob_99", "avatarUrl": null },
    "text": "Hey, how are you?",
    "isRead": true,
    "readAt": "2025-11-25T10:05:30.000Z",
    "createdAt": "2025-11-25T10:05:10.000Z",
    "sentAgo": "5 minutes ago",
    "readAgo": "2 minutes ago"
  }
]
```

#### GET /api/messages/conversations (conversation list)
```json
[
  {
    "user": { "_id": "...", "name": "Alice", "username": "alice_42", "avatarUrl": null },
    "lastMessage": {
      "_id": "...",
      "text": "See you tomorrow!",
      "isRead": true,
      "createdAt": "2025-11-25T10:05:10.000Z",
      "readAt": "2025-11-25T10:05:30.000Z",
      "sentAgo": "3 hours ago",
      "readAgo": "3 hours ago"
    },
    "unreadCount": 0
  }
]
```

### Relative Time Format
```
0-59 seconds:   "45s ago"
1-59 minutes:   "23m ago"
1-23 hours:     "5h ago"
1-6 days:       "3d ago"
1-4 weeks:      "2w ago"
5+ weeks:       "8mo ago"
```

---

## 3. Real-Time Messaging with Socket.io

### Overview
- Client connects with user id and joins a personal room
- Messages, read receipts, typing status, and online/offline events broadcast in real-time
- Both send via REST API and receive via socket

### Socket Events

#### Client → Server Events

**`setup`** - User comes online
```javascript
socket.emit('setup', userId);
// Server responds with 'connected' when ready
socket.on('connected', () => console.log('Ready for real-time events'));
```

**`sendMessage`** - Send a message (broadcast to recipient's room)
```javascript
socket.emit('sendMessage', {
  from: "userId123",
  to: "userId456",
  text: "Hello there!"
});
```

**`messageRead`** - Notify sender that message was read
```javascript
socket.emit('messageRead', {
  messageId: "msgId789",
  from: "senderUserId",
  to: "receiverUserId"
});
```

**`typing`** - Notify recipient that you're typing
```javascript
socket.emit('typing', {
  from: "userId123",
  to: "userId456"
});
```

**`typingStop`** - Notify recipient that you stopped typing
```javascript
socket.emit('typingStop', {
  from: "userId123",
  to: "userId456"
});
```

#### Server → Client Events

**`messageReceived`** - New message arrived
```javascript
socket.on('messageReceived', (message) => {
  console.log('New message:', message);
  // message: { from, to, text, createdAt }
});
```

**`messageReadNotification`** - Message was read by recipient
```javascript
socket.on('messageReadNotification', (data) => {
  console.log('Message read:', data);
  // data: { messageId, readAt }
});
```

**`userTyping`** - Other user is typing
```javascript
socket.on('userTyping', (data) => {
  console.log(`${data.from} is typing...`);
  // Show "typing..." indicator
});
```

**`userStoppedTyping`** - Other user stopped typing
```javascript
socket.on('userStoppedTyping', (data) => {
  console.log(`${data.from} stopped typing`);
  // Remove typing indicator
});
```

**`userOnline`** - User came online
```javascript
socket.on('userOnline', (data) => {
  console.log(`User ${data.userId} is now online`);
  // Update user status to green/online
});
```

**`userOffline`** - User went offline
```javascript
socket.on('userOffline', (data) => {
  console.log(`User ${data.userId} is now offline`);
  // Update user status to gray/offline
});
```

### Client Implementation Example (JavaScript)

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');
const currentUserId = 'userId123';

// Connect and set up user
socket.emit('setup', currentUserId);
socket.on('connected', () => {
  console.log('Connected to real-time messaging');
});

// Send a message
function sendMessage(toUserId, text) {
  socket.emit('sendMessage', {
    from: currentUserId,
    to: toUserId,
    text
  });
}

// Receive a message
socket.on('messageReceived', (message) => {
  console.log('Message received:', message);
  addMessageToChat(message);
});

// Mark as read
function markAsRead(messageId, fromUserId) {
  socket.emit('messageRead', {
    messageId,
    from: fromUserId,
    to: currentUserId
  });
}

// Listen for read notifications
socket.on('messageReadNotification', (data) => {
  console.log('Message read at:', data.readAt);
  updateMessageStatus(data.messageId, 'read');
});

// Typing indicators
function notifyTyping(toUserId) {
  socket.emit('typing', { from: currentUserId, to: toUserId });
}

function notifyStoppedTyping(toUserId) {
  socket.emit('typingStop', { from: currentUserId, to: toUserId });
}

socket.on('userTyping', (data) => {
  showTypingIndicator(data.from);
});

socket.on('userStoppedTyping', (data) => {
  hideTypingIndicator(data.from);
});

// Online/Offline status
socket.on('userOnline', (data) => {
  updateUserStatus(data.userId, 'online');
});

socket.on('userOffline', (data) => {
  updateUserStatus(data.userId, 'offline');
});

// Disconnect gracefully
window.addEventListener('beforeunload', () => {
  socket.disconnect();
});
```

---

## 4. Typing Indicators

### How It Works
1. User starts typing → client emits `typing` event
2. Recipient receives `userTyping` event → shows "typing..." indicator
3. User stops typing (pause 500ms, or explicitly) → client emits `typingStop`
4. Recipient receives `userStoppedTyping` → removes indicator

### Client Implementation (React Example)

```javascript
import { useState } from 'react';

function ChatInput({ recipientId, socket, currentUserId }) {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  let typingTimeout;

  const handleChange = (e) => {
    setText(e.target.value);

    // Emit typing if not already
    if (!isTyping) {
      socket.emit('typing', { from: currentUserId, to: recipientId });
      setIsTyping(true);
    }

    // Clear existing timeout
    clearTimeout(typingTimeout);

    // Emit stop typing after 500ms of inactivity
    typingTimeout = setTimeout(() => {
      socket.emit('typingStop', { from: currentUserId, to: recipientId });
      setIsTyping(false);
    }, 500);
  };

  const handleSend = () => {
    if (text.trim()) {
      socket.emit('sendMessage', {
        from: currentUserId,
        to: recipientId,
        text
      });
      // Also save via REST API
      fetch('/api/messages', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: recipientId, text })
      });
      setText('');
      socket.emit('typingStop', { from: currentUserId, to: recipientId });
      setIsTyping(false);
    }
  };

  return (
    <div>
      <input value={text} onChange={handleChange} placeholder="Type a message..." />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

---

## 5. Online/Offline Status

### How It Works
1. Client connects → emits `setup(userId)` → server adds userId to `onlineUsers` map → broadcasts `userOnline`
2. Client disconnects → server removes userId from `onlineUsers` → broadcasts `userOffline`
3. All connected clients receive events and can update UI

### Server Tracking

The server maintains a Map of online users:
```javascript
onlineUsers = {
  "userId123": "socketId1",
  "userId456": "socketId2"
}
```

### Client Implementation (React Example)

```javascript
import { useState, useEffect } from 'react';

function UserStatus({ userId, socket }) {
  const [status, setStatus] = useState('offline');

  useEffect(() => {
    socket.on('userOnline', (data) => {
      if (data.userId === userId) {
        setStatus('online');
      }
    });

    socket.on('userOffline', (data) => {
      if (data.userId === userId) {
        setStatus('offline');
      }
    });

    return () => {
      socket.off('userOnline');
      socket.off('userOffline');
    };
  }, [socket, userId]);

  return (
    <div className="user-card">
      <h3>User Name</h3>
      <span className={`status ${status}`}>{status}</span>
    </div>
  );
}
```

---

## 6 & 7. Message Timestamps ("sent ago" and "read ago")

### How It Works
- `sentAgo`: calculated from `createdAt` (when message was sent)
- `readAgo`: calculated from `readAt` (when recipient marked as read)
- Both are included in API responses (see section 2 for examples)
- Utility function `timeAgo()` converts any Date to relative format

### Utility Function (src/utils/timeAgo.js)

```javascript
function timeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
  return `${Math.floor(seconds / 2592000)}mo ago`;
}
```

### Usage in Backend
All message responses automatically include:
- `sentAgo`: e.g., "5 minutes ago"
- `readAgo`: e.g., "2 minutes ago" (or null if unread)

### Frontend Display (React Example)

```javascript
function Message({ message }) {
  return (
    <div className="message">
      <p>{message.text}</p>
      <span className="timestamp">{message.sentAgo}</span>
      {message.isRead && (
        <span className="read-status">✓✓ {message.readAgo}</span>
      )}
    </div>
  );
}

function ConversationPreview({ conversation }) {
  return (
    <div className="conversation">
      <h4>{conversation.user.name}</h4>
      <p>{conversation.lastMessage.text}</p>
      <small>
        Sent: {conversation.lastMessage.sentAgo}
        {conversation.lastMessage.isRead && ` · Read: ${conversation.lastMessage.readAgo}`}
      </small>
      {conversation.unreadCount > 0 && (
        <span className="badge">{conversation.unreadCount}</span>
      )}
    </div>
  );
}
```

---

## Complete Example: Full Chat Flow

### 1. Initialize Connection
```javascript
const socket = io('http://localhost:5000');
socket.emit('setup', 'userId123');
socket.on('connected', () => console.log('Ready'));
```

### 2. Load Conversation History
```javascript
const response = await fetch('/api/messages/userId456', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const messages = await response.json();
// Messages auto-marked as read, includes sentAgo & readAgo
displayMessages(messages);
```

### 3. Listen for Real-Time Messages
```javascript
socket.on('messageReceived', (msg) => {
  addMessageToChat(msg);
  // Auto-mark as read after short delay
  setTimeout(() => {
    socket.emit('messageRead', {
      messageId: msg._id,
      from: msg.from._id,
      to: msg.to._id
    });
  }, 1000);
});
```

### 4. Send a Message
```javascript
async function sendMessage(text) {
  // Save via REST API
  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ to: recipientId, text })
  });
  const savedMessage = await response.json();

  // Also broadcast via socket for real-time display
  socket.emit('sendMessage', {
    from: currentUserId,
    to: recipientId,
    text,
    _id: savedMessage._id,
    createdAt: savedMessage.createdAt
  });
}
```

### 5. Handle Typing
```javascript
let typingTimer;

function handleInputChange(text) {
  socket.emit('typing', { from: currentUserId, to: recipientId });
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    socket.emit('typingStop', { from: currentUserId, to: recipientId });
  }, 500);
}

socket.on('userTyping', (data) => {
  showTypingIndicator(data.from);
});

socket.on('userStoppedTyping', (data) => {
  hideTypingIndicator(data.from);
});
```

### 6. Monitor Online Status
```javascript
socket.on('userOnline', (data) => {
  updateUserStatusBadge(data.userId, 'online');
});

socket.on('userOffline', (data) => {
  updateUserStatusBadge(data.userId, 'offline');
});
```

---

## Testing in Postman

### 1. Get Conversations with Unread Counts
```
GET {{baseUrl}}/api/messages/conversations
Headers: Authorization: Bearer {{token}}
```

### 2. Open Conversation (auto-marks as read)
```
GET {{baseUrl}}/api/messages/{{otherUserId}}
Headers: Authorization: Bearer {{token}}
```

### 3. Check Unread Count
```
GET {{baseUrl}}/api/messages/unread/count
Headers: Authorization: Bearer {{token}}
Response: { unreadCount: 0 }
```

### 4. Send a Message
```
POST {{baseUrl}}/api/messages
Headers:
  - Authorization: Bearer {{token}}
  - Content-Type: application/json
Body:
{
  "to": "{{otherUserId}}",
  "text": "Hello from Postman!"
}
```

### 5. Mark as Read Manually
```
PUT {{baseUrl}}/api/messages/{{messageId}}/read
Headers: Authorization: Bearer {{token}}
```

---

## Summary of Features

| Feature | Endpoint/Event | Status |
|---------|---|---|
| Read/Unread tracking | `PUT /markAsRead/:userId`, `PUT /:messageId/read` | ✅ |
| Unread count | `GET /unread/count` | ✅ |
| Chat history | `GET /:userId` | ✅ |
| Relative timestamps | All responses include `sentAgo`, `readAgo` | ✅ |
| Real-time messages | `socket.on('messageReceived')` | ✅ |
| Message read receipts | `socket.on('messageReadNotification')` | ✅ |
| Typing indicators | `typing`, `typingStop` events | ✅ |
| Online/Offline status | `userOnline`, `userOffline` events | ✅ |
| Conversation list | `GET /conversations` with unread count | ✅ |

All systems are integrated and ready to use!
