import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../api/axios'
import BookCard from '../components/BookCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Home() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/books')
        setBooks(Array.isArray(data) ? data : data?.books || [])
      } catch (err) {
        toast.error('Kitaplar yüklenemedi')
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  const available = useMemo(
    () => books.filter((b) => (b.availableCopies ?? 0) > 0),
    [books],
  )

  return (
    <div className="space-y-8">
      <section className="relative pt-10 pb-16 text-center">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-72 w-[120%] rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-10 top-8 h-32 w-32 rounded-full bg-rose-400/30 blur-2xl pointer-events-none" />
        <div className="absolute right-10 top-16 h-40 w-40 rounded-full bg-brand-400/30 blur-2xl pointer-events-none" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-xs font-medium text-brand-700 ring-1 ring-brand-200 backdrop-blur shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
            </span>
            Modern Kütüphane Deneyimi
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl">
            Binlerce kitap{' '}
            <span className="bg-gradient-to-r from-brand-600 via-brand-700 to-rose-600 bg-clip-text text-transparent">
              bir tık uzağında
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
            Kitap seç, ödünç al, iade et. Hepsi tek bir yerde — sade, hızlı ve modern.
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-600">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-100 text-brand-700">📚</span>
            <span><strong className="text-slate-900">{available.length}</strong> kitap müsait</span>
          </div>
        </div>
      </section>

      <section>
        {loading ? (
          <LoadingSpinner label="Kitaplar yükleniyor..." />
        ) : available.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-100 text-3xl">
              📭
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-900">Şu an müsait kitap yok</p>
            <p className="mt-1 text-sm text-slate-500">
              Tüm kitaplar şu anda ödünçte. Daha sonra tekrar dene.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {available.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
