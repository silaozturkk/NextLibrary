import { useState } from 'react'
import { toast } from 'react-toastify'

const CONTACT_INFO = [
  {
    icon: '📧',
    title: 'E-posta',
    value: 'iletisim@kutuphane.com',
    href: 'mailto:iletisim@kutuphane.com',
  },
  {
    icon: '📞',
    title: 'Telefon',
    value: '+90 555 555 55 55',
    href: 'tel:+905555555555',
  },
  {
    icon: '📍',
    title: 'Adres',
    value: 'Ankara, Türkiye',
    href: null,
  },
  {
    icon: '🕐',
    title: 'Çalışma Saatleri',
    value: 'Hafta içi 09:00 — 18:00',
    href: null,
  },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'İsim gerekli'
    if (!form.email) e.email = 'Email gerekli'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Geçerli bir email girin'
    if (!form.subject.trim()) e.subject = 'Konu gerekli'
    if (!form.message.trim()) e.message = 'Mesaj gerekli'
    else if (form.message.length < 10) e.message = 'En az 10 karakter olmalı'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setSending(true)
    await new Promise((r) => setTimeout(r, 800))
    toast.success('Mesajın bize ulaştı, en kısa sürede dönüş yapacağız!')
    setForm({ name: '', email: '', subject: '', message: '' })
    setSending(false)
  }

  return (
    <div className="space-y-12 py-6">
      <section className="text-center">
        <span className="badge-brand">İletişim</span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Bize{' '}
          <span className="bg-gradient-to-r from-brand-600 to-rose-600 bg-clip-text text-transparent">
            ulaşın
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
          Sorun, öneri veya işbirliği teklifin mi var? Aşağıdaki formdan bize yaz, en kısa
          sürede dönüş yapalım.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        {/* Bilgi Kartları */}
        <div className="space-y-4 lg:col-span-1">
          {CONTACT_INFO.map((item) => {
            const Wrapper = item.href ? 'a' : 'div'
            return (
              <Wrapper
                key={item.title}
                {...(item.href ? { href: item.href } : {})}
                className={`card flex items-start gap-4 p-5 ${
                  item.href ? 'hover:ring-brand-200 hover:shadow-md transition' : ''
                }`}
              >
                <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-100 to-rose-100 text-2xl ring-1 ring-brand-200">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                    {item.title}
                  </p>
                  <p className="mt-1 text-slate-900 font-medium break-words">{item.value}</p>
                </div>
              </Wrapper>
            )
          })}

          <div className="card overflow-hidden p-5 bg-gradient-to-br from-brand-600 to-rose-600 text-white">
            <p className="text-sm font-medium text-rose-100">Bizi Takip Et</p>
            <div className="mt-3 flex gap-2">
              {['Twitter', 'Instagram', 'GitHub'].map((name) => (
                <a
                  key={name}
                  href="#"
                  className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium ring-1 ring-white/20 backdrop-blur hover:bg-white/25 transition"
                >
                  {name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card p-6 sm:p-8 lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-900">Mesaj Gönder</h2>
          <p className="mt-1 text-sm text-slate-600">
            Formu doldur, sana 24 saat içinde dönüş yapalım.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">İsim</label>
                <input
                  type="text"
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Adınız Soyadınız"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ornek@email.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Konu</label>
              <input
                type="text"
                className="input"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Mesajınızın konusu"
              />
              {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Mesaj</label>
              <textarea
                rows="5"
                className="input resize-none"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Mesajınızı buraya yazın..."
              />
              {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
            </div>

            <button type="submit" disabled={sending} className="btn-primary w-full sm:w-auto">
              {sending ? 'Gönderiliyor...' : 'Mesajı Gönder'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
