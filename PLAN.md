# Kütüphane Yönetim Sistemi - Geliştirme Planı

> **Proje:** Library Management System (MERN Stack)
> **Stack:** MongoDB, Express.js, React.js, Node.js
> **Süre Tahmini:** 4-6 hafta

---

## İçindekiler

1. [Proje Hazırlık Aşaması](#faz-0--proje-hazırlığı)
2. [Backend Geliştirme](#faz-1--backend-geliştirme)
3. [Frontend Geliştirme](#faz-2--frontend-geliştirme)
4. [Entegrasyon ve Test](#faz-3--entegrasyon-ve-test)
5. [Deployment](#faz-4--deployment)
6. [Bonus Özellikler](#faz-5--bonus-özellikler)

---

## FAZ 0 — Proje Hazırlığı

**Süre:** 1-2 gün

### 0.1 Geliştirme Ortamı Kurulumu

- [ ] Node.js (v18+) kurulumu doğrula
- [ ] MongoDB Atlas hesabı oluştur veya lokal MongoDB kur
- [ ] VS Code / Cursor IDE hazırla
- [ ] Postman / Thunder Client kur (API testleri için)
- [ ] Git deposu (repository) oluştur

### 0.2 Klasör Yapısı

- [ ] Ana proje klasörünü oluştur
- [ ] `backend/` ve `frontend/` alt klasörlerini oluştur
- [ ] `.gitignore` dosyası ekle (`node_modules`, `.env`, `dist`)
- [ ] Kök dizinde `README.md` oluştur

### 0.3 Planlama

- [ ] Veritabanı şemasını çiz (User, Book, Borrow ilişkileri)
- [ ] API endpoint listesini hazırla
- [ ] Sayfa wireframe'lerini taslakla
- [ ] Renk paleti ve UI stilini belirle

---

## FAZ 1 — Backend Geliştirme

**Süre:** 1-2 hafta

### 1.1 Express Sunucusu Kurulumu

- [ ] `backend/` klasörüne git, `npm init -y` çalıştır
- [ ] Bağımlılıkları kur:
  ```bash
  npm install express mongoose dotenv cors bcryptjs jsonwebtoken
  npm install -D nodemon
  ```
- [ ] `package.json` içine script ekle: `"dev": "nodemon server.js"`
- [ ] PRD'de tanımlı klasör yapısını oluştur:
  - `config/`, `controllers/`, `middleware/`, `models/`, `routes/`, `utils/`

### 1.2 Temel Sunucu (`server.js`)

- [ ] Express uygulamasını başlat
- [ ] `cors` ve `express.json()` middleware'lerini ekle
- [ ] `.env` dosyasını yapılandır (`PORT`, `MONGO_URI`, `JWT_SECRET`)
- [ ] Sağlık kontrolü (`/`) endpoint'i ekle
- [ ] Port dinleme: `app.listen(PORT)`

### 1.3 Veritabanı Bağlantısı

- [ ] `config/db.js` içinde `connectDB()` fonksiyonu yaz
- [ ] Mongoose ile MongoDB'ye bağlan
- [ ] Bağlantı başarı/hata mesajlarını logla
- [ ] `server.js` içinde çağır

### 1.4 Veri Modelleri

#### User Modeli (`models/User.js`)
- [ ] Şemayı tanımla (name, email, password, role, createdAt)
- [ ] Email için `unique: true`
- [ ] Password için `minlength: 6`
- [ ] `role` için enum: `['user', 'admin']`, varsayılan `'user'`
- [ ] `pre('save')` hook ile bcrypt password hash
- [ ] `matchPassword()` instance method'u ekle

#### Book Modeli (`models/Book.js`)
- [ ] Şemayı tanımla (title, author, category, isbn, description, coverImage, totalCopies, availableCopies)
- [ ] `title` ve `author` için `required: true`
- [ ] `totalCopies` ve `availableCopies` için `min: 0`
- [ ] `timestamps: true` ekle

#### Borrow Modeli (`models/Borrow.js`)
- [ ] Şemayı tanımla (user, book, borrowDate, returnDate, status)
- [ ] `user` ve `book` için `ObjectId` ref
- [ ] `status` için enum: `['borrowed', 'returned']`
- [ ] `borrowDate` için `default: Date.now`

### 1.5 Middleware

#### Auth Middleware (`middleware/authMiddleware.js`)
- [ ] `protect` fonksiyonu: Authorization header'dan JWT al
- [ ] Token'ı doğrula (`jwt.verify`)
- [ ] User'ı bul ve `req.user`'a ata
- [ ] Hata durumunda 401 dön

#### Role Middleware (`middleware/roleMiddleware.js`)
- [ ] `adminOnly` fonksiyonu yaz
- [ ] `req.user.role === 'admin'` kontrolü
- [ ] Değilse 403 dön

#### Error Middleware (`middleware/errorMiddleware.js`)
- [ ] Genel hata yakalayıcı (`errorHandler`)
- [ ] `notFound` middleware'i (404)

### 1.6 Authentication Controller

`controllers/authController.js`:

- [ ] `registerUser`: name/email/password al, kullanıcı oluştur, JWT dön
- [ ] `loginUser`: kimlik doğrula, JWT dön
- [ ] `getProfile`: `req.user`'ı dön
- [ ] `generateToken(id)` helper fonksiyonu (`utils/generateToken.js`)

### 1.7 Auth Routes (`routes/authRoutes.js`)

- [ ] `POST /api/auth/register`
- [ ] `POST /api/auth/login`
- [ ] `GET /api/auth/profile` (protected)

### 1.8 Book Controller

`controllers/bookController.js`:

- [ ] `getBooks`: tüm kitapları getir (arama/filtre query desteği)
- [ ] `getBookById`: tek kitap detayı
- [ ] `createBook` (admin): yeni kitap ekle
- [ ] `updateBook` (admin): kitap güncelle
- [ ] `deleteBook` (admin): kitap sil

### 1.9 Book Routes (`routes/bookRoutes.js`)

- [ ] `GET /api/books` (public)
- [ ] `GET /api/books/:id` (public)
- [ ] `POST /api/books` (protected + admin)
- [ ] `PUT /api/books/:id` (protected + admin)
- [ ] `DELETE /api/books/:id` (protected + admin)

### 1.10 Borrow Controller

`controllers/borrowController.js`:

- [ ] `borrowBook`: 
  - Kitabın `availableCopies > 0` olduğunu kontrol et
  - Borrow kaydı oluştur
  - `availableCopies--`
- [ ] `returnBook`: 
  - Borrow kaydını bul, status'u `'returned'` yap
  - `returnDate` set et
  - `availableCopies++`
- [ ] `getMyBorrows`: kullanıcının kayıtları
- [ ] `getAllBorrows` (admin): tüm kayıtlar (populate user & book)

### 1.11 Borrow Routes (`routes/borrowRoutes.js`)

- [ ] `POST /api/borrow` (protected)
- [ ] `PUT /api/borrow/return/:id` (protected)
- [ ] `GET /api/borrow/my-books` (protected)
- [ ] `GET /api/borrow/all` (protected + admin)

### 1.12 Backend Test

- [ ] Postman ile tüm endpointleri test et
- [ ] Register → Login → Profile akışını doğrula
- [ ] Kitap CRUD'unu admin token ile test et
- [ ] Borrow / return akışını test et
- [ ] Hata senaryolarını test et (geçersiz token, eksik veri vb.)

---

## FAZ 2 — Frontend Geliştirme

**Süre:** 2-3 hafta

### 2.1 React Projesi Kurulumu

- [ ] Vite ile React projesi oluştur: `npm create vite@latest frontend -- --template react`
- [ ] Bağımlılıkları kur:
  ```bash
  npm install react-router-dom axios react-toastify
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- [ ] Tailwind'i `index.css`'e import et
- [ ] `tailwind.config.js` content paths'i ayarla

### 2.2 Klasör Yapısı

- [ ] `src/` altında PRD'deki klasörleri oluştur:
  - `api/`, `components/`, `context/`, `pages/`, `routes/`

### 2.3 Axios Setup (`api/axios.js`)

- [ ] Axios instance oluştur (`baseURL: http://localhost:5000/api`)
- [ ] Request interceptor: localStorage'dan token al, header'a ekle
- [ ] Response interceptor: 401 yakalayınca logout

### 2.4 Auth Context (`context/AuthContext.jsx`)

- [ ] Context ve Provider oluştur
- [ ] State'ler: `user`, `token`, `loading`
- [ ] Fonksiyonlar: `login()`, `register()`, `logout()`
- [ ] `useEffect` ile localStorage'dan token oku
- [ ] `useAuth()` custom hook export et

### 2.5 Routing Setup (`App.jsx`)

- [ ] `BrowserRouter` ile sarmalama
- [ ] Route'ları tanımla:
  - `/` → Home
  - `/login` → Login
  - `/register` → Register
  - `/books/:id` → BookDetail
  - `/my-books` → MyBooks (protected)
  - `/admin` → AdminDashboard (admin only)
- [ ] `ToastContainer` ekle

### 2.6 Ortak Componentler

#### Navbar (`components/Navbar.jsx`)
- [ ] Logo + nav linkleri
- [ ] Giriş yapılmışsa: Profile/Logout buton
- [ ] Admin için: Dashboard linki
- [ ] Mobil için hamburger menü

#### Footer (`components/Footer.jsx`)
- [ ] Telif hakkı, iletişim, sosyal medya linkleri

#### BookCard (`components/BookCard.jsx`)
- [ ] Kapak görseli, başlık, yazar, kategori
- [ ] "Detayları Gör" butonu
- [ ] Müsaitlik durumu badge'i

#### SearchBar (`components/SearchBar.jsx`)
- [ ] Input + arama butonu
- [ ] onChange ile debounce'lu arama
- [ ] Kategori filtre dropdown'u

#### LoadingSpinner (`components/LoadingSpinner.jsx`)
- [ ] Tailwind animasyonlu spinner

#### Modal (`components/Modal.jsx`)
- [ ] Yeniden kullanılabilir modal (props: isOpen, onClose, children)

#### ProtectedRoute (`components/ProtectedRoute.jsx`)
- [ ] Token yoksa `/login`'e yönlendir
- [ ] `adminOnly` prop'u ile rol kontrolü

### 2.7 Sayfa Bileşenleri

#### Home (`pages/Home.jsx`)
- [ ] Tüm kitapları çek (`GET /api/books`)
- [ ] Grid layout ile BookCard'ları göster
- [ ] SearchBar entegrasyonu
- [ ] Kategori filtresi
- [ ] Sayfalama (pagination) - opsiyonel
- [ ] Loading ve empty state

#### Login (`pages/Login.jsx`)
- [ ] Email + password formu
- [ ] Form validasyonu
- [ ] AuthContext.login() çağrısı
- [ ] Başarılı giriş → `/` yönlendirme + toast

#### Register (`pages/Register.jsx`)
- [ ] Name + email + password formu
- [ ] Şifre minimum 6 karakter kontrolü
- [ ] AuthContext.register() çağrısı
- [ ] Başarılı kayıt → otomatik giriş

#### BookDetail (`pages/BookDetail.jsx`)
- [ ] URL'den `id` al, kitabı çek
- [ ] Kitap detaylarını göster
- [ ] "Ödünç Al" butonu (giriş yapılmışsa ve `availableCopies > 0`)
- [ ] Admin için: Düzenle/Sil butonları

#### MyBooks (`pages/MyBooks.jsx`)
- [ ] Kullanıcının ödünç aldıklarını listele
- [ ] "Aktif" ve "Geçmiş" tab'leri
- [ ] "İade Et" butonu (status: borrowed)

#### AdminDashboard (`pages/AdminDashboard.jsx`)
- [ ] Tüm kitapları tabloda göster
- [ ] "Yeni Kitap Ekle" butonu → Modal form
- [ ] Her satırda Düzenle/Sil butonları
- [ ] Tüm borrow kayıtlarını gösteren ayrı bir sekme

### 2.8 Responsive Tasarım

- [ ] Tüm sayfaları mobil (`sm:`), tablet (`md:`), masaüstü (`lg:`) için optimize et
- [ ] Navbar'ı mobil için hamburger menüye dönüştür
- [ ] BookCard grid'ini responsive yap (1 → 2 → 3 → 4 sütun)
- [ ] Tabloları mobilde kart görünümüne dönüştür

### 2.9 UI/UX İyileştirmeleri

- [ ] Tüm async işlemler için loading state'i
- [ ] Başarı/hata için toast bildirimleri
- [ ] Form validasyon mesajları
- [ ] Boş ekran (empty state) tasarımları
- [ ] Hover/focus animasyonları

---

## FAZ 3 — Entegrasyon ve Test

**Süre:** 3-5 gün

### 3.1 End-to-End Test

- [ ] Register → Login akışı
- [ ] Kitap arama ve filtreleme
- [ ] Ödünç alma → My Books'ta görme → iade etme
- [ ] Admin: kitap ekleme/güncelleme/silme
- [ ] Admin: tüm borrow kayıtlarını görüntüleme

### 3.2 Hata Senaryoları

- [ ] Geçersiz token ile API çağrısı
- [ ] Yetkisiz erişim (user → admin endpointi)
- [ ] Mevcut olmayan kitabı ödünç alma
- [ ] `availableCopies = 0` iken ödünç alma

### 3.3 Veri Tutarlılığı

- [ ] Ödünç alındığında `availableCopies` doğru azalıyor mu?
- [ ] İade edildiğinde `availableCopies` doğru artıyor mu?
- [ ] Borrow geçmişi korunuyor mu?

### 3.4 Güvenlik Kontrolleri

- [ ] Şifreler veritabanında hashlenmiş mi?
- [ ] JWT secret `.env` dosyasında mı?
- [ ] `.env` `.gitignore`'da mı?
- [ ] Korumalı endpointler gerçekten korumalı mı?

---

## FAZ 4 — Deployment

**Süre:** 2-3 gün (opsiyonel)

### 4.1 Backend Deploy

- [ ] MongoDB Atlas üzerinde production database hazırla
- [ ] Render / Railway / Heroku üzerinde backend deploy et
- [ ] Environment variables'ları platform üzerinden ekle
- [ ] CORS'a frontend URL'sini ekle

### 4.2 Frontend Deploy

- [ ] `.env` dosyasında production API URL'sini ayarla
- [ ] `npm run build` ile production build oluştur
- [ ] Vercel / Netlify üzerinde frontend deploy et

### 4.3 Production Doğrulama

- [ ] Deploy edilmiş uygulamada tüm akışları test et
- [ ] Konsol hatalarını kontrol et
- [ ] Lighthouse skoru ile performans incele

---

## FAZ 5 — Bonus Özellikler

**Süre:** İsteğe bağlı

- [ ] Dark mode (Tailwind dark: variant + Context)
- [ ] Kitap puanlama sistemi (1-5 yıldız)
- [ ] Favori kitaplar (kullanıcıya özel liste)
- [ ] Pagination (kitap listesinde)
- [ ] Gelişmiş arama (debounce + multi-field)
- [ ] Admin için istatistik dashboard'u (Chart.js)
- [ ] Cloudinary/Multer ile resim yükleme
- [ ] Nodemailer ile email bildirimleri
- [ ] Kitap iade tarihi hatırlatması
- [ ] PDF rapor indirme

---

## Kabul Kriterleri (PRD Madde 16)

Proje başarılı sayılır eğer:

- [x] MERN stack tamamen kullanıldı
- [ ] CRUD operasyonları doğru çalışıyor
- [ ] JWT authentication fonksiyonel
- [ ] MongoDB ilişkileri uygulandı
- [ ] Frontend responsive
- [ ] Korumalı route'lar düzgün çalışıyor
- [ ] REST API standartlarına uyuldu
- [ ] En az 3 veritabanı modeli mevcut (User, Book, Borrow)
- [ ] En az 8 React component mevcut
- [ ] En az 4 frontend route mevcut

---

## Önemli Notlar

### Geliştirme İpuçları

- Her özelliği teker teker tamamla ve commit at
- Backend ve frontend'i ayrı terminallerde aynı anda çalıştır
- Postman koleksiyonu oluştur, ekibinle paylaş
- Error handling'i ihmal etme — toast mesajlarıyla kullanıcıya bildir
- Mobile-first yaklaşımı benimse

### Yaygın Hatalar

- CORS hatası → backend'de `cors()` middleware'ini doğru yapılandır
- Token gönderilmiyor → axios interceptor'ı kontrol et
- MongoDB connection timeout → IP whitelist (Atlas'ta `0.0.0.0/0`)
- Şifre eşleşmiyor → bcrypt.compare()'i doğru kullan

### Test Hesapları (Geliştirme İçin)

```
Admin: admin@library.com / admin123
User:  user@library.com / user123
```

---

## Kaynaklar

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [React Router Docs](https://reactrouter.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [JWT.io](https://jwt.io/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
