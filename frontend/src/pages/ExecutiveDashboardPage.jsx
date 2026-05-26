import ChartCard from '../components/charts/ChartCard'
import { DashboardPageShell } from '../components/layout'
import { KpiGrid } from '../components/kpi'
import PageHeader from '../components/ui/PageHeader'
import {
  MonthlyTicketTrendChart,
  MttrTrendChart,
  TicketStatusDonutChart,
  TopIssueTypesChart,
} from '../charts'
import { useData } from '../hooks'
import {
  formatKpiCount,
  formatKpiDays,
  formatKpiPercent,
  formatKpiRating,
} from '../utils/kpiFormatters'

export default function ExecutiveDashboardPage() {
  const { executiveCharts, kpiMetrics, isLoading, error, hasActiveFilters } = useData()

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
      invertTrend: true,
    },
    {
      label: 'Avg MTTR',
      value: formatKpiDays(kpiMetrics.avgMttr.value),
      icon: 'mttr',
      variant: 'violet',
      trend: kpiMetrics.avgMttr.trend,
      trendLabel: kpiMetrics.avgMttr.trendLabel,
      invertTrend: true,
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

  const { monthlyTicketTrend, topIssueTypes, statusDistribution, mttrTrend } = executiveCharts

  return (
    <DashboardPageShell isLoading={isLoading} error={error} skeletonVariant="executive">
      <PageHeader
        title="Executive Overview"
        description={
          hasActiveFilters
            ? 'Metrics and charts reflect your current filter selection.'
            : 'High-level support performance metrics and trends across all regions.'
        }
      />

      <KpiGrid metrics={kpiCards} />

      <div className="dashboard-grid lg:grid-cols-2">
        <ChartCard
          title="Monthly ticket trend"
          description="Ticket volume over the last 12 months"
          className="lg:col-span-2"
          heightClass="h-80 min-h-[20rem]"
          isEmpty={monthlyTicketTrend.length === 0}
        >
          <MonthlyTicketTrendChart data={monthlyTicketTrend} />
        </ChartCard>

        <ChartCard
          title="Top issue types"
          description="Most frequent issue categories"
          heightClass="h-80 min-h-[20rem]"
          isEmpty={topIssueTypes.length === 0}
        >
          <TopIssueTypesChart data={topIssueTypes} />
        </ChartCard>

        <ChartCard
          title="Ticket status"
          description="Distribution by current status"
          heightClass="h-80 min-h-[20rem]"
          isEmpty={statusDistribution.length === 0}
        >
          <TicketStatusDonutChart data={statusDistribution} />
          {statusDistribution.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
              {statusDistribution.slice(0, 6).map((item) => (
                <span key={item.name} className="flex items-center gap-1.5 text-xs text-text-muted">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  {item.name}
                </span>
              ))}
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="MTTR trend"
          description="Average mean time to resolve (days) by month"
          className="lg:col-span-2"
          heightClass="h-80 min-h-[20rem]"
          isEmpty={mttrTrend.length === 0}
        >
          <MttrTrendChart data={mttrTrend} />
        </ChartCard>
      </div>
    </DashboardPageShell>
  )
}
