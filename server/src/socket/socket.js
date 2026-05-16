const Chat = require('../models/Chat');

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(' User connected:', socket.id);

    // User joins with their username
    socket.on('user_join', (username) => {
      socket.username = username;
      // Emit to everyone that a user joined
      io.emit('user_joined', { username, message: `${username} joined the chat` });
    });

    // Listen for new messages
    socket.on('send_message', async (data) => {
      try {
        // Save message to MongoDB
        const chat = await Chat.create({
          message: data.message,
          sender: data.senderId,
          username: data.username,
        });

        // Emit message to everyone
        io.emit('receive_message', {
          _id: chat._id,
          message: chat.message,
          username: chat.username,
          sender: chat.sender,
          createdAt: chat.createdAt,
        });
      } catch (error) {
        console.error('Message error:', error);
      }
    });

    // User disconnects
    socket.on('disconnect', () => {
      console.log(' User disconnected:', socket.id);
      if (socket.username) {
        io.emit('user_left', { username: socket.username, message: `${socket.username} left the chat` });
      }
    });
  });
};

module.exports = { setupSocket };