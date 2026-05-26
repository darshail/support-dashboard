/**
 * @param {Object} props
 * @param {string} message
 * @param {'error' | 'warning' | 'info'} [variant]
 */
export default function AlertBanner({ message, variant = 'error' }) {
  const styles = {
    error: 'border-red-200/80 bg-red-50 text-red-800',
    warning: 'border-amber-200/80 bg-amber-50 text-amber-900',
    info: 'border-primary/20 bg-primary-muted text-primary-hover',
  }

  return (
    <div
      role="alert"
      className={[
        'animate-fade-in rounded-xl border px-4 py-3 text-sm leading-relaxed shadow-sm',
        styles[variant],
      ].join(' ')}
    >
      {message}
    </div>
  )
}
