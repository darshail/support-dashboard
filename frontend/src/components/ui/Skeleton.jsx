/**
 * @param {Object} props
 * @param {string} [className]
 */
export function Skeleton({ className = '' }) {
  return <div className={['skeleton-shimmer rounded-lg', className].join(' ')} aria-hidden="true" />
}

export function SkeletonFilterBar() {
  return (
    <div className="border-b border-border bg-surface/90 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-9 w-28 sm:w-32" />
          ))}
          <Skeleton className="h-9 w-24" />
        </div>
        <Skeleton className="h-4 w-36" />
      </div>
    </div>
  )
}

export function SkeletonKpiGrid({ count = 5 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className="h-[7.5rem] rounded-xl" />
      ))}
    </div>
  )
}

/**
 * @param {Object} props
 * @param {number} [count=4]
 * @param {string} [className]
 */
export function SkeletonChartGrid({ count = 4, className = 'lg:grid-cols-2' }) {
  return (
    <div className={['dashboard-grid', className].join(' ')}>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton
          key={i}
          className={['h-80 min-h-80 rounded-xl', i === 0 && count === 4 ? 'lg:col-span-2' : ''].join(' ')}
        />
      ))}
    </div>
  )
}

export function SkeletonInsightGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-44 rounded-xl" />
      ))}
    </div>
  )
}

export function SkeletonStatRow({ count = 3 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className="h-24 rounded-xl" />
      ))}
    </div>
  )
}

export function SkeletonPageHeader() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-7 w-56 max-w-full" />
      <Skeleton className="h-4 w-full max-w-md" />
    </div>
  )
}

/**
 * @param {'overview' | 'executive' | 'analytics'} [variant]
 */
export function DashboardPageSkeleton({ variant = 'analytics' }) {
  const showStats = variant === 'analytics'
  const chartCount = variant === 'executive' ? 4 : variant === 'overview' ? 1 : 5
  const chartLayout = variant === 'overview' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'

  return (
    <div className="dashboard-section animate-fade-in" aria-busy="true" aria-label="Loading dashboard">
      <SkeletonPageHeader />
      {showStats && <SkeletonStatRow count={3} />}
      <SkeletonKpiGrid />
      <SkeletonChartGrid count={chartCount} className={chartLayout} />
      {variant === 'analytics' && <Skeleton className="h-56 w-full rounded-xl" />}
    </div>
  )
}
