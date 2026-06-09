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

const rawBooks = [
  {
    title: 'Suç ve Ceza',
    author: 'Fyodor Dostoyevski',
    isbn: '9789750718533',
    description:
      'Yoksul bir öğrencinin işlediği cinayet üzerinden vicdan, suçluluk ve ahlak üzerine derin bir psikolojik analiz.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780140449136-L.jpg',
  },
  {
    title: 'Sefiller',
    author: 'Victor Hugo',
    isbn: '9789754580160',
    description:
      'Jean Valjean\'ın hayat hikâyesi etrafında 19. yüzyıl Fransa\'sının toplumsal eşitsizlikleri.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780451419439-L.jpg',
  },
  {
    title: 'Yüzyıllık Yalnızlık',
    author: 'Gabriel García Márquez',
    isbn: '9789750719257',
    description:
      'Buendía ailesinin yedi nesil boyunca süren büyülü gerçekçilik şaheseri.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg',
  },
  {
    title: '1984',
    author: 'George Orwell',
    isbn: '9789750718502',
    description:
      'Totaliter bir devletin gözetim altındaki dünyasında bireyin direnişi.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
  },
  {
    title: 'Hayvan Çiftliği',
    author: 'George Orwell',
    isbn: '9789750726927',
    description:
      'Devrim ve iktidarın yozlaşması üzerine politik bir alegori.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780451526342-L.jpg',
  },
  {
    title: 'Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '9789750726859',
    description:
      'Çekingen bir hobbitin hazine peşindeki sürpriz macerası.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg',
  },
  {
    title: 'Harry Potter ve Felsefe Taşı',
    author: 'J.K. Rowling',
    isbn: '9789750726842',
    description:
      'Hogwarts\'a kabul edilen bir çocuğun büyücülük dünyasıyla tanışması.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780747532699-L.jpg',
  },
  {
    title: 'Don Kişot',
    author: 'Miguel de Cervantes',
    isbn: '9789750718526',
    description:
      'Şövalyelik kitaplarına kapılan bir adamın gülünç ve dokunaklı serüvenleri.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780060934347-L.jpg',
  },
  {
    title: 'Bülbülü Öldürmek',
    author: 'Harper Lee',
    isbn: '9789750726828',
    description:
      'Amerikan Güneyi\'nde ırkçılık ve adalet üzerine etkileyici bir hikâye.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg',
  },
  {
    title: 'İnce Memed',
    author: 'Yaşar Kemal',
    isbn: '9789750822704',
    description:
      'Çukurova\'da ağaya başkaldıran bir köylünün destansı öyküsü.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780954201746-L.jpg',
  },
  {
    title: 'Çalıkuşu',
    author: 'Reşat Nuri Güntekin',
    isbn: '9789750822711',
    description:
      'Genç bir öğretmenin Anadolu\'daki yaşam mücadelesi.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9789750822711-L.jpg',
  },
  {
    title: 'Kürk Mantolu Madonna',
    author: 'Sabahattin Ali',
    isbn: '9789750800450',
    description:
      'Berlin\'de geçen unutulmaz bir aşk hikâyesi.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780241293850-L.jpg',
  },
];

// Her kitaptan tek bir kopya bulunsun
const books = rawBooks.map((b) => ({ ...b, totalCopies: 1, availableCopies: 1 }));

const seed = async () => {
  try {
    await connectDB();

    await Borrow.deleteMany();
    await Book.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.create(users);
    await Book.insertMany(books);

    console.log('Seed başarılı!');
    console.log('═══════════════════════════════════════');
    console.log('Admin:', createdUsers[0].email, '/ admin123');
    console.log('User: ', createdUsers[1].email, '/ user123');
    console.log('Toplam kitap:', books.length);
    console.log('═══════════════════════════════════════');
    process.exit(0);
  } catch (err) {
    console.error('Seed hatası:', err);
    process.exit(1);
  }
};

seed();
