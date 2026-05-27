import { Link } from 'react-router-dom'

const FALLBACK_COVER =
  'https://placehold.co/300x400/e2e8f0/64748b?text=Kitap+Kapa%C4%9F%C4%B1'

export default function BookCard({ book }) {
  const available = (book?.availableCopies ?? 0) > 0
  return (
    <div className="card overflow-hidden transition hover:shadow-md hover:-translate-y-0.5">
      <div className="aspect-[3/4] w-full overflow-hidden bg-slate-100">
        <img
          src={book?.coverImage || FALLBACK_COVER}
          alt={book?.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_COVER
          }}
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 font-semibold text-slate-900" title={book?.title}>
            {book?.title}
          </h3>
          <span
            className={`badge whitespace-nowrap ${
              available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {available ? `${book.availableCopies} mevcut` : 'Tükendi'}
          </span>
        </div>
        <p className="text-sm text-slate-600 line-clamp-1">{book?.author}</p>
        {book?.category && (
          <span className="badge bg-slate-100 text-slate-700">{book.category}</span>
        )}
        <Link to={`/books/${book?._id}`} className="btn-primary w-full mt-2">
          Detayları Gör
        </Link>
      </div>
    </div>
  )
}
