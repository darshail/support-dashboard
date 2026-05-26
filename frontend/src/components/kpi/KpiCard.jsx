import KpiIcon from './KpiIcon'
import TrendBadge from './TrendBadge'
import { Skeleton } from '../ui/Skeleton'

/**
 * @param {Object} props
 */
export default function KpiCard({
  label,
  value,
  icon,
  variant = 'primary',
  trend = null,
  trendLabel,
  invertTrend = false,
  isLoading = false,
  index = 0,
}) {
  if (isLoading) {
    return <Skeleton className="h-[7.5rem] rounded-xl" />
  }

  return (
    <article
      className="card-surface animate-stagger-in p-5 sm:p-6"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <KpiIcon name={icon} variant={variant} />
        <TrendBadge trend={trend} label={trendLabel} invertTrend={invertTrend} />
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-text-muted">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text sm:text-3xl">{value}</p>
      </div>
    </article>
  )
}
