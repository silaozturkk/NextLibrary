import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

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
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
      <div className="card w-full p-8">
        <h1 className="text-2xl font-bold text-slate-900">Hoş geldin</h1>
        <p className="mt-1 text-sm text-slate-600">Hesabına giriş yap.</p>

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
            <label className="mb-1 block text-sm font-medium text-slate-700">Şifre</label>
            <input
              type="password"
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
          <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700">
            Kayıt ol
          </Link>
        </p>
      </div>
    </div>
  )
}
