require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Book = require('../models/Book');
const Borrow = require('../models/Borrow');

const users = [
  { name: 'Admin', email: 'admin@library.com', password: 'admin123', role: 'admin' },
  { name: 'Test Kullanıcı', email: 'user@library.com', password: 'user123', role: 'user' },
];

const books = [
  {
    title: 'Suç ve Ceza',
    author: 'Fyodor Dostoyevski',
    category: 'Roman',
    isbn: '9789750718533',
    description: 'Rus edebiyatının başyapıtlarından biri.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780140449136-L.jpg',
    totalCopies: 5,
    availableCopies: 5,
  },
  {
    title: 'Sefiller',
    author: 'Victor Hugo',
    category: 'Roman',
    isbn: '9789754580160',
    description: 'Fransız edebiyatının klasiklerinden.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780451419439-L.jpg',
    totalCopies: 3,
    availableCopies: 3,
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'Tarih',
    isbn: '9786051850284',
    description: 'İnsan türünün kısa tarihi.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
    totalCopies: 4,
    availableCopies: 4,
  },
  {
    title: '1984',
    author: 'George Orwell',
    category: 'Distopya',
    isbn: '9789750718533',
    description: 'Distopik bir gelecek vizyonu.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
    totalCopies: 6,
    availableCopies: 6,
  },
  {
    title: 'Hayvan Çiftliği',
    author: 'George Orwell',
    category: 'Roman',
    isbn: '9789750726927',
    description: 'Politik bir alegori.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780451526342-L.jpg',
    totalCopies: 3,
    availableCopies: 3,
  },
  {
    title: 'Küçük Prens',
    author: 'Antoine de Saint-Exupéry',
    category: 'Çocuk',
    isbn: '9786055451516',
    description: 'Tüm yaşlara hitap eden bir klasik.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg',
    totalCopies: 8,
    availableCopies: 8,
  },
];

const seed = async () => {
  try {
    await connectDB();

    await Borrow.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.create(users);
    await Book.insertMany(books);

    console.log('Seed başarılı!');
    console.log('---');
    console.log('Admin:', createdUsers[0].email, '/ admin123');
    console.log('User: ', createdUsers[1].email, '/ user123');
    console.log('Kitap sayısı:', books.length);
    process.exit(0);
  } catch (err) {
    console.error('Seed hatası:', err);
    process.exit(1);
  }
};

seed();
