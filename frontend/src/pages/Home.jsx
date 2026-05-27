import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../api/axios'
import BookCard from '../components/BookCard'
import SearchBar from '../components/SearchBar'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Home() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')

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

  const categories = useMemo(() => {
    const set = new Set(books.map((b) => b.category).filter(Boolean))
    return [...set].sort()
  }, [books])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return books.filter((b) => {
      const matchesQuery =
        !q ||
        b.title?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q)
      const matchesCategory = !category || b.category === category
      return matchesQuery && matchesCategory
    })
  }, [books, query, category])

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-900 px-6 py-12 text-white shadow-lg sm:px-12">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold sm:text-4xl">Binlerce kitap bir tık uzakta</h1>
          <p className="mt-3 text-brand-100">
            Modern kütüphane deneyimi: kitap arayın, ödünç alın, iade edin. Hepsi tek bir yerde.
          </p>
        </div>
      </section>

      <section>
        <SearchBar
          value={query}
          onChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
          categories={categories}
        />
      </section>

      <section>
        {loading ? (
          <LoadingSpinner label="Kitaplar yükleniyor..." />
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-lg font-medium text-slate-700">Kitap bulunamadı</p>
            <p className="mt-1 text-sm text-slate-500">
              Arama kriterlerinizi değiştirmeyi deneyin.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-600">
              {filtered.length} kitap listeleniyor
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
