import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthSidePanel from '../components/AuthSidePanel'

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'İsim gerekli'
    if (!form.email) e.email = 'Email gerekli'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Geçerli bir email girin'
    if (!form.password) e.password = 'Şifre gerekli'
    else if (form.password.length < 6) e.password = 'Şifre en az 6 karakter olmalı'
    if (form.password !== form.confirm) e.confirm = 'Şifreler eşleşmiyor'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    try {
      await register(form.name, form.email, form.password)
      navigate('/', { replace: true })
    } catch (_) {}
  }

  // Şifre güçlülüğü
  const passwordStrength = (() => {
    const p = form.password
    if (!p) return null
    let score = 0
    if (p.length >= 6) score++
    if (p.length >= 10) score++
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++
    if (/\d/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    const labels = ['Çok zayıf', 'Zayıf', 'Orta', 'İyi', 'Güçlü']
    const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-500', 'bg-emerald-500']
    return {
      label: labels[Math.min(score, 4)],
      color: colors[Math.min(score, 4)],
      width: `${Math.min(score, 5) * 20}%`,
    }
  })()

  return (
    <div className="grid min-h-[80vh] gap-8 lg:grid-cols-2">
      <AuthSidePanel
        title="Kütüphaneye katıl"
        subtitle="Bir dakikadan kısa sürede hesabını oluştur, yüzlerce kitap arasından dilediğini ödünç al."
      />

      <div className="flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="card p-8 sm:p-10">
            <div className="lg:hidden mb-6 flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white font-bold shadow-md shadow-brand-600/30">
                K
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-900">Kütüphane</span>
            </div>

            <span className="badge-brand">Kayıt Ol</span>
            <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              Yeni hesap oluştur
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Bilgilerini doldur, hemen başla.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
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
                  autoComplete="email"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">Şifre</label>
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700"
                  >
                    {showPass ? 'Gizle' : 'Göster'}
                  </button>
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="En az 6 karakter"
                  autoComplete="new-password"
                />
                {passwordStrength && (
                  <div className="mt-2">
                    <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: passwordStrength.width }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Şifre gücü: <span className="font-medium text-slate-700">{passwordStrength.label}</span>
                    </p>
                  </div>
                )}
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Şifre (Tekrar)</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  autoComplete="new-password"
                />
                {errors.confirm && <p className="mt-1 text-xs text-red-600">{errors.confirm}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Hesap oluşturuluyor...' : 'Kayıt Ol'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Zaten hesabın var mı?{' '}
              <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
                Giriş yap →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
