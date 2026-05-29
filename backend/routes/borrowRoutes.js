const express = require('express');
const {
  borrowBook,
  returnBook,
  getMyBorrows,
  getAllBorrows,
  getBorrowLimit,
} = require('../controllers/borrowController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, borrowBook);
router.put('/return/:id', protect, returnBook);
router.get('/my-books', protect, getMyBorrows);
router.get('/limit', protect, getBorrowLimit);
router.get('/all', protect, adminOnly, getAllBorrows);

module.exports = router;
