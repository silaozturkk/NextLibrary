export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} Kütüphane Yönetim Sistemi. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-brand-600 transition">Hakkımızda</a>
            <a href="#" className="hover:text-brand-600 transition">İletişim</a>
            <a href="#" className="hover:text-brand-600 transition">Gizlilik</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
