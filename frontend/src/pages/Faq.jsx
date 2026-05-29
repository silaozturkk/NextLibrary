import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const FAQS = [
  {
    category: 'Genel',
    items: [
      {
        q: 'Kütüphane Yönetim Sistemi nedir?',
        a: 'Kitap arama, ödünç alma ve iade işlemlerini dijitalleştiren modern bir web platformudur. Kullanıcılar evlerinden kitap ödünç alabilir, geçmişlerini takip edebilir.',
      },
      {
        q: 'Hesap açmak ücretli mi?',
        a: 'Hayır, tüm hesaplar tamamen ücretsizdir. Sadece email ve şifre ile saniyeler içinde kayıt olabilirsiniz.',
      },
      {
        q: 'Hangi cihazlardan kullanabilirim?',
        a: 'Telefon, tablet ve bilgisayar dahil her ekran boyutuna uyumludur. Ayrıca uygulama indirmenize gerek yok — sadece tarayıcı yeterli.',
      },
    ],
  },
  {
    category: 'Hesap & Güvenlik',
    items: [
      {
        q: 'Şifremi unuttum, ne yapmalıyım?',
        a: 'Şu an şifre sıfırlama özelliği yakında geliyor. Bu süreçte iletişim sayfasından bize ulaşırsanız hesabınızı yardımcı olabiliriz.',
      },
      {
        q: 'Verilerim güvende mi?',
        a: 'Evet. Şifreler bcrypt algoritmasıyla hashlenmiş şekilde saklanır, oturumlar JWT (JSON Web Token) ile yönetilir. Hassas verileriniz hiçbir zaman düz metin olarak tutulmaz.',
      },
      {
        q: 'Hesabımı silebilir miyim?',
        a: 'Hesap silme talebi için iletişim sayfasından bize yazabilirsiniz. Talebiniz 7 gün içinde tüm verilerinizle birlikte işleme alınır.',
      },
    ],
  },
  {
    category: 'Ödünç Alma',
    items: [
      {
        q: 'Aynı anda kaç kitap ödünç alabilirim?',
        a: 'Şu an sınır yok ama her kitabın stok durumu ayrı takip ediliyor. "Mevcut" sayısı 0 olan kitap ödünç alınamaz.',
      },
      {
        q: 'Aynı kitabı tekrar ödünç alabilir miyim?',
        a: 'Aktif bir ödünç kaydınız varken aynı kitabı tekrar alamazsınız. Önce iade etmeniz gerekir.',
      },
      {
        q: 'Kitabı nasıl iade ederim?',
        a: '"Kitaplarım" sayfasından aktif ödünçlerinizi görebilir ve "İade Et" butonuyla anında iade işlemini tamamlayabilirsiniz. Stok otomatik güncellenir.',
      },
      {
        q: 'Ödünç süresi var mı?',
        a: 'Şu sürümde sabit bir süre yok ama yakında otomatik hatırlatma sistemi ekleyeceğiz.',
      },
    ],
  },
  {
    category: 'Teknik',
    items: [
      {
        q: 'Hangi teknolojilerle geliştirildi?',
        a: 'MERN Stack: MongoDB (Atlas), Express.js, React, Node.js. Frontend için Tailwind CSS, Vite, Axios ve React Router kullanıldı.',
      },
      {
        q: 'Açık kaynak mı?',
        a: 'Evet, kaynak kodu GitHub üzerinden erişilebilir. Katkıda bulunmak isteyenler iletişim sayfasından bize ulaşabilir.',
      },
    ],
  },
]

export default function Faq() {
  const [search, setSearch] = useState('')
  const [openId, setOpenId] = useState(0)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return FAQS
    return FAQS
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (i) => i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q),
        ),
      }))
      .filter((cat) => cat.items.length > 0)
  }, [search])

  const totalQuestions = FAQS.reduce((acc, c) => acc + c.items.length, 0)

  return (
    <div className="space-y-12 py-6">
      {/* Hero */}
      <section className="text-center">
        <span className="badge-brand">Sıkça Sorulan Sorular</span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Aklındaki{' '}
          <span className="bg-gradient-to-r from-brand-600 to-rose-600 bg-clip-text text-transparent">
            soruların cevabı
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
          {totalQuestions} farklı soru ve cevap. Aradığını bulamazsan iletişim sayfasından bize
          ulaş.
        </p>

        {/* Arama */}
        <div className="mx-auto mt-6 max-w-lg">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Soru ara..."
              className="input pl-10"
            />
          </div>
        </div>
      </section>

      {/* FAQ Listesi */}
      <section className="space-y-10">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-lg font-medium text-slate-700">Sonuç bulunamadı</p>
            <p className="mt-1 text-sm text-slate-500">
              Farklı kelimelerle aramayı deneyebilir veya iletişim sayfasından bize sorabilirsin.
            </p>
            <Link to="/contact" className="btn-primary mt-4">
              İletişime Geç
            </Link>
          </div>
        ) : (
          filtered.map((cat) => (
            <div key={cat.category}>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-700">
                {cat.category}
              </h2>
              <div className="space-y-3">
                {cat.items.map((item) => {
                  const id = `${cat.category}-${item.q}`
                  const isOpen = openId === id
                  return (
                    <div
                      key={id}
                      className={`card overflow-hidden transition ${
                        isOpen ? 'ring-brand-200 shadow-md' : ''
                      }`}
                    >
                      <button
                        onClick={() => setOpenId(isOpen ? null : id)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      >
                        <span className="font-medium text-slate-900">{item.q}</span>
                        <span
                          className={`grid h-7 w-7 flex-shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </button>
                      <div
                        className={`grid transition-all duration-300 ${
                          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </section>

      {/* CTA */}
      <section className="card overflow-hidden bg-gradient-to-br from-brand-600 to-rose-600 p-8 text-center text-white shadow-xl">
        <h3 className="text-2xl font-bold">Sorun cevaplanamadı mı?</h3>
        <p className="mt-2 text-rose-100">
          Endişelenme — destek ekibimiz 24 saat içinde dönüş yapar.
        </p>
        <Link
          to="/contact"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 shadow-md hover:shadow-lg transition"
        >
          İletişime Geç →
        </Link>
      </section>
    </div>
  )
}
