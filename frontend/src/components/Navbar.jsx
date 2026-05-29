import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium rounded-md transition ${
      isActive
        ? 'text-brand-700'
        : 'text-slate-700 hover:text-brand-600'
    }`

  const headerClass = `sticky top-0 z-40 transition-all duration-300 ${
    scrolled
      ? 'bg-white/80 backdrop-blur-md shadow-sm'
      : 'bg-transparent backdrop-blur-0'
  }`

  return (
    <header className={headerClass}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white font-bold shadow-md shadow-brand-600/30 transition-transform group-hover:scale-105">
            K
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Kütüphane
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>
            {({ isActive }) => (
              <>
                Ana Sayfa
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-600" />
                )}
              </>
            )}
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            {({ isActive }) => (
              <>
                Hakkımızda
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-600" />
                )}
              </>
            )}
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            {({ isActive }) => (
              <>
                İletişim
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-600" />
                )}
              </>
            )}
          </NavLink>
          <NavLink to="/faq" className={linkClass}>
            {({ isActive }) => (
              <>
                SSS
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-600" />
                )}
              </>
            )}
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/my-books" className={linkClass}>
              {({ isActive }) => (
                <>
                  Kitaplarım
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-600" />
                  )}
                </>
              )}
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              {({ isActive }) => (
                <>
                  Yönetim
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-600" />
                  )}
                </>
              )}
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

      <div
        className={`h-0.5 bg-gradient-to-r from-transparent via-brand-600 to-transparent transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 space-y-1">
          <NavLink to="/" onClick={() => setOpen(false)} className={linkClass} end>
            Ana Sayfa
          </NavLink>
          <NavLink to="/about" onClick={() => setOpen(false)} className={linkClass}>
            Hakkımızda
          </NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)} className={linkClass}>
            İletişim
          </NavLink>
          <NavLink to="/faq" onClick={() => setOpen(false)} className={linkClass}>
            SSS
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
