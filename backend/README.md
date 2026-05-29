# Library Management — Backend

Express + MongoDB REST API.

## Kurulum

```bash
cd backend
npm install
cp .env.example .env   # zaten varsa atla
```

`.env` içinde MONGO_URI ve JWT_SECRET ayarlandığından emin ol.

## Çalıştırma

```bash
npm run dev      # nodemon ile
npm start        # production
npm run seed     # örnek veri (kullanıcılar + kitaplar)
```

Sunucu varsayılan olarak `http://localhost:5000` adresinde çalışır.

## Test Hesapları (seed sonrası)

| Rol   | Email               | Şifre     |
|-------|---------------------|-----------|
| Admin | admin@library.com   | admin123  |
| User  | user@library.com    | user123   |

## API Endpointleri

### Auth
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET  | `/api/auth/profile` | Protected |

### Books
| Method | Path | Auth |
|--------|------|------|
| GET    | `/api/books` | Public |
| GET    | `/api/books/:id` | Public |
| POST   | `/api/books` | Admin |
| PUT    | `/api/books/:id` | Admin |
| DELETE | `/api/books/:id` | Admin |

### Borrow
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/borrow` | Protected |
| PUT  | `/api/borrow/return/:id` | Protected |
| GET  | `/api/borrow/my-books` | Protected |
| GET  | `/api/borrow/all` | Admin |

## Authorization Header

```
Authorization: Bearer <JWT_TOKEN>
```
