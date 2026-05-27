import { useEffect, useState } from 'react'
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
  const { isAuthenticated, isAdmin } = useAuth()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [borrowing, setBorrowing] = useState(false)

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true)
      try {
        const { data } = await api.get(`/books/${id}`)
        setBook(data?.book || data)
      } catch (err) {
        toast.error('Kitap bulunamadı')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetchBook()
  }, [id, navigate])

  const handleBorrow = async () => {
    if (!isAuthenticated) {
      toast.info('Ödünç almak için giriş yapın')
      navigate('/login')
      return
    }
    setBorrowing(true)
    try {
      await api.post('/borrow', { bookId: id })
      toast.success('Kitap ödünç alındı')
      setBook((prev) => ({ ...prev, availableCopies: prev.availableCopies - 1 }))
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Ödünç alma başarısız')
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

  const available = (book.availableCopies ?? 0) > 0

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

        <div className="space-y-4">
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
              {available ? `${book.availableCopies} mevcut` : 'Tükendi'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            {book.category && (
              <span className="badge bg-slate-100 text-slate-700">{book.category}</span>
            )}
            {book.isbn && (
              <span className="badge bg-slate-100 text-slate-700">ISBN: {book.isbn}</span>
            )}
            <span className="badge bg-slate-100 text-slate-700">
              Toplam: {book.totalCopies ?? 0}
            </span>
          </div>

          {book.description && (
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Açıklama</h2>
              <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{book.description}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleBorrow}
              disabled={!available || borrowing}
              className="btn-primary"
            >
              {borrowing ? 'İşleniyor...' : available ? 'Ödünç Al' : 'Tükendi'}
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
        </div>
      </div>
    </div>
  )
}
