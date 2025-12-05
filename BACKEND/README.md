# STORYDECK backend (Node + Express + MongoDB + Socket.IO)

This backend provides a minimal real-time chat API using Express, MongoDB (mongoose), and Socket.IO. It includes simple auth (register/login), user listing, and message persistence.

Quick start

1. Copy `.env.example` to `.env` and adjust values (Mongo URI and JWT secret).
2. Install deps:

```bash
npm install
```

3. Start the server in development:

```bash
npm run dev
```

API overview

- POST /api/auth/register { username, email, password } -> { token, user }
- POST /api/auth/login { email, password } -> { token, user }
- GET /api/users (Authorization: Bearer <token>) -> list users
- GET /api/messages/:userId (Authorization) -> list messages between you and userId
- POST /api/messages { to, text } (Authorization) -> create message

Realtime (Socket.IO)

- Connect to the server and emit `setup` with your userId to join your personal room.
- Emit `sendMessage` with { from, to, text } and server will forward to recipient's room as `messageReceived`.

Notes

- This is a scaffold intended to be integrated with a React frontend. For production use, add more validation, rate-limiting, tests, and improve error handling and security.
