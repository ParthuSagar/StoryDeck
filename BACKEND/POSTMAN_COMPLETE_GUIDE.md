# StoryDeck Messaging - Complete Postman Guide
## Step-by-Step with Saloni & Parth Example

This guide shows EXACTLY how to test every API endpoint in Postman with two real users: **Saloni** and **Parth**.

---

## 📋 TABLE OF CONTENTS
1. [Setup: Create 2 Users](#setup-create-2-users)
2. [Environment Variables](#environment-variables)
3. [Step-by-Step API Calls](#step-by-step-api-calls)
4. [Real-Time Testing with Socket.io](#real-time-testing)
5. [Common Issues & Solutions](#troubleshooting)

---

## 🔧 SETUP: CREATE 2 USERS

### Step 1a: Register Saloni

**What we're doing:** Creating the first user named Saloni

**Postman Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/auth/register`
- Content-Type: `application/json` (set in Headers tab)

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Saloni Sagar",
  "username": "Its_Saloni_@7777",
  "email": "saloni@example.com",
  "password": "Saloni@123"
}
```

**Expected Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjkyNTM1M2Y5NDAxZjk5MzMwYTU5ZGY4In0sImlhdCI6MTcwNDMyNDMyNCwiZXhwIjoxNzA0OTI5MTI0fQ.xxx",
  "user": {
    "id": "692534e8b3759df046578f6f",
    "name": "Saloni Sagar",
    "username": "Its_Saloni_@7777",
    "email": "saloni@example.com",
    "bio": "",
    "createdAt": "2025-11-25T04:48:57.898Z"
  }
}
```

**What to save:**
- Copy the `token` value → Save in Postman environment variable as `saloni_token`
- Copy the `id` value → Save as `saloni_id`

---

### Step 1b: Register Parth

**What we're doing:** Creating the second user named Parth

**Postman Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Parth Sagar",
  "username": "Its_Parth_@7777",
  "email": "parth@example.com",
  "password": "Parth@123"
}
```

**Expected Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjkyNTM1M2Y5NDAxZjk5MzMwYTU5ZGY5In0sImlhdCI6MTcwNDMyNDMyNCwiZXhwIjoxNzA0OTI5MTI0fQ.yyy",
  "user": {
    "id": "692457adbb904e85f8dad74a",
    "name": "Parth Sagar",
    "username": "Its_Parth_@7777",
    "email": "parth@example.com",
    "bio": "",
    "createdAt": "2025-11-25T04:48:57.898Z"
  }
}
```

**What to save:**
- Copy the `token` → Save as `parth_token`
- Copy the `id` → Save as `parth_id`

---

## 🌍 ENVIRONMENT VARIABLES

Now set up Postman environment variables so we can reuse them:

### In Postman:
1. Click **Manage Environments** (gear icon, top-right)
2. Click **Create** → Name it "StoryDeck Local"
3. Add these variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `baseUrl` | `http://localhost:5000` | Server address |
| `saloni_token` | Paste token from Step 1a | Saloni's JWT |
| `saloni_id` | Paste id from Step 1a | Saloni's user ID |
| `parth_token` | Paste token from Step 1b | Parth's JWT |
| `parth_id` | Paste id from Step 1b | Parth's user ID |

Now you can use `{{baseUrl}}`, `{{saloni_token}}`, `{{saloni_id}}`, etc. in all requests.

---

## 📡 STEP-BY-STEP API CALLS

### PHASE 1: GET USER INFORMATION

#### API Call 1.1: Get All Users (as Saloni)

**Purpose:** Verify both users exist in the database

**Postman Setup:**
- Method: `GET`
- URL: `{{baseUrl}}/api/users`

**Headers:**
```
Authorization: Bearer {{saloni_token}}
Content-Type: application/json
```

**Body:** (none - GET request)

**Expected Response (200):**
```json
[
  {
    "_id": "692534e8b3759df046578f6f",
    "name": "Saloni Sagar",
    "username": "Its_Saloni_@7777",
    "email": "saloni@example.com",
    "bio": "",
    "avatarUrl": null,
    "coverUrl": null,
    "postsCount": 0,
    "followersCount": 0,
    "followingCount": 0,
    "createdAt": "2025-11-25T04:48:57.898Z"
  },
  {
    "_id": "692457adbb904e85f8dad74a",
    "name": "Parth Sagar",
    "username": "Its_Parth_@7777",
    "email": "parth@example.com",
    "bio": "",
    "avatarUrl": null,
    "coverUrl": null,
    "postsCount": 0,
    "followersCount": 0,
    "followingCount": 0,
    "createdAt": "2025-11-25T04:48:57.898Z"
  }
]
```

**What this means:**
- Both Saloni and Parth exist
- Ready to send messages between them

---

#### API Call 1.2: Get Specific User (Parth's Profile - viewed by Saloni)

**Purpose:** View Parth's profile without exposing password

**Postman Setup:**
- Method: `GET`
- URL: `{{baseUrl}}/api/users/{{parth_id}}`

**Headers:**
```
Authorization: Bearer {{saloni_token}}
Content-Type: application/json
```

**Body:** (none)

**Expected Response (200):**
```json
{
  "_id": "692457adbb904e85f8dad74a",
  "name": "Parth Sagar",
  "username": "Its_Parth_@7777",
  "email": "parth@example.com",
  "bio": "",
  "avatarUrl": null,
  "coverUrl": null,
  "postsCount": 0,
  "followersCount": 0,
  "followingCount": 0,
  "createdAt": "2025-11-25T04:48:57.898Z"
}
```

**What this means:**
- Saloni can see Parth's public profile
- Password is never sent (excluded with `-password`)

---

### PHASE 2: SEND MESSAGES

#### API Call 2.1: Saloni Sends Message to Parth

**Purpose:** Saloni sends her first message to Parth

**Postman Setup:**
- Method: `POST`
- URL: `{{baseUrl}}/api/messages`

**Headers:**
```
Authorization: Bearer {{saloni_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "to": "{{parth_id}}",
  "text": "Hi Parth! How are you doing?"
}
```

**Expected Response (201):**
```json
{
  "_id": "69253a7f6b8c2e5f1a9d4c21",
  "from": {
    "_id": "692534e8b3759df046578f6f",
    "name": "Saloni Sagar",
    "username": "Its_Saloni_@7777",
    "avatarUrl": null
  },
  "to": {
    "_id": "692457adbb904e85f8dad74a",
    "name": "Parth Sagar",
    "username": "Its_Parth_@7777",
    "avatarUrl": null
  },
  "text": "Hi Parth! How are you doing?",
  "isRead": false,
  "readAt": null,
  "createdAt": "2025-11-25T10:30:15.234Z",
  "sentAgo": "just now",
  "readAgo": null,
  "__v": 0
}
```

**Code Explanation:**

```javascript
// On the backend (src/routes/messages.js):
router.post('/', auth, async (req, res) => {
  const { to, text } = req.body;           // Get recipient & message text
  const from = req.user && (req.user.id || req.user._id);  // Get sender from token

  // 1. Validate both users exist
  const sender = await User.findById(from);
  const recipient = await User.findById(to);

  // 2. Create message object
  const msg = new Message({ from, to, text });
  await msg.save();

  // 3. Populate user info (name, username, avatar)
  await msg.populate('from', 'name username avatarUrl');
  await msg.populate('to', 'name username avatarUrl');

  // 4. Response includes timestamps
  res.status(201).json(msg);
});
```

**What to save:**
- Copy the `_id` → Save as `message_id_1`
- Note: `isRead: false`, `readAgo: null` because Parth hasn't opened it yet

---

#### API Call 2.2: Parth Sends Message Back to Saloni

**Purpose:** Parth replies to Saloni's message

**Postman Setup:**
- Method: `POST`
- URL: `{{baseUrl}}/api/messages`

**Headers:**
```
Authorization: Bearer {{parth_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "to": "{{saloni_id}}",
  "text": "Hey Saloni! I'm doing great, thanks for asking! 😊"
}
```

**Expected Response (201):**
```json
{
  "_id": "69253a7f6b8c2e5f1a9d4c22",
  "from": {
    "_id": "692457adbb904e85f8dad74a",
    "name": "Parth Sagar",
    "username": "Its_Parth_@7777",
    "avatarUrl": null
  },
  "to": {
    "_id": "692534e8b3759df046578f6f",
    "name": "Saloni Sagar",
    "username": "Its_Saloni_@7777",
    "avatarUrl": null
  },
  "text": "Hey Saloni! I'm doing great, thanks for asking! 😊",
  "isRead": false,
  "readAt": null,
  "createdAt": "2025-11-25T10:31:45.567Z",
  "sentAgo": "just now",
  "readAgo": null,
  "__v": 0
}
```

**What to save:**
- Copy the `_id` → Save as `message_id_2`

---

#### API Call 2.3: Saloni Sends Another Message

**Purpose:** Continue the conversation

**Postman Setup:**
- Method: `POST`
- URL: `{{baseUrl}}/api/messages`

**Headers:**
```
Authorization: Bearer {{saloni_token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "to": "{{parth_id}}",
  "text": "That's awesome! Want to grab coffee later?"
}
```

**Expected Response (201):**
```json
{
  "_id": "69253a7f6b8c2e5f1a9d4c23",
  "from": {
    "_id": "692534e8b3759df046578f6f",
    "name": "Saloni Sagar",
    "username": "Its_Saloni_@7777",
    "avatarUrl": null
  },
  "to": {
    "_id": "692457adbb904e85f8dad74a",
    "name": "Parth Sagar",
    "username": "Its_Parth_@7777",
    "avatarUrl": null
  },
  "text": "That's awesome! Want to grab coffee later?",
  "isRead": false,
  "readAt": null,
  "createdAt": "2025-11-25T10:33:20.891Z",
  "sentAgo": "just now",
  "readAgo": null,
  "__v": 0
}
```

---

### PHASE 3: VIEW CHAT HISTORY

#### API Call 3.1: Saloni Opens Chat with Parth (Auto-Mark as Read)

**Purpose:** 
- Saloni opens the conversation
- All unread messages from Parth are automatically marked as read
- Get full chat history with timestamps

**Postman Setup:**
- Method: `GET`
- URL: `{{baseUrl}}/api/messages/{{parth_id}}`

**Headers:**
```
Authorization: Bearer {{saloni_token}}
Content-Type: application/json
```

**Body:** (none)

**Expected Response (200):**
```json
[
  {
    "_id": "69253a7f6b8c2e5f1a9d4c21",
    "from": {
      "_id": "692534e8b3759df046578f6f",
      "name": "Saloni Sagar",
      "username": "Its_Saloni_@7777",
      "avatarUrl": null
    },
    "to": {
      "_id": "692457adbb904e85f8dad74a",
      "name": "Parth Sagar",
      "username": "Its_Parth_@7777",
      "avatarUrl": null
    },
    "text": "Hi Parth! How are you doing?",
    "isRead": false,
    "readAt": null,
    "createdAt": "2025-11-25T10:30:15.234Z",
    "sentAgo": "3 minutes ago",
    "readAgo": null
  },
  {
    "_id": "69253a7f6b8c2e5f1a9d4c22",
    "from": {
      "_id": "692457adbb904e85f8dad74a",
      "name": "Parth Sagar",
      "username": "Its_Parth_@7777",
      "avatarUrl": null
    },
    "to": {
      "_id": "692534e8b3759df046578f6f",
      "name": "Saloni Sagar",
      "username": "Its_Saloni_@7777",
      "avatarUrl": null
    },
    "text": "Hey Saloni! I'm doing great, thanks for asking! 😊",
    "isRead": true,
    "readAt": "2025-11-25T10:35:10.000Z",
    "createdAt": "2025-11-25T10:31:45.567Z",
    "sentAgo": "1 minute ago",
    "readAgo": "just now"
  },
  {
    "_id": "69253a7f6b8c2e5f1a9d4c23",
    "from": {
      "_id": "692534e8b3759df046578f6f",
      "name": "Saloni Sagar",
      "username": "Its_Saloni_@7777",
      "avatarUrl": null
    },
    "to": {
      "_id": "692457adbb904e85f8dad74a",
      "name": "Parth Sagar",
      "username": "Its_Parth_@7777",
      "avatarUrl": null
    },
    "text": "That's awesome! Want to grab coffee later?",
    "isRead": false,
    "readAt": null,
    "createdAt": "2025-11-25T10:33:20.891Z",
    "sentAgo": "30 seconds ago",
    "readAgo": null
  }
]
```

**Code Explanation:**

```javascript
// On the backend (src/routes/messages.js):
router.get('/:userId', auth, async (req, res) => {
  const otherId = req.params.userId;
  const me = req.user.id;

  try {
    // 1. IMPORTANT: Auto-mark received messages as read
    await Message.updateMany(
      { from: otherId, to: me, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    // 2. Fetch all messages (both sent and received)
    const messages = await Message.find({
      $or: [
        { from: me, to: otherId },           // Messages Saloni sent
        { from: otherId, to: me }            // Messages from Parth
      ]
    })
      .sort({ createdAt: 1 })               // Oldest first
      .populate('from', 'name username avatarUrl')
      .populate('to', 'name username avatarUrl');

    // 3. Add relative timestamps
    const messagesWithTime = messages.map(msg => ({
      ...msg.toObject(),
      sentAgo: timeAgo(msg.createdAt),      // "3 minutes ago"
      readAgo: msg.readAt ? timeAgo(msg.readAt) : null
    }));

    res.json(messagesWithTime);
  } catch (err) {
    res.status(500).send('Server error');
  }
});
```

**What this means:**
- You see ALL messages sorted chronologically
- Messages from Parth are now `isRead: true` and `readAgo` shows when you read them
- `sentAgo` shows relative time like "3 minutes ago", "1 minute ago", etc.

---

#### API Call 3.2: Parth Opens Chat with Saloni (Auto-Mark as Read)

**Purpose:** Parth opens the conversation, his unread messages auto-marked as read

**Postman Setup:**
- Method: `GET`
- URL: `{{baseUrl}}/api/messages/{{saloni_id}}`

**Headers:**
```
Authorization: Bearer {{parth_token}}
Content-Type: application/json
```

**Body:** (none)

**Expected Response (200):**
```json
[
  {
    "_id": "69253a7f6b8c2e5f1a9d4c21",
    "from": {
      "_id": "692534e8b3759df046578f6f",
      "name": "Saloni Sagar",
      "username": "Its_Saloni_@7777",
      "avatarUrl": null
    },
    "to": {
      "_id": "692457adbb904e85f8dad74a",
      "name": "Parth Sagar",
      "username": "Its_Parth_@7777",
      "avatarUrl": null
    },
    "text": "Hi Parth! How are you doing?",
    "isRead": true,
    "readAt": "2025-11-25T10:35:20.000Z",
    "createdAt": "2025-11-25T10:30:15.234Z",
    "sentAgo": "5 minutes ago",
    "readAgo": "just now"
  },
  {
    "_id": "69253a7f6b8c2e5f1a9d4c22",
    "from": {
      "_id": "692457adbb904e85f8dad74a",
      "name": "Parth Sagar",
      "username": "Its_Parth_@7777",
      "avatarUrl": null
    },
    "to": {
      "_id": "692534e8b3759df046578f6f",
      "name": "Saloni Sagar",
      "username": "Its_Saloni_@7777",
      "avatarUrl": null
    },
    "text": "Hey Saloni! I'm doing great, thanks for asking! 😊",
    "isRead": false,
    "readAt": null,
    "createdAt": "2025-11-25T10:31:45.567Z",
    "sentAgo": "3 minutes ago",
    "readAgo": null
  },
  {
    "_id": "69253a7f6b8c2e5f1a9d4c23",
    "from": {
      "_id": "692534e8b3759df046578f6f",
      "name": "Saloni Sagar",
      "username": "Its_Saloni_@7777",
      "avatarUrl": null
    },
    "to": {
      "_id": "692457adbb904e85f8dad74a",
      "name": "Parth Sagar",
      "username": "Its_Parth_@7777",
      "avatarUrl": null
    },
    "text": "That's awesome! Want to grab coffee later?",
    "isRead": true,
    "readAt": "2025-11-25T10:35:25.000Z",
    "createdAt": "2025-11-25T10:33:20.891Z",
    "sentAgo": "2 minutes ago",
    "readAgo": "just now"
  }
]
```

**Key Point:**
- Messages from Saloni are now marked as read
- Both messages in the middle and last have `isRead: true` and `readAgo`

---

### PHASE 4: UNREAD MANAGEMENT

#### API Call 4.1: Get Total Unread Count (as Saloni)

**Purpose:** Check how many total unread messages Saloni has

**Postman Setup:**
- Method: `GET`
- URL: `{{baseUrl}}/api/messages/unread/count`

**Headers:**
```
Authorization: Bearer {{saloni_token}}
Content-Type: application/json
```

**Body:** (none)

**Expected Response (200):**
```json
{
  "unreadCount": 0
}
```

**Why 0?** Because Saloni just opened the chat with Parth, so all messages are marked as read.

**Code Explanation:**

```javascript
router.get('/unread/count', auth, async (req, res) => {
  const me = req.user.id;
  
  // Count all messages where:
  // - They were sent TO me (to: me)
  // - I haven't read them yet (isRead: false)
  const unreadCount = await Message.countDocuments({
    to: me,
    isRead: false
  });
  
  res.json({ unreadCount });
});
```

---

#### API Call 4.2: Get Total Unread Count (as Parth)

**Purpose:** Check Parth's unread count

**Postman Setup:**
- Method: `GET`
- URL: `{{baseUrl}}/api/messages/unread/count`

**Headers:**
```
Authorization: Bearer {{parth_token}}
Content-Type: application/json
```

**Body:** (none)

**Expected Response (200):**
```json
{
  "unreadCount": 0
}
```

**Why 0?** Because Parth also just opened the chat.

---

### PHASE 5: VIEW CONVERSATION LIST

#### API Call 5.1: Get Conversations List (as Saloni)

**Purpose:** See all conversations with unread badges and preview

**Postman Setup:**
- Method: `GET`
- URL: `{{baseUrl}}/api/messages/conversations`

**Headers:**
```
Authorization: Bearer {{saloni_token}}
Content-Type: application/json
```

**Body:** (none)

**Expected Response (200):**
```json
[
  {
    "user": {
      "_id": "692457adbb904e85f8dad74a",
      "name": "Parth Sagar",
      "username": "Its_Parth_@7777",
      "avatarUrl": null
    },
    "lastMessage": {
      "_id": "69253a7f6b8c2e5f1a9d4c23",
      "text": "That's awesome! Want to grab coffee later?",
      "isRead": false,
      "createdAt": "2025-11-25T10:33:20.891Z",
      "readAt": null,
      "sentAgo": "2 minutes ago",
      "readAgo": null
    },
    "unreadCount": 0
  }
]
```

**Code Explanation:**

```javascript
router.get('/conversations', auth, async (req, res) => {
  const me = req.user.id;

  // Use MongoDB aggregation to group messages by conversation partner
  const convs = await Message.aggregate([
    // 1. Match all messages where I'm involved
    { $match: { $or: [{ from: me }, { to: me }] } },

    // 2. Add field 'other' = the person I'm talking to
    { $addFields: { 
        other: { $cond: [{ $eq: ['$from', me] }, '$to', '$from'] } 
      } 
    },

    // 3. Sort by newest first
    { $sort: { createdAt: -1 } },

    // 4. Group by conversation partner, keep newest message
    { $group: { 
        _id: '$other',
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              { $and: [
                { $eq: ['$from', '$other'] },
                { $eq: ['$to', me] },
                { $eq: ['$isRead', false] }
              ]},
              1,
              0
            ]
          }
        }
      } 
    },

    // 5. Populate user details
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },

    // 6. Project only needed fields
    { $project: { 
        _id: 0,
        user: { _id: '$user._id', name: '$user.name', username: '$user.username', avatarUrl: '$user.avatarUrl' },
        lastMessage: 1,
        unreadCount: 1
      } 
    },

    // 7. Sort by newest conversation
    { $sort: { 'lastMessage.createdAt': -1 } }
  ]);

  // Add relative timestamps
  const convsWithTime = convs.map(conv => ({
    ...conv,
    lastMessage: {
      ...conv.lastMessage,
      sentAgo: timeAgo(conv.lastMessage.createdAt),
      readAgo: conv.lastMessage.readAt ? timeAgo(conv.lastMessage.readAt) : null
    }
  }));

  res.json(convsWithTime);
});
```

**What this shows:**
- One conversation with Parth
- Last message preview: "That's awesome! Want to grab coffee later?"
- `unreadCount: 0` because Saloni opened the chat
- `sentAgo: "2 minutes ago"` - when the last message was sent
- `readAgo: null` - not read yet (it's Saloni's own message)

---

#### API Call 5.2: Get Conversations List (as Parth)

**Purpose:** See Parth's conversations

**Postman Setup:**
- Method: `GET`
- URL: `{{baseUrl}}/api/messages/conversations`

**Headers:**
```
Authorization: Bearer {{parth_token}}
Content-Type: application/json
```

**Body:** (none)

**Expected Response (200):**
```json
[
  {
    "user": {
      "_id": "692534e8b3759df046578f6f",
      "name": "Saloni Sagar",
      "username": "Its_Saloni_@7777",
      "avatarUrl": null
    },
    "lastMessage": {
      "_id": "69253a7f6b8c2e5f1a9d4c23",
      "text": "That's awesome! Want to grab coffee later?",
      "isRead": true,
      "createdAt": "2025-11-25T10:33:20.891Z",
      "readAt": "2025-11-25T10:35:25.000Z",
      "sentAgo": "2 minutes ago",
      "readAgo": "just now"
    },
    "unreadCount": 0
  }
]
```

**Key Difference:**
- `isRead: true` and `readAgo: "just now"` because Parth already opened the chat

---

### PHASE 6: MANUAL READ MARKING (Optional)

#### API Call 6.1: Mark Single Message as Read

**Purpose:** Explicitly mark one message as read (usually done automatically)

**Scenario:** Let's pretend Parth hasn't opened the chat yet, and Saloni sent a new message. Then Parth marks just that message as read (in socket.io, this would be automatic).

**First, Saloni sends a new message:**

- Method: `POST`
- URL: `{{baseUrl}}/api/messages`
- Headers: `Authorization: Bearer {{saloni_token}}`
- Body:
```json
{
  "to": "{{parth_id}}",
  "text": "Looking forward to it! ☕"
}
```

**Response includes message id, let's say: `69253a7f6b8c2e5f1a9d4c24`**

**Now, Parth marks it as read:**

- Method: `PUT`
- URL: `{{baseUrl}}/api/messages/69253a7f6b8c2e5f1a9d4c24/read`

**Headers:**
```
Authorization: Bearer {{parth_token}}
Content-Type: application/json
```

**Body:** (none)

**Expected Response (200):**
```json
{
  "success": true,
  "msg": {
    "_id": "69253a7f6b8c2e5f1a9d4c24",
    "from": {
      "_id": "692534e8b3759df046578f6f",
      "name": "Saloni Sagar",
      "username": "Its_Saloni_@7777",
      "avatarUrl": null
    },
    "to": {
      "_id": "692457adbb904e85f8dad74a",
      "name": "Parth Sagar",
      "username": "Its_Parth_@7777",
      "avatarUrl": null
    },
    "text": "Looking forward to it! ☕",
    "isRead": true,
    "readAt": "2025-11-25T10:36:45.000Z",
    "createdAt": "2025-11-25T10:34:50.123Z",
    "__v": 0
  }
}
```

**Code Explanation:**

```javascript
router.put('/:messageId/read', auth, async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  // 1. Find the message
  const msg = await Message.findById(messageId);

  // 2. Verify only the recipient can mark as read
  if (msg.to.toString() !== userId) {
    return res.status(403).json({ msg: 'Only recipient can mark as read' });
  }

  // 3. Mark as read
  msg.isRead = true;
  msg.readAt = new Date();
  await msg.save();

  res.json({ success: true, msg });
});
```

---

#### API Call 6.2: Mark All Messages from User as Read

**Purpose:** Mark all unread messages from Saloni as read (bulk operation)

**Postman Setup:**
- Method: `PUT`
- URL: `{{baseUrl}}/api/messages/markAsRead/{{saloni_id}}`

**Headers:**
```
Authorization: Bearer {{parth_token}}
Content-Type: application/json
```

**Body:** (none)

**Expected Response (200):**
```json
{
  "success": true,
  "updatedCount": 2
}
```

**Meaning:** 2 unread messages from Saloni were marked as read.

**Code Explanation:**

```javascript
router.put('/markAsRead/:userId', auth, async (req, res) => {
  const { userId } = req.params;  // The user who sent the messages
  const me = req.user.id;         // Current user (recipient)

  // Update all unread messages FROM that user TO me
  const result = await Message.updateMany(
    { from: userId, to: me, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );

  res.json({ success: true, updatedCount: result.modifiedCount });
});
```

---

## 🔌 REAL-TIME TESTING WITH SOCKET.IO

To test real-time features (typing, online/offline), you need Socket.io client. Here's how:

### Using JavaScript in Browser Console or Node.js

**Step 1: Install socket.io-client**
```bash
npm install socket.io-client
```

**Step 2: Test Script (save as `test-socket.js`)**

```javascript
const io = require('socket.io-client');

// Connect as Saloni
const salonisSocket = io('http://localhost:5000');

// Connect as Parth
const parthsSocket = io('http://localhost:5000');

// --- SALONI COMES ONLINE ---
salonisSocket.emit('setup', '692534e8b3759df046578f6f'); // Saloni's ID
salonisSocket.on('connected', () => {
  console.log('✅ Saloni is now connected');
});

// --- PARTH COMES ONLINE ---
parthsSocket.emit('setup', '692457adbb904e85f8dad74a'); // Parth's ID
parthsSocket.on('connected', () => {
  console.log('✅ Parth is now connected');
});

// --- LISTEN FOR ONLINE STATUS ---
salonisSocket.on('userOnline', (data) => {
  console.log(`👤 User ${data.userId} came online`);
});

parthsSocket.on('userOnline', (data) => {
  console.log(`👤 User ${data.userId} came online`);
});

// --- SALONI STARTS TYPING ---
setTimeout(() => {
  console.log('🔤 Saloni is typing...');
  salonisSocket.emit('typing', {
    from: '692534e8b3759df046578f6f',
    to: '692457adbb904e85f8dad74a'
  });
}, 2000);

// --- PARTH SEES TYPING INDICATOR ---
parthsSocket.on('userTyping', (data) => {
  console.log(`💬 ${data.from} is typing...`);
});

// --- SALONI STOPS TYPING ---
setTimeout(() => {
  console.log('🔤 Saloni stopped typing');
  salonisSocket.emit('typingStop', {
    from: '692534e8b3759df046578f6f',
    to: '692457adbb904e85f8dad74a'
  });
}, 4000);

// --- PARTH SEES TYPING STOPPED ---
parthsSocket.on('userStoppedTyping', (data) => {
  console.log(`💬 ${data.from} stopped typing`);
});

// --- SALONI SENDS MESSAGE via SOCKET ---
setTimeout(() => {
  console.log('📤 Saloni sending message via socket...');
  salonisSocket.emit('sendMessage', {
    from: '692534e8b3759df046578f6f',
    to: '692457adbb904e85f8dad74a',
    text: 'Real-time message from socket!'
  });
}, 5000);

// --- PARTH RECEIVES MESSAGE ---
parthsSocket.on('messageReceived', (msg) => {
  console.log('📩 Parth received:', msg);
});

// --- PARTH MARKS MESSAGE AS READ ---
setTimeout(() => {
  console.log('✓ Parth marking message as read...');
  parthsSocket.emit('messageRead', {
    messageId: 'msg_id_here',
    from: '692457adbb904e85f8dad74a',
    to: '692534e8b3759df046578f6f'
  });
}, 6000);

// --- SALONI SEES READ RECEIPT ---
salonisSocket.on('messageReadNotification', (data) => {
  console.log(`✓✓ Message ${data.messageId} was read at ${data.readAt}`);
});

// --- CLEANUP: Disconnect after 10 seconds ---
setTimeout(() => {
  console.log('\n🔌 Disconnecting sockets...');
  salonisSocket.disconnect();
  parthsSocket.disconnect();
  process.exit(0);
}, 10000);
```

**Run it:**
```bash
node test-socket.js
```

**Expected Output:**
```
✅ Saloni is now connected
✅ Parth is now connected
👤 User 692534e8b3759df046578f6f came online
👤 User 692457adbb904e85f8dad74a came online
🔤 Saloni is typing...
💬 692534e8b3759df046578f6f is typing...
🔤 Saloni stopped typing
💬 692534e8b3759df046578f6f stopped typing
📤 Saloni sending message via socket...
📩 Parth received: { from, to, text }
✓ Parth marking message as read...
✓✓ Message marked as read
```

---

## 📋 COMPLETE POSTMAN COLLECTION

Save this as `STORYDECK_Messaging.postman_collection.json` and import in Postman:

**Environment Variables to Set First:**
```
baseUrl = http://localhost:5000
saloni_token = (from Step 1a)
saloni_id = (from Step 1a)
parth_token = (from Step 1b)
parth_id = (from Step 1b)
```

**Requests in order:**

| # | Name | Method | URL | Headers | Body |
|---|------|--------|-----|---------|------|
| 1 | Register Saloni | POST | {{baseUrl}}/api/auth/register | Content-Type: application/json | {"name": "Saloni Sagar", "username": "Its_Saloni_@7777", "email": "saloni@example.com", "password": "Saloni@123"} |
| 2 | Register Parth | POST | {{baseUrl}}/api/auth/register | Content-Type: application/json | {"name": "Parth Sagar", "username": "Its_Parth_@7777", "email": "parth@example.com", "password": "Parth@123"} |
| 3 | Get All Users | GET | {{baseUrl}}/api/users | Authorization: Bearer {{saloni_token}} | (none) |
| 4 | Get Parth's Profile | GET | {{baseUrl}}/api/users/{{parth_id}} | Authorization: Bearer {{saloni_token}} | (none) |
| 5 | Saloni Sends Message to Parth | POST | {{baseUrl}}/api/messages | Authorization: Bearer {{saloni_token}} Content-Type: application/json | {"to": "{{parth_id}}", "text": "Hi Parth! How are you doing?"} |
| 6 | Parth Sends Reply | POST | {{baseUrl}}/api/messages | Authorization: Bearer {{parth_token}} Content-Type: application/json | {"to": "{{saloni_id}}", "text": "Hey Saloni! I'm doing great!"} |
| 7 | Saloni Sends Another | POST | {{baseUrl}}/api/messages | Authorization: Bearer {{saloni_token}} Content-Type: application/json | {"to": "{{parth_id}}", "text": "Want to grab coffee?"} |
| 8 | Saloni Opens Chat | GET | {{baseUrl}}/api/messages/{{parth_id}} | Authorization: Bearer {{saloni_token}} | (none) |
| 9 | Parth Opens Chat | GET | {{baseUrl}}/api/messages/{{parth_id}} | Authorization: Bearer {{parth_token}} | (none) |
| 10 | Saloni's Unread Count | GET | {{baseUrl}}/api/messages/unread/count | Authorization: Bearer {{saloni_token}} | (none) |
| 11 | Parth's Unread Count | GET | {{baseUrl}}/api/messages/unread/count | Authorization: Bearer {{parth_token}} | (none) |
| 12 | Saloni's Conversations | GET | {{baseUrl}}/api/messages/conversations | Authorization: Bearer {{saloni_token}} | (none) |
| 13 | Parth's Conversations | GET | {{baseUrl}}/api/messages/conversations | Authorization: Bearer {{parth_token}} | (none) |

---

## 🐛 TROUBLESHOOTING

### Issue 1: "Authenticated user not found in DB"
**Problem:** Token is valid but user doesn't exist in MongoDB
**Solution:** 
- Make sure you completed Steps 1a and 1b (registered both users)
- Check that `saloni_id` and `parth_id` in environment match your registered users
- Run API Call 1.1 to verify users exist

### Issue 2: "Invalid recipient id"
**Problem:** The `to` field in message body is not a valid MongoDB ObjectId
**Solution:**
- Make sure you're using `{{parth_id}}` variable, not hardcoded id
- Verify the id is 24 hex characters long
- Copy directly from registration response

### Issue 3: "Only recipient can mark as read"
**Problem:** You tried to mark someone else's message as read
**Solution:**
- Only the person who RECEIVED the message can mark it as read
- Use the correct token (Parth's token for Parth's messages)

### Issue 4: Socket events not received
**Problem:** Real-time events not working
**Solution:**
- Make sure server is running: `nodemon src/server.js`
- Check browser console for CORS errors
- Verify `setup` event was emitted with correct userId
- Check that socket is connected before emitting events

### Issue 5: Timestamps showing wrong values
**Problem:** `sentAgo` shows incorrect relative time
**Solution:**
- Check server timezone matches client timezone
- Timestamps are calculated server-side, so server time matters
- Compare with `createdAt` field (absolute timestamp)

---

## 📖 SUMMARY

**You now know how to:**
- ✅ Register two users (Saloni & Parth)
- ✅ Send messages between them
- ✅ View chat history with timestamps
- ✅ Auto-mark messages as read
- ✅ Get unread counts
- ✅ View conversation list
- ✅ Manually mark messages as read
- ✅ Test real-time events with Socket.io

**Next Steps:**
1. Run your backend: `cd BACKEND && nodemon src/server.js`
2. Follow the API calls step-by-step in Postman
3. Test Socket.io with the provided Node.js script
4. Connect your frontend using the same patterns!
