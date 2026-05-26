import QuickActions from '../components/QuickActions'
import ChartCard from '../components/charts/ChartCard'
import { DashboardPageShell } from '../components/layout'
import { KpiGrid } from '../components/kpi'
import { useData } from '../hooks'
import { TicketVolumeChart } from '../charts'
import {
  formatKpiCount,
  formatKpiDays,
  formatKpiPercent,
  formatKpiRating,
} from '../utils/kpiFormatters'

export default function DashboardPage() {
  const { kpiMetrics, casesByMonth, isLoading, error, filteredCount, totalCount, hasActiveFilters } =
    useData()

  const kpiCards = [
    {
      label: 'Total Tickets',
      value: formatKpiCount(kpiMetrics.totalTickets.value),
      icon: 'tickets',
      variant: 'primary',
      trend: kpiMetrics.totalTickets.trend,
      trendLabel: kpiMetrics.totalTickets.trendLabel,
    },
    {
      label: 'Open Tickets',
      value: formatKpiCount(kpiMetrics.openTickets.value),
      icon: 'open',
      variant: 'warning',
      trend: kpiMetrics.openTickets.trend,
      trendLabel: kpiMetrics.openTickets.trendLabel,
      invertTrend: kpiMetrics.openTickets.invertTrend,
    },
    {
      label: 'Avg MTTR',
      value: formatKpiDays(kpiMetrics.avgMttr.value),
      icon: 'mttr',
      variant: 'violet',
      trend: kpiMetrics.avgMttr.trend,
      trendLabel: kpiMetrics.avgMttr.trendLabel,
      invertTrend: kpiMetrics.avgMttr.invertTrend,
    },
    {
      label: 'Closure Rate',
      value: formatKpiPercent(kpiMetrics.closureRate.value),
      icon: 'closure',
      variant: 'success',
      trend: kpiMetrics.closureRate.trend,
      trendLabel: kpiMetrics.closureRate.trendLabel,
    },
    {
      label: 'Avg Customer Rating',
      value: formatKpiRating(kpiMetrics.avgCustomerRating.value),
      icon: 'rating',
      variant: 'accent',
      trend: kpiMetrics.avgCustomerRating.trend,
      trendLabel: kpiMetrics.avgCustomerRating.trendLabel,
    },
  ]

  return (
    <DashboardPageShell isLoading={isLoading} error={error} skeletonVariant="overview">
      <KpiGrid metrics={kpiCards} />

      <div className="dashboard-grid lg:grid-cols-3">
        <ChartCard
          title="Case volume by month"
          description={
            hasActiveFilters
              ? `${filteredCount.toLocaleString()} of ${totalCount.toLocaleString()} cases (filtered)`
              : `${totalCount.toLocaleString()} cases loaded from cleaned_data.csv`
          }
          className="lg:col-span-2"
          isEmpty={casesByMonth.length === 0}
        >
          <TicketVolumeChart data={casesByMonth} />
        </ChartCard>
        <QuickActions />
      </div>
    </DashboardPageShell>
  )
}
