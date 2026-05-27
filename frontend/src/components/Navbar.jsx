import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium rounded-md transition ${
      isActive ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-slate-100'
    }`

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white font-bold">
            K
          </span>
          <span className="text-lg font-semibold text-slate-900">Kütüphane</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>
            Ana Sayfa
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/my-books" className={linkClass}>
              Kitaplarım
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              Yönetim
            </NavLink>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-600">
                Merhaba, <span className="font-medium text-slate-900">{user?.name}</span>
              </span>
              <button onClick={handleLogout} className="btn-secondary">
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                Giriş
              </Link>
              <Link to="/register" className="btn-primary">
                Kayıt Ol
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden rounded-md p-2 text-slate-700 hover:bg-slate-100"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menü"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          <NavLink to="/" onClick={() => setOpen(false)} className={linkClass} end>
            Ana Sayfa
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/my-books" onClick={() => setOpen(false)} className={linkClass}>
              Kitaplarım
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" onClick={() => setOpen(false)} className={linkClass}>
              Yönetim
            </NavLink>
          )}
          <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn-secondary w-full">
                Çıkış ({user?.name})
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary w-full">
                  Giriş
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full">
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
