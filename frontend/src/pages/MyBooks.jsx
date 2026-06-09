import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function MyBooks() {
  const [borrows, setBorrows] = useState([])
  const [loading, setLoading] = useState(true)
  const [returningId, setReturningId] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/borrow/my-books')
      setBorrows(Array.isArray(data) ? data : data?.borrows || [])
    } catch (err) {
      toast.error('Ödünç kayıtları yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleReturn = async (borrowId) => {
    setReturningId(borrowId)
    try {
      await api.put(`/borrow/return/${borrowId}`)
      toast.success('Kitap iade edildi')
      fetchData()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'İade başarısız')
    } finally {
      setReturningId(null)
    }
  }

  const active = useMemo(
    () => borrows.filter((b) => b.status === 'borrowed'),
    [borrows],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Kitaplarım</h1>
        <p className="mt-1 text-sm text-slate-600">
          Şu anda ödünçte olan kitapların.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner label="Yükleniyor..." />
      ) : active.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-lg font-medium text-slate-700">Aktif bir ödünç kaydın yok</p>
          <Link to="/" className="btn-primary mt-4">
            Kitaplara Göz At
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {active.map((borrow) => {
            const book = borrow.book || {}
            return (
              <div key={borrow._id} className="card flex gap-4 p-4">
                <img
                  src={book.coverImage || 'https://placehold.co/120x160/e2e8f0/64748b?text=Kitap'}
                  alt={book.title}
                  className="h-32 w-24 flex-shrink-0 rounded-md object-cover"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 line-clamp-2">{book.title}</h3>
                    <p className="mt-0.5 text-sm text-slate-600">{book.author}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Ödünç: {formatDate(borrow.borrowDate)}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-end">
                    <button
                      onClick={() => handleReturn(borrow._id)}
                      disabled={returningId === borrow._id}
                      className="btn-primary text-xs"
                    >
                      {returningId === borrow._id ? 'İade ediliyor...' : 'İade Et'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
