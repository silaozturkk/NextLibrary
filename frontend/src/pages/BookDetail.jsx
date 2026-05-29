import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'

const FALLBACK_COVER =
  'https://placehold.co/400x560/e2e8f0/64748b?text=Kitap+Kapa%C4%9F%C4%B1'

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin, borrowLimit, refreshBorrowLimit } = useAuth()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [borrowing, setBorrowing] = useState(false)

  const fetchBook = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoading(true)
      try {
        const { data } = await api.get(`/books/${id}`)
        setBook(data?.book || data)
      } catch (err) {
        toast.error('Kitap bulunamadı')
        navigate('/')
      } finally {
        if (!silent) setLoading(false)
      }
    },
    [id, navigate],
  )

  useEffect(() => {
    fetchBook()
    const onFocus = () => fetchBook({ silent: true })
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [fetchBook])

  const handleBorrow = async () => {
    if (!isAuthenticated) {
      toast.info('Ödünç almak için giriş yapın')
      navigate('/login')
      return
    }
    setBorrowing(true)
    try {
      const { data } = await api.post('/borrow', { bookId: id })
      toast.success('Kitap ödünç alındı')
      // Backend yanıtındaki populated book güncel availableCopies'i içerir
      if (data?.book && typeof data.book === 'object') {
        setBook(data.book)
      } else {
        await fetchBook({ silent: true })
      }
      refreshBorrowLimit()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Ödünç alma başarısız')
      await fetchBook({ silent: true })
      refreshBorrowLimit()
    } finally {
      setBorrowing(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Bu kitabı silmek istediğinizden emin misiniz?')) return
    try {
      await api.delete(`/books/${id}`)
      toast.success('Kitap silindi')
      navigate('/')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Silme başarısız')
    }
  }

  if (loading) return <LoadingSpinner label="Kitap yükleniyor..." />
  if (!book) return null

  const total = book.totalCopies ?? 0
  const availableCount = book.availableCopies ?? 0
  const borrowedCount = total - availableCount
  const available = availableCount > 0
  const stockPercent = total > 0 ? (availableCount / total) * 100 : 0

  return (
    <div className="card overflow-hidden">
      <div className="grid gap-8 p-6 md:grid-cols-[300px_1fr] md:p-8">
        <div className="space-y-3">
          <div className="aspect-[3/4] overflow-hidden rounded-lg bg-slate-100">
            <img
              src={book.coverImage || FALLBACK_COVER}
              alt={book.title}
              onError={(e) => (e.currentTarget.src = FALLBACK_COVER)}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{book.title}</h1>
              <p className="mt-1 text-lg text-slate-600">{book.author}</p>
            </div>
            <span
              className={`badge whitespace-nowrap ${
                available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {available ? 'Müsait' : 'Tükendi'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            {book.category && (
              <span className="badge bg-slate-100 text-slate-700">{book.category}</span>
            )}
            {book.isbn && (
              <span className="badge bg-slate-100 text-slate-700">ISBN: {book.isbn}</span>
            )}
          </div>

          {/* Stok Durumu */}
          <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-slate-700">Stok Durumu</span>
              <span className="text-sm">
                <span
                  className={`text-lg font-bold ${
                    available ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {availableCount}
                </span>
                <span className="text-slate-400"> / {total} mevcut</span>
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full transition-all duration-500 ${
                  available
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                    : 'bg-red-500'
                }`}
                style={{ width: `${stockPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {borrowedCount > 0
                ? `${borrowedCount} kopya ödünçte`
                : 'Tüm kopyalar raftaki rafta'}
            </p>
          </div>

          {book.description && (
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Açıklama</h2>
              <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{book.description}</p>
            </div>
          )}

          {/* Limit Uyarısı */}
          {isAuthenticated && !isAdmin && borrowLimit && !borrowLimit.canBorrow && (
            <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200">
              <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-amber-100 text-lg">
                ⚠️
              </span>
              <div className="text-sm">
                <p className="font-semibold text-amber-900">
                  Ödünç alma limitin doldu ({borrowLimit.active}/{borrowLimit.limit})
                </p>
                <p className="mt-0.5 text-amber-800">
                  Yeni kitap almak için önce <Link to="/my-books" className="underline font-medium">bir kitabı iade et</Link>.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleBorrow}
              disabled={!available || borrowing || (isAuthenticated && !isAdmin && borrowLimit && !borrowLimit.canBorrow)}
              className="btn-primary"
            >
              {borrowing
                ? 'İşleniyor...'
                : !available
                ? 'Tükendi'
                : isAuthenticated && !isAdmin && borrowLimit && !borrowLimit.canBorrow
                ? 'Limit Doldu'
                : 'Ödünç Al'}
            </button>
            <Link to="/" className="btn-secondary">
              Geri Dön
            </Link>
            {isAdmin && (
              <button onClick={handleDelete} className="btn-danger ml-auto">
                Kitabı Sil
              </button>
            )}
          </div>

          {/* Limit Bilgisi (kalan hak) */}
          {isAuthenticated && !isAdmin && borrowLimit && borrowLimit.canBorrow && (
            <p className="text-xs text-slate-500">
              Aktif ödünçlerin: <span className="font-medium text-slate-700">{borrowLimit.active}/{borrowLimit.limit}</span>
              {' · '}
              <span className="text-emerald-700 font-medium">{borrowLimit.remaining} hak kaldı</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
