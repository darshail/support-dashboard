/**
 * @param {Object} props
 * @param {string} [title='No data available']
 * @param {string} [description]
 * @param {boolean} [compact]
 * @param {import('react').ReactNode} [icon]
 */
export default function EmptyState({
  title = 'No data available',
  description = 'Try adjusting your filters or check back when more data is available.',
  compact = false,
  icon,
}) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center text-center',
        compact ? 'min-h-48 px-4 py-8' : 'min-h-56 px-6 py-12',
      ].join(' ')}
    >
      <div
        className={[
          'mb-3 flex items-center justify-center rounded-full bg-surface-muted text-text-subtle',
          compact ? 'h-10 w-10' : 'h-12 w-12',
        ].join(' ')}
      >
        {icon ?? <ChartEmptyIcon className={compact ? 'h-5 w-5' : 'h-6 w-6'} />}
      </div>
      <p className={['font-semibold text-text', compact ? 'text-sm' : 'text-base'].join(' ')}>
        {title}
      </p>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-text-muted">{description}</p>
      )}
    </div>
  )
}

function ChartEmptyIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
      />
    </svg>
  )
}
