import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'

const EMPTY_BOOK = {
  title: '',
  author: '',
  category: '',
  isbn: '',
  description: '',
  coverImage: '',
  totalCopies: 1,
  availableCopies: 1,
}

const TABS = [
  { id: 'books', label: 'Kitaplar' },
  { id: 'borrows', label: 'Ödünç Kayıtları' },
  { id: 'messages', label: 'Mesajlar' },
]

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatDateTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('books')
  const [books, setBooks] = useState([])
  const [borrows, setBorrows] = useState([])
  const [messages, setMessages] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_BOOK)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const stats = useMemo(() => {
    const totalCopies = books.reduce((a, b) => a + (b.totalCopies || 0), 0)
    const availableCopies = books.reduce((a, b) => a + (b.availableCopies || 0), 0)
    const activeBorrows = borrows.filter((b) => b.status === 'borrowed').length
    return {
      totalBooks: books.length,
      totalCopies,
      availableCopies,
      activeBorrows,
    }
  }, [books, borrows])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [booksRes, borrowsRes, messagesRes] = await Promise.all([
        api.get('/books'),
        api.get('/borrow/all').catch(() => ({ data: [] })),
        api.get('/messages').catch(() => ({ data: { messages: [], unreadCount: 0 } })),
      ])
      setBooks(Array.isArray(booksRes.data) ? booksRes.data : booksRes.data?.books || [])
      setBorrows(
        Array.isArray(borrowsRes.data) ? borrowsRes.data : borrowsRes.data?.borrows || [],
      )
      setMessages(messagesRes.data?.messages || [])
      setUnreadCount(messagesRes.data?.unreadCount || 0)
    } catch (err) {
      toast.error('Veriler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleRead = async (id) => {
    try {
      const { data } = await api.put(`/messages/${id}/read`)
      setMessages((prev) => prev.map((m) => (m._id === id ? data : m)))
      setUnreadCount((prev) => prev + (data.isRead ? -1 : 1))
    } catch (err) {
      toast.error('İşlem başarısız')
    }
  }

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return
    try {
      await api.delete(`/messages/${id}`)
      const target = messages.find((m) => m._id === id)
      setMessages((prev) => prev.filter((m) => m._id !== id))
      if (target && !target.isRead) setUnreadCount((prev) => Math.max(0, prev - 1))
      toast.success('Mesaj silindi')
    } catch (err) {
      toast.error('Silme başarısız')
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const openNew = () => {
    setEditingId(null)
    setForm(EMPTY_BOOK)
    setErrors({})
    setIsOpen(true)
  }

  const openEdit = (book) => {
    setEditingId(book._id)
    setForm({
      title: book.title || '',
      author: book.author || '',
      category: book.category || '',
      isbn: book.isbn || '',
      description: book.description || '',
      coverImage: book.coverImage || '',
      totalCopies: book.totalCopies ?? 0,
      availableCopies: book.availableCopies ?? 0,
    })
    setErrors({})
    setIsOpen(true)
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Başlık gerekli'
    if (!form.author.trim()) e.author = 'Yazar gerekli'
    if (Number(form.totalCopies) < 0) e.totalCopies = 'Negatif olamaz'
    if (Number(form.availableCopies) < 0) e.availableCopies = 'Negatif olamaz'
    if (Number(form.availableCopies) > Number(form.totalCopies))
      e.availableCopies = 'Toplamdan fazla olamaz'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        ...form,
        totalCopies: Number(form.totalCopies),
        availableCopies: Number(form.availableCopies),
      }
      if (editingId) {
        await api.put(`/books/${editingId}`, payload)
        toast.success('Kitap güncellendi')
      } else {
        await api.post('/books', payload)
        toast.success('Kitap eklendi')
      }
      setIsOpen(false)
      fetchAll()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'İşlem başarısız')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu kitabı silmek istediğinizden emin misiniz?')) return
    try {
      await api.delete(`/books/${id}`)
      toast.success('Kitap silindi')
      fetchAll()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Silme başarısız')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Yönetim Paneli</h1>
          <p className="mt-1 text-sm text-slate-600">
            Kitapları ve ödünç kayıtlarını yönet.
          </p>
        </div>
        <button onClick={openNew} className="btn-primary">
          + Yeni Kitap
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Toplam Kitap" value={stats.totalBooks} />
        <StatCard label="Toplam Kopya" value={stats.totalCopies} />
        <StatCard label="Müsait" value={stats.availableCopies} />
        <StatCard label="Aktif Ödünç" value={stats.activeBorrows} />
      </div>

      <div className="border-b border-slate-200">
        <nav className="flex gap-6">
          {TABS.map((t) => {
            const active = tab === t.id
            const showBadge = t.id === 'messages' && unreadCount > 0
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex items-center gap-2 pb-3 text-sm font-medium transition ${
                  active ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
                {showBadge && (
                  <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-brand-600 px-1.5 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
                {active && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-brand-600" />}
              </button>
            )
          })}
        </nav>
      </div>

      {loading ? (
        <LoadingSpinner label="Yükleniyor..." />
      ) : tab === 'books' ? (
        <BooksTable books={books} onEdit={openEdit} onDelete={handleDelete} />
      ) : tab === 'borrows' ? (
        <BorrowsTable borrows={borrows} />
      ) : (
        <MessagesTable
          messages={messages}
          onToggleRead={handleToggleRead}
          onDelete={handleDeleteMessage}
        />
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editingId ? 'Kitabı Düzenle' : 'Yeni Kitap Ekle'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Başlık" error={errors.title} required>
              <input
                className="input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Field>
            <Field label="Yazar" error={errors.author} required>
              <input
                className="input"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />
            </Field>
            <Field label="Kategori">
              <input
                className="input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </Field>
            <Field label="ISBN">
              <input
                className="input"
                value={form.isbn}
                onChange={(e) => setForm({ ...form, isbn: e.target.value })}
              />
            </Field>
            <Field label="Kapak Görsel URL" className="sm:col-span-2">
              <input
                className="input"
                placeholder="https://..."
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              />
            </Field>
            <Field label="Toplam Kopya" error={errors.totalCopies}>
              <input
                type="number"
                min="0"
                className="input"
                value={form.totalCopies}
                onChange={(e) => setForm({ ...form, totalCopies: e.target.value })}
              />
            </Field>
            <Field label="Mevcut Kopya" error={errors.availableCopies}>
              <input
                type="number"
                min="0"
                className="input"
                value={form.availableCopies}
                onChange={(e) => setForm({ ...form, availableCopies: e.target.value })}
              />
            </Field>
            <Field label="Açıklama" className="sm:col-span-2">
              <textarea
                rows="4"
                className="input resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary">
              İptal
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

function Field({ label, error, required, className = '', children }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

function BooksTable({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-slate-600">Henüz kitap yok. İlk kitabını ekle.</p>
      </div>
    )
  }
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Başlık</th>
              <th className="px-4 py-3">Yazar</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Stok</th>
              <th className="px-4 py-3 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {books.map((book) => (
              <tr key={book._id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{book.title}</td>
                <td className="px-4 py-3 text-slate-700">{book.author}</td>
                <td className="px-4 py-3 text-slate-700">{book.category || '-'}</td>
                <td className="px-4 py-3 text-slate-700">
                  {book.availableCopies} / {book.totalCopies}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onEdit(book)} className="btn-secondary text-xs">
                      Düzenle
                    </button>
                    <button onClick={() => onDelete(book._id)} className="btn-danger text-xs">
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MessagesTable({ messages, onToggleRead, onDelete }) {
  const [expandedId, setExpandedId] = useState(null)

  if (messages.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-slate-600">Henüz bir iletişim mesajı gelmedi.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {messages.map((m) => {
        const isExpanded = expandedId === m._id
        return (
          <div
            key={m._id}
            className={`card overflow-hidden transition ${
              !m.isRead ? 'ring-2 ring-brand-200' : ''
            }`}
          >
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : m._id)}
              className="flex w-full items-start gap-3 p-4 text-left hover:bg-slate-50"
            >
              {!m.isRead && (
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand-600" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p
                    className={`truncate ${
                      !m.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'
                    }`}
                  >
                    {m.subject}
                  </p>
                  <span className="text-xs text-slate-500">{formatDateTime(m.createdAt)}</span>
                </div>
                <p className="mt-1 truncate text-sm text-slate-600">
                  <span className="font-medium text-slate-700">{m.name}</span>{' '}
                  <span className="text-slate-400">·</span>{' '}
                  <a
                    href={`mailto:${m.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-brand-600 hover:underline"
                  >
                    {m.email}
                  </a>
                </p>
              </div>
              <span className="ml-2 flex-shrink-0 text-slate-400">
                {isExpanded ? '▴' : '▾'}
              </span>
            </button>

            {isExpanded && (
              <div className="border-t border-slate-200 bg-slate-50/50 p-4 sm:p-5">
                <p className="whitespace-pre-wrap text-sm text-slate-800">{m.message}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={`mailto:${m.email}?subject=Re: ${m.subject}`} className="btn-primary text-xs">
                    Yanıtla
                  </a>
                  <button
                    onClick={() => onToggleRead(m._id)}
                    className="btn-secondary text-xs"
                  >
                    {m.isRead ? 'Okunmadı işaretle' : 'Okundu işaretle'}
                  </button>
                  <button onClick={() => onDelete(m._id)} className="btn-danger text-xs">
                    Sil
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function BorrowsTable({ borrows }) {
  if (borrows.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-slate-600">Henüz bir ödünç kaydı yok.</p>
      </div>
    )
  }
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Kullanıcı</th>
              <th className="px-4 py-3">Kitap</th>
              <th className="px-4 py-3">Ödünç Tarihi</th>
              <th className="px-4 py-3">İade Tarihi</th>
              <th className="px-4 py-3">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {borrows.map((b) => (
              <tr key={b._id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-900">{b.user?.name || b.user?.email || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{b.book?.title || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{formatDate(b.borrowDate)}</td>
                <td className="px-4 py-3 text-slate-700">{formatDate(b.returnDate)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`badge ${
                      b.status === 'borrowed'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {b.status === 'borrowed' ? 'Aktif' : 'İade Edildi'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
