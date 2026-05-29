import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthSidePanel from '../components/AuthSidePanel'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email gerekli'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Geçerli bir email girin'
    if (!form.password) e.password = 'Şifre gerekli'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch (_) {}
  }

  return (
    <div className="grid min-h-[80vh] gap-8 lg:grid-cols-2">
      <AuthSidePanel
        title="Tekrar hoş geldin!"
        subtitle="Hesabına giriş yap, kaldığın yerden devam et. Yeni kitaplar seni bekliyor."
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

            <span className="badge-brand">Giriş Yap</span>
            <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              Hesabına gir
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Email ve şifrenle giriş yap.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
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
                  placeholder="••••••"
                  autoComplete="current-password"
                />
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Hesabın yok mu?{' '}
              <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
                Kayıt ol →
              </Link>
            </p>
          </div>

          <div className="mt-4 rounded-xl bg-brand-50/50 p-4 text-xs text-slate-600 ring-1 ring-brand-100">
            <p className="font-semibold text-brand-700">Test hesapları</p>
            <p className="mt-1">
              <span className="font-mono">admin@library.com</span> / <span className="font-mono">admin123</span>
            </p>
            <p>
              <span className="font-mono">user@library.com</span> / <span className="font-mono">user123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
