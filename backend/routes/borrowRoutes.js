const express = require('express');
const {
  borrowBook,
  returnBook,
  getMyBorrows,
  getAllBorrows,
} = require('../controllers/borrowController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, borrowBook);
router.put('/return/:id', protect, returnBook);
router.get('/my-books', protect, getMyBorrows);
router.get('/all', protect, adminOnly, getAllBorrows);

module.exports = router;
