import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})

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

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
      <div className="card w-full p-8">
        <h1 className="text-2xl font-bold text-slate-900">Yeni hesap oluştur</h1>
        <p className="mt-1 text-sm text-slate-600">Bir dakikadan kısa sürede kayıt ol.</p>

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
            <label className="mb-1 block text-sm font-medium text-slate-700">Şifre</label>
            <input
              type="password"
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="En az 6 karakter"
              autoComplete="new-password"
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Şifre (Tekrar)</label>
            <input
              type="password"
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
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  )
}
