import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: '📚',
    title: 'Geniş Kitap Koleksiyonu',
    desc: '39+ kitap, 13 farklı kategori — Türk edebiyatından bilim kurguya, klasiklerden çocuk kitaplarına.',
  },
  {
    icon: '⚡',
    title: 'Anında Ödünç Alma',
    desc: 'Tek tıkla kitap ödünç al, dilediğin zaman iade et. Stok takibi otomatik yapılır.',
  },
  {
    icon: '🔐',
    title: 'Güvenli Hesap',
    desc: 'JWT tabanlı kimlik doğrulama, bcrypt ile şifrelenmiş veriler. Bilgilerin güvende.',
  },
  {
    icon: '📱',
    title: 'Her Cihazda',
    desc: 'Telefon, tablet veya bilgisayar — responsive tasarım sayesinde her ekrana uyum sağlar.',
  },
  {
    icon: '🎨',
    title: 'Modern Arayüz',
    desc: 'Sade, hızlı ve estetik. Karmaşadan uzak, kitaba odaklanan bir deneyim.',
  },
  {
    icon: '👨‍💼',
    title: 'Yönetim Paneli',
    desc: 'Adminler için kitap ekleme, düzenleme, ödünç kayıtlarını takip etme — hepsi tek yerde.',
  },
]

const STATS = [
  { value: '39+', label: 'Kitap' },
  { value: '13', label: 'Kategori' },
  { value: '24/7', label: 'Erişim' },
  { value: '100%', label: 'Ücretsiz' },
]

export default function About() {
  return (
    <div className="space-y-16 py-6">
      {/* Hero */}
      <section className="text-center">
        <span className="badge-brand">Hakkımızda</span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Okumayı{' '}
          <span className="bg-gradient-to-r from-brand-600 to-rose-600 bg-clip-text text-transparent">
            herkes için
          </span>{' '}
          kolaylaştırıyoruz
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          Kütüphane, modern web teknolojileriyle inşa edilmiş, kitap ödünç alma sürecini
          dijitalleştiren açık kaynaklı bir platformdur.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="card p-6 text-center">
            <p className="text-3xl font-extrabold bg-gradient-to-r from-brand-600 to-rose-600 bg-clip-text text-transparent">
              {s.value}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-600">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Neler Sunuyoruz?</h2>
          <p className="mt-2 text-slate-600">
            Modern bir kütüphane deneyimi için ihtiyacın olan her şey.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card-hover p-6">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-100 to-rose-100 text-2xl ring-1 ring-brand-200">
                {f.icon}
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="card overflow-hidden">
        <div className="grid gap-8 p-8 md:grid-cols-2 md:p-12">
          <div>
            <span className="badge-brand">Misyonumuz</span>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              Bilgiyi tek tıkla erişilebilir kılmak
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              İnsanların kitaplara ulaşma şeklini yeniden tanımlıyoruz. Geleneksel kütüphane
              deneyimini modern web teknolojileriyle birleştirerek, herkesin keyifle
              kullanabileceği bir platform sunuyoruz.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/" className="btn-primary">
                Kitapları Keşfet
              </Link>
              <Link to="/contact" className="btn-secondary">
                Bize Ulaş
              </Link>
            </div>
          </div>
          <div className="grid place-items-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-500 to-rose-500 blur-2xl opacity-30" />
              <div className="relative rounded-3xl bg-gradient-to-br from-brand-600 to-rose-600 p-8 text-white shadow-xl">
                <div className="text-6xl">📖</div>
                <p className="mt-4 text-xl font-semibold">Bilgi paylaştıkça çoğalır.</p>
                <p className="mt-2 text-sm text-rose-100">— Anonim</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
