const asyncHandler = require('express-async-handler');
const Borrow = require('../models/Borrow');
const Book = require('../models/Book');

// Bir kullanıcının aynı anda ödünç tutabileceği maksimum kitap sayısı
const MAX_ACTIVE_BORROWS = 2;

// @desc    Kitap ödünç al
// @route   POST /api/borrow
// @access  Private
const borrowBook = asyncHandler(async (req, res) => {
  const { bookId } = req.body;

  if (!bookId) {
    res.status(400);
    throw new Error('bookId gerekli');
  }

  const book = await Book.findById(bookId);
  if (!book) {
    res.status(404);
    throw new Error('Kitap bulunamadı');
  }

  if (book.availableCopies <= 0) {
    res.status(400);
    throw new Error('Bu kitabın stoku tükendi');
  }

  // Admin'ler limitten muaf — sınırsız ödünç alabilir
  if (req.user.role !== 'admin') {
    const activeBorrowCount = await Borrow.countDocuments({
      user: req.user._id,
      status: 'borrowed',
    });

    if (activeBorrowCount >= MAX_ACTIVE_BORROWS) {
      res.status(400);
      throw new Error(
        `Ödünç alma limitiniz doldu (${activeBorrowCount}/${MAX_ACTIVE_BORROWS}). Yeni kitap almak için önce bir kitap iade edin.`,
      );
    }
  }

  const existingActive = await Borrow.findOne({
    user: req.user._id,
    book: bookId,
    status: 'borrowed',
  });
  if (existingActive) {
    res.status(400);
    throw new Error('Bu kitap zaten ödünçte');
  }

  book.availableCopies -= 1;
  await book.save();

  const borrow = await Borrow.create({
    user: req.user._id,
    book: book._id,
  });

  const populated = await borrow.populate('book');
  res.status(201).json(populated);
});

// @desc    Kitabı iade et
// @route   PUT /api/borrow/return/:id
// @access  Private
const returnBook = asyncHandler(async (req, res) => {
  const borrow = await Borrow.findById(req.params.id);
  if (!borrow) {
    res.status(404);
    throw new Error('Kayıt bulunamadı');
  }

  const isOwner = borrow.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Bu kayıt size ait değil');
  }

  if (borrow.status === 'returned') {
    res.status(400);
    throw new Error('Bu kitap zaten iade edilmiş');
  }

  borrow.status = 'returned';
  borrow.returnDate = new Date();
  await borrow.save();

  const book = await Book.findById(borrow.book);
  if (book && book.availableCopies < book.totalCopies) {
    book.availableCopies += 1;
    await book.save();
  }

  const populated = await borrow.populate('book');
  res.json(populated);
});

// @desc    Kullanıcının ödünç kayıtları
// @route   GET /api/borrow/my-books
// @access  Private
const getMyBorrows = asyncHandler(async (req, res) => {
  const borrows = await Borrow.find({ user: req.user._id })
    .populate('book')
    .sort({ createdAt: -1 });
  res.json(borrows);
});

// @desc    Tüm ödünç kayıtları
// @route   GET /api/borrow/all
// @access  Private/Admin
const getAllBorrows = asyncHandler(async (_req, res) => {
  const borrows = await Borrow.find({})
    .populate('user', 'name email')
    .populate('book', 'title author')
    .sort({ createdAt: -1 });
  res.json(borrows);
});

// @desc    Kullanıcının ödünç limiti durumu
// @route   GET /api/borrow/limit
// @access  Private
const getBorrowLimit = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const activeCount = await Borrow.countDocuments({
    user: req.user._id,
    status: 'borrowed',
  });
  res.json({
    active: activeCount,
    limit: MAX_ACTIVE_BORROWS,
    remaining: isAdmin ? Infinity : Math.max(0, MAX_ACTIVE_BORROWS - activeCount),
    canBorrow: isAdmin || activeCount < MAX_ACTIVE_BORROWS,
    isUnlimited: isAdmin,
  });
});

module.exports = {
  borrowBook,
  returnBook,
  getMyBorrows,
  getAllBorrows,
  getBorrowLimit,
  MAX_ACTIVE_BORROWS,
};
