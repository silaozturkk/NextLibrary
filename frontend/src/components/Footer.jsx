import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-brand-500 to-brand-700 text-[10px] font-bold text-white">
              K
            </span>
            <span>© {new Date().getFullYear()} Kütüphane Yönetim Sistemi</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/about" className="hover:text-brand-600 transition">Hakkımızda</Link>
            <Link to="/contact" className="hover:text-brand-600 transition">İletişim</Link>
            <Link to="/faq" className="hover:text-brand-600 transition">SSS</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
