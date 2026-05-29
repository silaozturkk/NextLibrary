const FEATURES = [
  { icon: '📚', text: '39+ kitap, 13 kategori' },
  { icon: '⚡', text: 'Anında ödünç al, iade et' },
  { icon: '🔐', text: 'JWT ile güvenli oturum' },
  { icon: '📱', text: 'Her cihazda akıcı deneyim' },
]

export default function AuthSidePanel({ title, subtitle }) {
  return (
    <div className="relative hidden lg:flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-rose-700 p-10 text-white shadow-xl shadow-brand-900/30">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-rose-400/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-brand-400/30 blur-3xl pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      {/* Üst: Logo */}
      <div className="relative flex items-center gap-2.5">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 text-white font-bold backdrop-blur ring-1 ring-white/20 shadow-lg">
          K
        </span>
        <span className="text-xl font-bold tracking-tight">Kütüphane</span>
      </div>

      {/* Orta: Başlık */}
      <div className="relative space-y-6">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/20 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-200" />
            Modern Kütüphane Deneyimi
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight xl:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-rose-100 leading-relaxed">{subtitle}</p>
        </div>

        <ul className="space-y-3">
          {FEATURES.map((f) => (
            <li key={f.text} className="flex items-center gap-3 text-sm">
              <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-white/10 text-base ring-1 ring-white/15 backdrop-blur">
                {f.icon}
              </span>
              <span className="text-white/95">{f.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Alt: Alıntı */}
      <div className="relative">
        <div className="rounded-xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
          <p className="text-sm italic text-white/95 leading-relaxed">
            "Bir kitap satın aldığınızda yeni bir hayat satın almış olursunuz."
          </p>
          <p className="mt-2 text-xs text-rose-100">— Cemil Meriç</p>
        </div>
      </div>
    </div>
  )
}
