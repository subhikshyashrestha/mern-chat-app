const Chat = require('../models/Chat');
const User = require('../models/User');

// Get all chat messages
const getMessages = async (req, res) => {
  try {
    const messages = await Chat.find()
      .populate('sender', 'username email')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get stats - total messages and total users
const getStats = async (req, res) => {
  try {
    const totalMessages = await Chat.countDocuments();
    const totalUsers = await User.countDocuments();
    res.json({ totalMessages, totalUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages, getStats };