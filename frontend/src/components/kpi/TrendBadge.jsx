/**
 * @param {{ trend: number | null, label?: string, invertTrend?: boolean }} props
 */
export default function TrendBadge({ trend, label = 'vs last period', invertTrend = false }) {
  if (trend === null || trend === undefined || Number.isNaN(trend)) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-text-muted">
        —
        <span className="text-text-subtle">{label}</span>
      </span>
    )
  }

  const isUp = trend >= 0
  const isPositive = invertTrend ? !isUp : isUp
  const formatted = `${isUp ? '+' : ''}${trend.toFixed(1)}%`

  const colorClass = isPositive
    ? 'bg-emerald-50 text-emerald-700'
    : 'bg-red-50 text-red-700'

  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
        colorClass,
      ].join(' ')}
    >
      {isUp ? <ArrowUp /> : <ArrowDown />}
      {formatted}
      <span className="font-normal opacity-80">{label}</span>
    </span>
  )
}

function ArrowUp() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
  )
}

function ArrowDown() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )
}
