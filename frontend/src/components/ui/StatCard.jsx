/**
 * @param {Object} props
 * @param {string} label
 * @param {string} value
 * @param {string} hint
 * @param {number} [delayMs]
 */
export default function StatCard({ label, value, hint, delayMs = 0 }) {
  return (
    <div
      className="card-surface animate-stagger-in p-4 sm:p-5"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-1.5 text-2xl font-bold tracking-tight text-text sm:text-[1.75rem]">{value}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-text-muted">{hint}</p>
    </div>
  )
}
