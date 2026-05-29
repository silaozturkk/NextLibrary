const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');

// @desc    Tüm kitaplar (arama + filtre destekli)
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ title: regex }, { author: regex }, { isbn: regex }];
  }

  const books = await Book.find(filter).sort({ createdAt: -1 });
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
  const {
    title,
    author,
    category,
    isbn,
    description,
    coverImage,
    totalCopies,
    availableCopies,
  } = req.body;

  if (!title || !author) {
    res.status(400);
    throw new Error('Başlık ve yazar zorunlu');
  }

  const total = Number(totalCopies ?? 1);
  const available = Number(availableCopies ?? total);

  if (available > total) {
    res.status(400);
    throw new Error('Mevcut kopya toplam kopyadan fazla olamaz');
  }

  const book = await Book.create({
    title,
    author,
    category,
    isbn,
    description,
    coverImage,
    totalCopies: total,
    availableCopies: available,
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

  const fields = [
    'title',
    'author',
    'category',
    'isbn',
    'description',
    'coverImage',
    'totalCopies',
    'availableCopies',
  ];

  fields.forEach((f) => {
    if (req.body[f] !== undefined) book[f] = req.body[f];
  });

  if (book.availableCopies > book.totalCopies) {
    res.status(400);
    throw new Error('Mevcut kopya toplam kopyadan fazla olamaz');
  }

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
