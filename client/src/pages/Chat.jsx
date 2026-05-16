import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const socket = io('http://localhost:5000', {
  autoConnect: false,
})

function Chat() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [stats, setStats] = useState({ totalMessages: 0, totalUsers: 0 })
  const [notifications, setNotifications] = useState([])
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    // Load chat history
    const fetchMessages = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/chat/messages', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setMessages(res.data)
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    // Load stats
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/chat/stats', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setStats(res.data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchMessages()
    fetchStats()

    socket.connect()

    // Emit user join
    socket.emit('user_join', user.username)

    // Listen for new messages
    socket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message])
      setStats((prev) => ({ ...prev, totalMessages: prev.totalMessages + 1 }))
    })

// Listen for user joined
socket.on('user_joined', (data) => {
  if (data.username !== user.username) {
    setNotifications((prev) => [...prev, data.message])
    setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers + 1 }))
    setTimeout(() => setNotifications((prev) => prev.slice(1)), 3000)
  }
})

    // Listen for user left
    socket.on('user_left', (data) => {
      setNotifications((prev) => [...prev, data.message])
      setTimeout(() => setNotifications((prev) => prev.slice(1)), 3000)
    })

    return () => {
      socket.off('receive_message')
      socket.off('user_joined')
      socket.off('user_left')
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    socket.emit('send_message', {
      message: newMessage,
      senderId: user._id,
      username: user.username,
    })
    setNewMessage('')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-blue-500 text-white px-6 py-4 flex justify-between items-center shadow">
        <div>
          <h1 className="text-xl font-bold">💬 Chat App</h1>
          <p className="text-sm opacity-80">👥 {stats.totalUsers} users · 💬 {stats.totalMessages} messages</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">Hello, {user.username}!</span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-500 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-10 space-y-1">
        {notifications.map((note, i) => (
          <div key={i} className="bg-gray-800 text-white text-sm px-4 py-2 rounded-lg opacity-80">
            {note}
          </div>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-w-3xl w-full mx-auto">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.username === user.username ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${
                msg.username === user.username
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              {msg.username !== user.username && (
                <p className="font-semibold text-blue-500 text-xs mb-1">{msg.username}</p>
              )}
              <p>{msg.message}</p>
              <p className={`text-xs mt-1 ${msg.username === user.username ? 'text-blue-100' : 'text-gray-400'}`}>
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="bg-white border-t px-4 py-3">
        <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition font-medium"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chat