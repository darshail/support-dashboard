import { useData } from '../../hooks'
import { SkeletonInsightGrid } from '../ui/Skeleton'
import InsightCard from './InsightCard'

export default function AutomatedInsightsPanel() {
  const { automatedInsights, isLoading, hasActiveFilters, filteredCount } = useData()

  if (isLoading) {
    return (
      <section className="animate-fade-in" aria-label="Automated insights" aria-busy="true">
        <PanelHeader hasActiveFilters={false} count={0} />
        <SkeletonInsightGrid />
      </section>
    )
  }

  return (
    <section className="animate-fade-in" aria-label="Automated insights">
      <PanelHeader hasActiveFilters={hasActiveFilters} count={filteredCount} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {automatedInsights.map((insight, index) => (
          <InsightCard key={insight.id} insight={insight} index={index} />
        ))}
      </div>
    </section>
  )
}

function PanelHeader({ hasActiveFilters, count }) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
          <SparkleIcon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-text sm:text-base">
            Automated insights
          </h2>
          <p className="text-xs text-text-muted sm:text-sm">
            Generated from {count.toLocaleString()} cases
            {hasActiveFilters ? ' (filtered)' : ''}
          </p>
        </div>
      </div>
      <p className="text-xs text-text-subtle">Updates when filters or data change</p>
    </div>
  )
}

function SparkleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  )
}
