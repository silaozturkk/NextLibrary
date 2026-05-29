const express = require('express');
const {
  createMessage,
  getMessages,
  toggleMessageRead,
  deleteMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', createMessage);
router.get('/', protect, adminOnly, getMessages);
router.put('/:id/read', protect, adminOnly, toggleMessageRead);
router.delete('/:id', protect, adminOnly, deleteMessage);

module.exports = router;
