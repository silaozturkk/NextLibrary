export default function LoadingSpinner({ size = 'md', label }) {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-16 w-16 border-4',
  }
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`animate-spin rounded-full border-slate-200 border-t-brand-600 ${sizes[size]}`}
        role="status"
        aria-label="Yükleniyor"
      />
      {label && <p className="text-sm text-slate-600">{label}</p>}
    </div>
  )
}
