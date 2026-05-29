const SORT_OPTIONS = [
  { value: 'title-asc', label: 'A → Z' },
  { value: 'title-desc', label: 'Z → A' },
  { value: 'available', label: 'En Çok Mevcut' },
]

export default function SearchBar({
  value,
  onChange,
  category,
  onCategoryChange,
  categories = [],
  sort,
  onSortChange,
  resultCount,
  totalCount,
  placeholder = 'Kitap, yazar veya ISBN ara...',
}) {
  const hasActiveFilter = value || category
  const showSort = onSortChange !== undefined

  const clearAll = () => {
    onChange('')
    onCategoryChange('')
  }

  return (
    <div className="space-y-4">
      {/* Arama + Sıralama */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-12 text-sm shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition"
          />
          {value && (
            <button
              onClick={() => onChange('')}
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition"
              aria-label="Aramayı temizle"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {showSort && (
          <div className="relative sm:w-52">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            <select
              value={sort || 'title-asc'}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition cursor-pointer"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>

      {/* Kategori Chip'leri */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-[14px]">
          <button
            onClick={() => onCategoryChange('')}
            className={`rounded-full px-2.5 py-1  font-medium transition ${
              !category
                ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md shadow-brand-600/30'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-brand-200 hover:text-brand-700'
            }`}
          >
            Tümü
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => onCategoryChange(c)}
              className={`rounded-full px-2.5 py-1  font-medium transition ${
                category === c
                  ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md shadow-brand-600/30'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-brand-200 hover:text-brand-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Sonuç + Temizle */}
      {(resultCount !== undefined || hasActiveFilter) && (
        <div className="flex items-center justify-between gap-3 text-sm">
          <p className="text-slate-600">
            {resultCount !== undefined && (
              <>
                <span className="font-semibold text-slate-900">{resultCount}</span>
                {totalCount !== undefined && totalCount !== resultCount && (
                  <span className="text-slate-400"> / {totalCount}</span>
                )}{' '}
                kitap
                {hasActiveFilter && ' bulundu'}
              </>
            )}
          </p>
          {hasActiveFilter && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50 transition"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Filtreleri Temizle
            </button>
          )}
        </div>
      )}
    </div>
  )
}
