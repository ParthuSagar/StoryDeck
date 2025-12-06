# Messaging System - Quick Reference Card

## Files Modified/Created

| File | What Changed |
|------|--------------|
| `src/models/Message.js` | Already had `isRead` and `readAt` fields |
| `src/routes/messages.js` | Added: `/unread/count`, `/:messageId/read`, `/markAsRead/:userId`; Enhanced: `/conversations` & `/:userId` with timestamps |
| `src/server.js` | Enhanced socket.io with: typing, messageRead, userOnline, userOffline events; Added onlineUsers tracking |
| `src/utils/timeAgo.js` | NEW: Converts dates to relative time (e.g., "5m ago") |
| `MESSAGING_SYSTEM_GUIDE.md` | NEW: Complete guide with examples |

---

## API Endpoints Summary

### Read/Unread Management
```
PUT  /api/messages/markAsRead/:userId      Mark all from user as read
PUT  /api/messages/:messageId/read          Mark single message as read
GET  /api/messages/unread/count             Get unread count
```

### Messaging
```
GET  /api/messages/conversations           List conversations (with unread count)
GET  /api/messages/:userId                 Get chat history (auto-marks as read)
POST /api/messages                         Create message
```

---

## Socket.io Events

### Client → Server
```javascript
socket.emit('setup', userId)                      // Connect
socket.emit('sendMessage', {from, to, text})      // Send message
socket.emit('messageRead', {messageId, from, to}) // Mark as read
socket.emit('typing', {from, to})                 // Typing indicator
socket.emit('typingStop', {from, to})             // Stop typing
```

### Server → Client
```javascript
socket.on('connected', () => {})                           // Connection confirmed
socket.on('messageReceived', (msg) => {})                  // New message
socket.on('messageReadNotification', (data) => {})         // Message read receipt
socket.on('userTyping', (data) => {})                      // User typing
socket.on('userStoppedTyping', (data) => {})               // User stopped
socket.on('userOnline', (data) => {})                      // User came online
socket.on('userOffline', (data) => {})                     // User went offline
```

---

## Response Format Examples

### Message Object (with timestamps)
```json
{
  "_id": "69245b43100b22e7220fec91",
  "from": { "_id": "...", "name": "Alice", "username": "alice_42", "avatarUrl": null },
  "to": { "_id": "...", "name": "Bob", "username": "bob_99", "avatarUrl": null },
  "text": "Hello!",
  "isRead": true,
  "readAt": "2025-11-25T10:05:30.000Z",
  "createdAt": "2025-11-25T10:05:10.000Z",
  "sentAgo": "2 minutes ago",
  "readAgo": "1 minute ago",
  "__v": 0
}
```

### Conversation Object (from /conversations)
```json
{
  "user": { "_id": "...", "name": "Alice", "username": "alice_42", "avatarUrl": null },
  "lastMessage": {
    "_id": "...",
    "text": "See you!",
    "isRead": false,
    "createdAt": "2025-11-25T10:05:10.000Z",
    "readAt": null,
    "sentAgo": "3 hours ago",
    "readAgo": null
  },
  "unreadCount": 2
}
```

---

## Relative Time Format

```
   0-59 seconds  → "45s ago"
  1-59 minutes   → "23m ago"
 1-23 hours     → "5h ago"
 1-6 days       → "3d ago"
 1-4 weeks      → "2w ago"
 5+ weeks       → "8mo ago"
```

---

## Testing Checklist

- [ ] User logs in and gets token
- [ ] Two users connect to socket with their IDs
- [ ] User A sends message to User B via REST API
- [ ] User B receives `messageReceived` event via socket
- [ ] User B opens conversation (messages auto-marked as read)
- [ ] User B types → User A sees typing indicator
- [ ] User B stops typing → User A typing disappears
- [ ] Both users see online/offline status changes
- [ ] GET /conversations shows unread counts correctly
- [ ] GET /unread/count shows accurate total
- [ ] Messages show "sentAgo" and "readAgo" timestamps

---

## Integration Checklist for Frontend

- [ ] Import socket.io-client and connect on app load
- [ ] Emit `setup` with user id when logged in
- [ ] Listen to `messageReceived` and add to chat display
- [ ] Auto-mark as read when conversation is opened
- [ ] Show typing indicators in real-time
- [ ] Display online/offline badges for users
- [ ] Show message timestamps in relative format
- [ ] Display read receipts (double checkmarks with "read at" time)
- [ ] Handle message send both via REST API and socket
- [ ] Gracefully disconnect on logout

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Messages show "from: null" | Ensure token user exists in DB; re-login if needed |
| Real-time events not received | Check socket connection; confirm `setup` event sent |
| Typing indicator stuck | Ensure `typingStop` is emitted after typing stops |
| Online status not updating | Verify socket.io CORS origin matches client URL |
| Timestamps showing wrong time | Check server timezone and client local time |
| Unread count not decreasing | Ensure `GET /:userId` is called or `PUT /markAsRead/:userId` is used |

---

## Files Ready to Use

1. **MESSAGING_SYSTEM_GUIDE.md** - Complete documentation with code examples
2. **src/utils/timeAgo.js** - Timestamp utility (ready to import)
3. **src/routes/messages.js** - All endpoints implemented
4. **src/server.js** - All socket.io events implemented

**Status**: ✅ All systems ready for frontend integration
