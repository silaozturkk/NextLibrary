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
  // ═══════════ ROMAN ═══════════
  {
    title: 'Suç ve Ceza',
    author: 'Fyodor Dostoyevski',
    category: 'Roman',
    isbn: '9789750718533',
    description:
      'Yoksul bir öğrencinin işlediği cinayet üzerinden vicdan, suçluluk ve ahlak üzerine derin bir psikolojik analiz.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780140449136-L.jpg',
    totalCopies: 5,
    availableCopies: 5,
  },
  {
    title: 'Karamazov Kardeşler',
    author: 'Fyodor Dostoyevski',
    category: 'Roman',
    isbn: '9789750726934',
    description:
      'Bir baba ve oğullarının karmaşık ilişkileri etrafında inanç, özgür irade ve ahlak sorgulamaları.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780374528379-L.jpg',
    totalCopies: 3,
    availableCopies: 3,
  },
  {
    title: 'Sefiller',
    author: 'Victor Hugo',
    category: 'Roman',
    isbn: '9789754580160',
    description:
      'Jean Valjean\'ın hayat hikâyesi etrafında 19. yüzyıl Fransa\'sının toplumsal eşitsizlikleri.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780451419439-L.jpg',
    totalCopies: 4,
    availableCopies: 4,
  },
  {
    title: 'Anna Karenina',
    author: 'Lev Tolstoy',
    category: 'Roman',
    isbn: '9789750718540',
    description:
      'Aristokrat bir kadının yasak aşkı ve toplum baskısıyla mücadelesi.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780143035008-L.jpg',
    totalCopies: 3,
    availableCopies: 3,
  },
  {
    title: 'Savaş ve Barış',
    author: 'Lev Tolstoy',
    category: 'Roman',
    isbn: '9789750726941',
    description:
      'Napolyon savaşları döneminde Rus aristokrasisinin destansı hikâyesi.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780143039990-L.jpg',
    totalCopies: 2,
    availableCopies: 2,
  },
  {
    title: 'Madame Bovary',
    author: 'Gustave Flaubert',
    category: 'Roman',
    isbn: '9789750726958',
    description:
      'Taşrada sıkışmış bir kadının romantik hayalleri ve trajik sonu.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780140449129-L.jpg',
    totalCopies: 3,
    availableCopies: 3,
  },
  {
    title: 'Yüzyıllık Yalnızlık',
    author: 'Gabriel García Márquez',
    category: 'Roman',
    isbn: '9789750719257',
    description:
      'Buendía ailesinin yedi nesil boyunca süren büyülü gerçekçilik şaheseri.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg',
    totalCopies: 4,
    availableCopies: 4,
  },
  {
    title: 'Beyaz Diş',
    author: 'Jack London',
    category: 'Roman',
    isbn: '9789750719264',
    description: 'Vahşi doğada büyüyen bir kurt-köpeğin medeniyetle tanışması.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780451532503-L.jpg',
    totalCopies: 5,
    availableCopies: 5,
  },

  // ═══════════ DİSTOPYA ═══════════
  {
    title: '1984',
    author: 'George Orwell',
    category: 'Distopya',
    isbn: '9789750718502',
    description:
      'Totaliter bir devletin gözetim altındaki dünyasında bireyin direnişi.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
    totalCopies: 6,
    availableCopies: 6,
  },
  {
    title: 'Hayvan Çiftliği',
    author: 'George Orwell',
    category: 'Distopya',
    isbn: '9789750726927',
    description:
      'Devrim ve iktidarın yozlaşması üzerine politik bir alegori.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780451526342-L.jpg',
    totalCopies: 4,
    availableCopies: 4,
  },
  {
    title: 'Cesur Yeni Dünya',
    author: 'Aldous Huxley',
    category: 'Distopya',
    isbn: '9789750718519',
    description:
      'Genetik mühendislik ve kontrollü mutluluğun hüküm sürdüğü gelecek vizyonu.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg',
    totalCopies: 3,
    availableCopies: 3,
  },
  {
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    category: 'Distopya',
    isbn: '9789750726910',
    description:
      'Kitapların yasak olduğu bir gelecekte itfaiyecinin uyanışı.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781451673319-L.jpg',
    totalCopies: 4,
    availableCopies: 4,
  },

  // ═══════════ TARİH ═══════════
  {
    title: 'Sapiens: İnsan Türünün Kısa Bir Tarihi',
    author: 'Yuval Noah Harari',
    category: 'Tarih',
    isbn: '9786051850284',
    description:
      'İnsanın bilişsel devrimden günümüze yolculuğunu anlatan çığır açıcı eser.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
    totalCopies: 5,
    availableCopies: 5,
  },
  {
    title: 'Homo Deus',
    author: 'Yuval Noah Harari',
    category: 'Tarih',
    isbn: '9786051850291',
    description:
      'Yarının kısa bir tarihi: yapay zeka çağında insanın geleceği.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780062464316-L.jpg',
    totalCopies: 3,
    availableCopies: 3,
  },
  {
    title: 'Nutuk',
    author: 'Mustafa Kemal Atatürk',
    category: 'Tarih',
    isbn: '9789754060010',
    description:
      'Kurtuluş Savaşı ve Cumhuriyet\'in kuruluşunun Atatürk tarafından kaleme alınmış belgesel anlatımı.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9789754060010-L.jpg',
    totalCopies: 5,
    availableCopies: 5,
  },

  // ═══════════ FELSEFE ═══════════
  {
    title: 'Böyle Buyurdu Zerdüşt',
    author: 'Friedrich Nietzsche',
    category: 'Felsefe',
    isbn: '9789750726903',
    description:
      'Üstinsan, bengi dönüş ve değerlerin yeniden değerlendirilmesi üzerine felsefi şiir.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780140441185-L.jpg',
    totalCopies: 3,
    availableCopies: 3,
  },
  {
    title: 'Sofie\'nin Dünyası',
    author: 'Jostein Gaarder',
    category: 'Felsefe',
    isbn: '9789750726897',
    description:
      'Bir genç kız üzerinden Batı felsefesi tarihinin keyifli özeti.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780374530716-L.jpg',
    totalCopies: 4,
    availableCopies: 4,
  },
  {
    title: 'Düşünüyorum Öyleyse Varım',
    author: 'René Descartes',
    category: 'Felsefe',
    isbn: '9789750726880',
    description:
      'Modern felsefenin temel taşı: yöntem üzerine konuşma ve metafizik düşünceler.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780872201927-L.jpg',
    totalCopies: 2,
    availableCopies: 2,
  },

  // ═══════════ BİLİM KURGU ═══════════
  {
    title: 'Dune',
    author: 'Frank Herbert',
    category: 'Bilim Kurgu',
    isbn: '9786053750017',
    description:
      'Çöl gezegeni Arrakis\'te geçen ekoloji, politika ve mistisizmin destansı buluşması.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg',
    totalCopies: 4,
    availableCopies: 4,
  },
  {
    title: 'Vakıf',
    author: 'Isaac Asimov',
    category: 'Bilim Kurgu',
    isbn: '9786053750024',
    description:
      'Galaktik İmparatorluk\'un çöküşü ve uygarlığı kurtarma planı.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780553293357-L.jpg',
    totalCopies: 3,
    availableCopies: 3,
  },
  {
    title: 'Yüzüklerin Efendisi: Yüzük Kardeşliği',
    author: 'J.R.R. Tolkien',
    category: 'Fantastik',
    isbn: '9789750726866',
    description:
      'Orta Dünya\'da kötülüğün yüzüğünü yok etme yolculuğu.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780547928210-L.jpg',
    totalCopies: 5,
    availableCopies: 5,
  },
  {
    title: 'Hobbit',
    author: 'J.R.R. Tolkien',
    category: 'Fantastik',
    isbn: '9789750726859',
    description:
      'Çekingen bir hobbitin hazine peşindeki sürpriz macerası.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg',
    totalCopies: 4,
    availableCopies: 4,
  },
  {
    title: 'Harry Potter ve Felsefe Taşı',
    author: 'J.K. Rowling',
    category: 'Fantastik',
    isbn: '9789750726842',
    description:
      'Hogwarts\'a kabul edilen bir çocuğun büyücülük dünyasıyla tanışması.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780747532699-L.jpg',
    totalCopies: 8,
    availableCopies: 8,
  },

  // ═══════════ KLASİK ═══════════
  {
    title: 'Don Kişot',
    author: 'Miguel de Cervantes',
    category: 'Klasik',
    isbn: '9789750718526',
    description:
      'Şövalyelik kitaplarına kapılan bir adamın gülünç ve dokunaklı serüvenleri.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780060934347-L.jpg',
    totalCopies: 2,
    availableCopies: 2,
  },
  {
    title: 'Moby Dick',
    author: 'Herman Melville',
    category: 'Klasik',
    isbn: '9789750726835',
    description:
      'Beyaz balina avının takıntıya dönüşmüş hikâyesi.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780142437247-L.jpg',
    totalCopies: 3,
    availableCopies: 3,
  },
  {
    title: 'Bülbülü Öldürmek',
    author: 'Harper Lee',
    category: 'Klasik',
    isbn: '9789750726828',
    description:
      'Amerikan Güneyi\'nde ırkçılık ve adalet üzerine etkileyici bir hikâye.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg',
    totalCopies: 4,
    availableCopies: 4,
  },

  // ═══════════ TÜRK EDEBİYATI ═══════════
  {
    title: 'Tutunamayanlar',
    author: 'Oğuz Atay',
    category: 'Türk Edebiyatı',
    isbn: '9789754701869',
    description:
      'Türk modernizminin başyapıtı — yabancılaşma ve kimlik üzerine derin bir roman.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9789754701869-L.jpg',
    totalCopies: 3,
    availableCopies: 3,
  },
  {
    title: 'İnce Memed',
    author: 'Yaşar Kemal',
    category: 'Türk Edebiyatı',
    isbn: '9789750822704',
    description:
      'Çukurova\'da ağaya başkaldıran bir köylünün destansı öyküsü.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780954201746-L.jpg',
    totalCopies: 4,
    availableCopies: 4,
  },
  {
    title: 'Çalıkuşu',
    author: 'Reşat Nuri Güntekin',
    category: 'Türk Edebiyatı',
    isbn: '9789750822711',
    description:
      'Genç bir öğretmenin Anadolu\'daki yaşam mücadelesi.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9789750822711-L.jpg',
    totalCopies: 5,
    availableCopies: 5,
  },
  {
    title: 'Kürk Mantolu Madonna',
    author: 'Sabahattin Ali',
    category: 'Türk Edebiyatı',
    isbn: '9789750800450',
    description:
      'Berlin\'de geçen unutulmaz bir aşk hikâyesi.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780241293850-L.jpg',
    totalCopies: 6,
    availableCopies: 6,
  },
  {
    title: 'Saatleri Ayarlama Enstitüsü',
    author: 'Ahmet Hamdi Tanpınar',
    category: 'Türk Edebiyatı',
    isbn: '9789754588354',
    description:
      'Modernleşme ve bürokrasi üzerine ironik bir başyapıt.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780143106739-L.jpg',
    totalCopies: 3,
    availableCopies: 3,
  },

  // ═══════════ POLİSİYE ═══════════
  {
    title: 'Sherlock Holmes: Kızıl Soruşturma',
    author: 'Arthur Conan Doyle',
    category: 'Polisiye',
    isbn: '9789750726811',
    description:
      'Dünyanın en ünlü dedektifinin ilk macerası.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780140439083-L.jpg',
    totalCopies: 4,
    availableCopies: 4,
  },
  {
    title: 'Doğu Ekspresinde Cinayet',
    author: 'Agatha Christie',
    category: 'Polisiye',
    isbn: '9789750726804',
    description:
      'Hercule Poirot\'nun karlı bir trende çözmek zorunda olduğu cinayet.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780062073495-L.jpg',
    totalCopies: 5,
    availableCopies: 5,
  },

  // ═══════════ KİŞİSEL GELİŞİM ═══════════
  {
    title: 'Atomik Alışkanlıklar',
    author: 'James Clear',
    category: 'Kişisel Gelişim',
    isbn: '9786052109724',
    description:
      'Küçük değişikliklerle hayatı dönüştürmenin bilimsel rehberi.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
    totalCopies: 6,
    availableCopies: 6,
  },
  {
    title: 'Düşünce Hızlı ve Yavaş',
    author: 'Daniel Kahneman',
    category: 'Psikoloji',
    isbn: '9786052109731',
    description:
      'Nobel ödüllü psikoloğun, zihnin iki sistemini açıkladığı eser.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg',
    totalCopies: 4,
    availableCopies: 4,
  },

  // ═══════════ ÇOCUK ═══════════
  {
    title: 'Küçük Prens',
    author: 'Antoine de Saint-Exupéry',
    category: 'Çocuk',
    isbn: '9786055451516',
    description:
      'Tüm yaşlara hitap eden, sevgi ve dostluk üzerine küçük bir başyapıt.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg',
    totalCopies: 8,
    availableCopies: 8,
  },
  {
    title: 'Charlie\'nin Çikolata Fabrikası',
    author: 'Roald Dahl',
    category: 'Çocuk',
    isbn: '9789750726798',
    description:
      'Sihirli bir çikolata fabrikasında geçen büyülü serüven.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780141365374-L.jpg',
    totalCopies: 5,
    availableCopies: 5,
  },

  // ═══════════ BİLİM ═══════════
  {
    title: 'Zamanın Kısa Tarihi',
    author: 'Stephen Hawking',
    category: 'Bilim',
    isbn: '9789750726781',
    description:
      'Big Bang\'den kara deliklere — evrenin sırlarına yolculuk.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg',
    totalCopies: 3,
    availableCopies: 3,
  },
  {
    title: 'Bencil Gen',
    author: 'Richard Dawkins',
    category: 'Bilim',
    isbn: '9789750726774',
    description:
      'Evrim teorisine gen merkezli bakışın klasik eseri.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780198788607-L.jpg',
    totalCopies: 2,
    availableCopies: 2,
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

    const categories = [...new Set(books.map((b) => b.category))];

    console.log('Seed başarılı!');
    console.log('═══════════════════════════════════════');
    console.log('Admin:', createdUsers[0].email, '/ admin123');
    console.log('User: ', createdUsers[1].email, '/ user123');
    console.log('Toplam kitap:', books.length);
    console.log('Kategori sayısı:', categories.length);
    console.log('Kategoriler:', categories.join(', '));
    console.log('═══════════════════════════════════════');
    process.exit(0);
  } catch (err) {
    console.error('Seed hatası:', err);
    process.exit(1);
  }
};

seed();
