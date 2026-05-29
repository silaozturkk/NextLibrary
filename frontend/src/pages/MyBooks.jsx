import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'

const TABS = [
  { id: 'borrowed', label: 'Aktif' },
  { id: 'returned', label: 'Geçmiş' },
]

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function MyBooks() {
  const { refreshBorrowLimit } = useAuth()
  const [borrows, setBorrows] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('borrowed')
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
      refreshBorrowLimit()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'İade başarısız')
    } finally {
      setReturningId(null)
    }
  }

  const filtered = useMemo(
    () => borrows.filter((b) => b.status === tab),
    [borrows, tab],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Kitaplarım</h1>
        <p className="mt-1 text-sm text-slate-600">
          Ödünç aldığın ve geçmişte iade ettiğin kitaplar.
        </p>
      </div>

      <div className="border-b border-slate-200">
        <nav className="flex gap-6">
          {TABS.map((t) => {
            const count = borrows.filter((b) => b.status === t.id).length
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative pb-3 text-sm font-medium transition ${
                  active ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label} ({count})
                {active && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-brand-600" />}
              </button>
            )
          })}
        </nav>
      </div>

      {loading ? (
        <LoadingSpinner label="Yükleniyor..." />
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-lg font-medium text-slate-700">
            {tab === 'borrowed' ? 'Aktif bir ödünç kaydın yok' : 'Henüz iade ettiğin bir kitap yok'}
          </p>
          <Link to="/" className="btn-primary mt-4">
            Kitaplara Göz At
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((borrow) => {
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
                    <div className="mt-2 space-y-1 text-xs text-slate-500">
                      <p>Ödünç: {formatDate(borrow.borrowDate)}</p>
                      {borrow.status === 'returned' && (
                        <p>İade: {formatDate(borrow.returnDate)}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`badge ${
                        borrow.status === 'borrowed'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {borrow.status === 'borrowed' ? 'Aktif' : 'İade Edildi'}
                    </span>
                    {borrow.status === 'borrowed' && (
                      <button
                        onClick={() => handleReturn(borrow._id)}
                        disabled={returningId === borrow._id}
                        className="btn-primary text-xs"
                      >
                        {returningId === borrow._id ? 'İade ediliyor...' : 'İade Et'}
                      </button>
                    )}
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
