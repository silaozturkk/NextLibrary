import { useAuth } from '../context/AuthContext'

const FALLBACK_COVER =
  'https://placehold.co/300x400/e2e8f0/64748b?text=Kitap+Kapa%C4%9F%C4%B1'

export default function BookCard({ book, onBorrow, borrowing = false }) {
  const { isAuthenticated } = useAuth()

  const handleClick = () => {
    if (onBorrow) onBorrow(book?._id)
  }

  const buttonLabel = borrowing
    ? 'Ödünç alınıyor...'
    : !isAuthenticated
    ? 'Ödünç almak için giriş yap'
    : 'Ödünç Al'

  return (
    <div className="group card-hover overflow-hidden flex flex-col">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        <img
          src={book?.coverImage || FALLBACK_COVER}
          alt={book?.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_COVER
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col p-4 space-y-2">
        <h3 className="line-clamp-2 font-semibold text-slate-900 transition" title={book?.title}>
          {book?.title}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-1">{book?.author}</p>
        <button
          type="button"
          onClick={handleClick}
          disabled={borrowing}
          className="btn-primary w-full mt-auto"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}
