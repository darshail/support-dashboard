import { useMemo, useState } from 'react'
import ChartCard from '../components/charts/ChartCard'
import { DrillDownPanel } from '../components/issues'
import { DashboardPageShell } from '../components/layout'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import {
  HighMttrIssuesChart,
  IssueDistributionChart,
  IssueProductChart,
  RepeatIssueChart,
  TopRecurringChart,
} from '../charts'
import { useData } from '../hooks'
import { getDrillDownCases } from '../services/issueIntelligenceService'
import { formatKpiCount, formatKpiPercent } from '../utils/kpiFormatters'

/**
 * @typedef {Object} DrillDownState
 * @property {'issue' | 'issueProduct'} dimension
 * @property {string} label
 * @property {string} issueKey
 * @property {string} [productKey]
 */

export default function IssuesPage() {
  const { issueIntelligence, records, isLoading, error, setFilter, hasActiveFilters } = useData()
  const [drillDown, setDrillDown] = useState(/** @type {DrillDownState | null} */ (null))

  const activeIssueKey = drillDown?.issueKey ?? null
  const issueProductSelection = drillDown?.productKey
    ? { productKey: drillDown.productKey, issueKey: drillDown.issueKey }
    : drillDown?.issueKey
      ? { issueKey: drillDown.issueKey }
      : null

  const drillDownCases = useMemo(
    () => getDrillDownCases(records, drillDown),
    [records, drillDown],
  )

  function handleIssueSelect(payload) {
    setDrillDown({
      dimension: 'issue',
      issueKey: payload.key,
      label: payload.name,
    })
  }

  function handleIssueProductSelect(payload) {
    setDrillDown({
      dimension: 'issueProduct',
      issueKey: payload.issueKey,
      productKey: payload.productKey,
      label: payload.label,
    })
  }

  function applyDrillToFilters() {
    if (!drillDown) return
    setFilter('issueType', [drillDown.issueKey])
    if (drillDown.productKey) {
      setFilter('productType', [drillDown.productKey])
    }
  }

  const { issueDistribution, highMttrIssues, issueProduct, repeatAnalysis, topRecurring } =
    issueIntelligence

  return (
    <DashboardPageShell isLoading={isLoading} error={error} skeletonVariant="analytics">
      <PageHeader
        title="Issue Intelligence"
        description={
          hasActiveFilters
            ? 'Analyze patterns in your filtered case set. Click any chart segment to drill down.'
            : 'Analyze issue patterns, resolution times, and recurring problems. Click any chart segment to drill down.'
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Repeat cases"
          value={formatKpiCount(repeatAnalysis.repeatCases)}
          hint={`${formatKpiPercent(repeatAnalysis.repeatRate)} of filtered volume`}
          delayMs={0}
        />
        <StatCard
          label="Accounts with repeats"
          value={formatKpiCount(repeatAnalysis.accountsWithRepeats)}
          hint="Same account filed the same issue more than once"
          delayMs={50}
        />
        <StatCard
          label="Issue categories"
          value={formatKpiCount(issueDistribution.length)}
          hint="Top segments in distribution chart"
          delayMs={100}
        />
      </div>

      <div className="dashboard-grid lg:grid-cols-2">
        <ChartCard
          title="Issue distribution"
          description="Share of cases by issue category — click a segment to drill down"
          heightClass="h-80 min-h-[20rem]"
          isEmpty={issueDistribution.length === 0}
        >
          <IssueDistributionChart
            data={issueDistribution}
            activeKey={activeIssueKey}
            onSelect={handleIssueSelect}
          />
          {issueDistribution.length > 0 && (
            <DistributionLegend
              items={issueDistribution}
              activeKey={activeIssueKey}
              onSelect={handleIssueSelect}
            />
          )}
        </ChartCard>

        <ChartCard
          title="High MTTR issues"
          description="Issue types with highest average resolution time (min. 5 cases)"
          heightClass="h-80 min-h-[20rem]"
          isEmpty={highMttrIssues.length === 0}
        >
          <HighMttrIssuesChart
            data={highMttrIssues}
            activeKey={activeIssueKey}
            onSelect={handleIssueSelect}
          />
        </ChartCard>

        <ChartCard
          title="Issue vs product"
          description="Case volume by product type and issue category — click a stack to drill down"
          className="lg:col-span-2"
          heightClass="h-[22rem] min-h-[22rem]"
          isEmpty={issueProduct.rows.length === 0}
        >
          <IssueProductChart
            data={issueProduct}
            activeSelection={issueProductSelection}
            onSelect={handleIssueProductSelect}
          />
        </ChartCard>

        <ChartCard
          title="Repeat issue analysis"
          description="Extra cases from accounts reporting the same issue again"
          heightClass="h-80 min-h-[20rem]"
          isEmpty={repeatAnalysis.byIssue.length === 0}
        >
          <RepeatIssueChart
            data={repeatAnalysis.byIssue}
            activeKey={activeIssueKey}
            onSelect={handleIssueSelect}
          />
        </ChartCard>

        <ChartCard
          title="Top recurring problems"
          description="Issues with the most repeat tickets per account"
          heightClass="h-80 min-h-[20rem]"
          isEmpty={topRecurring.length === 0}
        >
          <TopRecurringChart
            data={topRecurring}
            activeKey={activeIssueKey}
            onSelect={handleIssueSelect}
          />
        </ChartCard>
      </div>

      <DrillDownPanel
        selection={drillDown}
        cases={drillDownCases}
        onClose={() => setDrillDown(null)}
        onApplyFilter={applyDrillToFilters}
      />
    </DashboardPageShell>
  )
}

function DistributionLegend({ items, activeKey, onSelect }) {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onSelect({ key: item.key, name: item.name })}
          className={[
            'flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs transition-all duration-200',
            activeKey === item.key
              ? 'bg-primary/10 font-semibold text-primary ring-1 ring-primary/25'
              : 'text-text-muted hover:bg-surface-muted hover:text-text',
          ].join(' ')}
        >
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }} />
          {item.name}
          <span className="text-text-subtle">({item.value.toLocaleString()})</span>
        </button>
      ))}
    </div>
  )
}
