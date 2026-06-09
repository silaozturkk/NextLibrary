const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');

// @desc    Tüm kitaplar
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (_req, res) => {
  const books = await Book.find({}).sort({ createdAt: -1 });
  res.json(books);
});

// @desc    Tek kitap
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Kitap bulunamadı');
  }
  res.json(book);
});

// @desc    Kitap oluştur
// @route   POST /api/books
// @access  Private/Admin
const createBook = asyncHandler(async (req, res) => {
  const { title, author, isbn, description, coverImage } = req.body;

  if (!title || !author) {
    res.status(400);
    throw new Error('Başlık ve yazar zorunlu');
  }

  const book = await Book.create({
    title,
    author,
    isbn,
    description,
    coverImage,
    totalCopies: 1,
    availableCopies: 1,
  });

  res.status(201).json(book);
});

// @desc    Kitap güncelle
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Kitap bulunamadı');
  }

  const fields = ['title', 'author', 'isbn', 'description', 'coverImage'];

  fields.forEach((f) => {
    if (req.body[f] !== undefined) book[f] = req.body[f];
  });

  const updated = await book.save();
  res.json(updated);
});

// @desc    Kitap sil
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Kitap bulunamadı');
  }
  await book.deleteOne();
  res.json({ message: 'Kitap silindi' });
});

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
