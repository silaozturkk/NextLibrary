export default function SearchBar({
  value,
  onChange,
  category,
  onCategoryChange,
  categories = [],
  placeholder = 'Kitap adı veya yazar ara...',
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
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
          className="input pl-10"
        />
      </div>
      {categories.length > 0 && (
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="input sm:w-56"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
