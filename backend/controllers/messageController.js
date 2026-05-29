const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');

// @desc    Yeni iletişim mesajı gönder
// @route   POST /api/messages
// @access  Public
const createMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Tüm alanlar zorunlu');
  }

  const created = await Message.create({ name, email, subject, message });
  res.status(201).json({
    message: 'Mesajınız bize ulaştı, en kısa sürede dönüş yapacağız',
    data: { _id: created._id, createdAt: created.createdAt },
  });
});

// @desc    Tüm mesajları listele
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = asyncHandler(async (_req, res) => {
  const messages = await Message.find({}).sort({ createdAt: -1 });
  const unreadCount = await Message.countDocuments({ isRead: false });
  res.json({ messages, unreadCount });
});

// @desc    Mesajı okundu olarak işaretle / işareti kaldır
// @route   PUT /api/messages/:id/read
// @access  Private/Admin
const toggleMessageRead = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error('Mesaj bulunamadı');
  }
  message.isRead = !message.isRead;
  await message.save();
  res.json(message);
});

// @desc    Mesajı sil
// @route   DELETE /api/messages/:id
// @access  Private/Admin
const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error('Mesaj bulunamadı');
  }
  await message.deleteOne();
  res.json({ message: 'Mesaj silindi' });
});

module.exports = {
  createMessage,
  getMessages,
  toggleMessageRead,
  deleteMessage,
};
