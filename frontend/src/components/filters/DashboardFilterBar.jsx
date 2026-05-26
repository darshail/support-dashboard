import { useData } from '../../hooks'
import { FILTER_KEYS, FILTER_LABELS } from '../../utils/dashboardFilters'
import { SkeletonFilterBar } from '../ui/Skeleton'
import MultiSelectDropdown from './MultiSelectDropdown'

export default function DashboardFilterBar() {
  const {
    filters,
    filterOptions,
    setFilter,
    resetFilters,
    hasActiveFilters,
    filteredCount,
    totalCount,
    isLoading,
  } = useData()

  if (isLoading) {
    return <SkeletonFilterBar />
  }

  return (
    <div className="sticky top-16 z-20 border-b border-border bg-surface/90 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">
          {FILTER_KEYS.map((key) => (
            <MultiSelectDropdown
              key={key}
              label={FILTER_LABELS[key]}
              options={filterOptions[key]}
              selected={filters[key]}
              onChange={(values) => setFilter(key, values)}
            />
          ))}

          <button
            type="button"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
            className={[
              'h-9 shrink-0 rounded-lg border px-3.5 text-sm font-medium transition-all duration-200',
              hasActiveFilters
                ? 'border-border text-text-muted hover:border-primary/40 hover:bg-surface-muted hover:text-text active:scale-[0.98]'
                : 'cursor-not-allowed border-border/80 bg-surface-muted text-text-subtle',
            ].join(' ')}
          >
            Reset filters
          </button>
        </div>

        <p className="shrink-0 rounded-lg bg-surface-muted px-3 py-1.5 text-xs text-text-muted sm:text-sm">
          {hasActiveFilters ? (
            <>
              Showing{' '}
              <span className="font-semibold text-text">{filteredCount.toLocaleString()}</span> of{' '}
              <span className="font-semibold text-text">{totalCount.toLocaleString()}</span> cases
            </>
          ) : (
            <>
              <span className="font-semibold text-text">{totalCount.toLocaleString()}</span> cases
            </>
          )}
        </p>
      </div>
    </div>
  )
}
