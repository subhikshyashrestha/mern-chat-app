# MERN Chat App

A real-time chat application where users can register, login, and chat with each other instantly.

## Features
- User Registration and Login with JWT Authentication
- Real-time messaging with Socket.IO
- Chat history saved in MongoDB
- Shows total users and total messages
- Protected routes with Authorization

## Tech Stack
**Backend:** Node.js, Express, MongoDB, Socket.IO, JWT, bcryptjs  
**Frontend:** React, Vite, Tailwind CSS, Socket.IO-client, Axios

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/subhikshyashrestha/mern-chat-app.git
cd mern-chat-app
```

### 2. Setup Backend
```bash
cd server
npm install
```
Create a `.env` file inside the `server` folder and copy the contents of `.env.example`:
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```
Start the server:
```bash
npm run dev
```

### 3. Setup Frontend
Open a new terminal:
```bash
cd client
npm install
npm run dev
```

### 4. Open the app
Go to `http://localhost:5173` in your browser.  
Register an account and start chatting!

## Socket Events

| Event | Description |
|-------|-------------|
| user_join | Emitted when a user joins the chat |
| send_message | Emitted when a user sends a message |
| receive_message | Broadcasted to all users when a new message arrives |
| user_joined | Broadcasted when a new user joins |
| user_left | Broadcasted when a user disconnects |