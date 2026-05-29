import { Link } from 'react-router-dom'

const FALLBACK_COVER =
  'https://placehold.co/300x400/e2e8f0/64748b?text=Kitap+Kapa%C4%9F%C4%B1'

export default function BookCard({ book }) {
  const available = (book?.availableCopies ?? 0) > 0
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
        <span
          className={`absolute top-2 right-2 badge backdrop-blur-sm whitespace-nowrap shadow-sm ${
            available
              ? 'bg-emerald-500/90 text-white'
              : 'bg-brand-600/90 text-white'
          }`}
        >
          {available ? `${book.availableCopies} mevcut` : 'Tükendi'}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4 space-y-2">
        <h3 className="line-clamp-2 font-semibold text-slate-900 group-hover:text-brand-700 transition" title={book?.title}>
          {book?.title}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-1">{book?.author}</p>
        {book?.category && (
          <span className="badge-brand w-fit">{book.category}</span>
        )}
        <Link to={`/books/${book?._id}`} className="btn-primary w-full mt-auto">
          Detayları Gör
        </Link>
      </div>
    </div>
  )
}
