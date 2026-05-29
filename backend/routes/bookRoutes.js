const express = require('express');
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

const router = express.Router();

router.route('/').get(getBooks).post(protect, adminOnly, createBook);

router
  .route('/:id')
  .get(getBookById)
  .put(protect, adminOnly, updateBook)
  .delete(protect, adminOnly, deleteBook);

module.exports = router;
