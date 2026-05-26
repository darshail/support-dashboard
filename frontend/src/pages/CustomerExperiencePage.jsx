import { useMemo, useState } from 'react'
import {
  CustomerRatingTrendChart,
  RatingByIssueChart,
  RepeatedComplaintsChart,
  SatisfactionTrendChart,
} from '../charts'
import ChartCard from '../components/charts/ChartCard'
import { NegativeFeedbackTable } from '../components/customerExperience'
import { DrillDownPanel } from '../components/issues'
import { DashboardPageShell } from '../components/layout'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import { useData } from '../hooks'
import {
  getCustomerExperienceDrillDownCases,
  SATISFIED_RATING_THRESHOLD,
} from '../services/customerExperienceService'
import { formatKpiCount, formatKpiPercent, formatKpiRating } from '../utils/kpiFormatters'

/** @typedef {import('../services/customerExperienceService').CustomerExperienceDrillDown} CustomerExperienceDrillDown */

export default function CustomerExperiencePage() {
  const { customerExperience, records, isLoading, error, setFilter, hasActiveFilters } = useData()
  const [drillDown, setDrillDown] = useState(/** @type {CustomerExperienceDrillDown | null} */ (null))

  const drillDownCases = useMemo(
    () => getCustomerExperienceDrillDownCases(records, drillDown),
    [records, drillDown],
  )

  function selectDrill(dimension, payload) {
    setDrillDown({ dimension, key: payload.key, label: payload.name })
  }

  function applyDrillToFilters() {
    if (!drillDown) return
    if (drillDown.dimension === 'month') setFilter('month', [drillDown.key])
    if (drillDown.dimension === 'issue') setFilter('issueType', [drillDown.key])
  }

  const monthActiveKey = drillDown?.dimension === 'month' ? drillDown.key : null
  const issueActiveKey = drillDown?.dimension === 'issue' ? drillDown.key : null
  const accountActiveKey = drillDown?.dimension === 'account' ? drillDown.key : null

  const {
    summary,
    ratingTrends,
    satisfactionTrends,
    ratingByIssue,
    negativeFeedback,
    repeatedComplaints,
  } = customerExperience

  return (
    <DashboardPageShell isLoading={isLoading} error={error} skeletonVariant="analytics">
      <PageHeader
        title="Customer Experience"
        description={
          hasActiveFilters
            ? 'Satisfaction and feedback metrics for your filtered cases. Click charts or table rows to drill down.'
            : 'Ratings, satisfaction trends, and complaint patterns. Click charts or table rows to drill down.'
        }
        meta={`Satisfied = rating ${SATISFIED_RATING_THRESHOLD}+ · ${formatKpiCount(summary.ratedCount)} cases include ratings in this dataset`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Avg customer rating"
          value={formatKpiRating(summary.avgRating)}
          hint={`${formatKpiCount(summary.ratedCount)} rated tickets`}
          delayMs={0}
        />
        <StatCard
          label="Satisfaction rate"
          value={formatKpiPercent(summary.satisfactionRate)}
          hint={`Rated ${SATISFIED_RATING_THRESHOLD}+ stars`}
          delayMs={50}
        />
        <StatCard
          label="Negative feedback"
          value={formatKpiCount(summary.negativeFeedbackCount)}
          hint={`${formatKpiCount(summary.feedbackWithTextCount)} with written feedback`}
          delayMs={100}
        />
      </div>

      <div className="dashboard-grid lg:grid-cols-2">
        <ChartCard
          title="Customer rating trends"
          description="Monthly average rating and response volume"
          heightClass="h-80 min-h-[20rem]"
          isEmpty={ratingTrends.length === 0}
          emptyDescription="No rated tickets with month data in the current selection."
        >
          <CustomerRatingTrendChart
            data={ratingTrends}
            activeKey={monthActiveKey}
            onSelect={(p) => selectDrill('month', p)}
          />
        </ChartCard>

        <ChartCard
          title="Satisfaction trends over time"
          description={`Share of ratings ${SATISFIED_RATING_THRESHOLD}+ by month`}
          heightClass="h-80 min-h-[20rem]"
          isEmpty={satisfactionTrends.length === 0}
          emptyDescription="Not enough rated tickets to show satisfaction trends."
        >
          <SatisfactionTrendChart
            data={satisfactionTrends}
            activeKey={monthActiveKey}
            onSelect={(p) => selectDrill('month', p)}
          />
        </ChartCard>

        <ChartCard
          title="Rating vs issue type"
          description="Lowest average ratings by issue category (min. 3 responses)"
          heightClass="h-80 min-h-[20rem]"
          isEmpty={ratingByIssue.length === 0}
          emptyDescription="Not enough ratings per issue type in this selection."
        >
          <RatingByIssueChart
            data={ratingByIssue}
            activeKey={issueActiveKey}
            onSelect={(p) => selectDrill('issue', p)}
          />
        </ChartCard>

        <ChartCard
          title="Repeated complaint accounts"
          description="Accounts with 2+ low-rating tickets or written feedback"
          heightClass="h-80 min-h-[20rem]"
          isEmpty={repeatedComplaints.length === 0}
          emptyDescription="No accounts with repeated complaints in this selection."
        >
          <RepeatedComplaintsChart
            data={repeatedComplaints}
            activeKey={accountActiveKey}
            onSelect={(p) => selectDrill('account', p)}
          />
        </ChartCard>

        <ChartCard
          title="Negative feedback"
          description="Low ratings (≤2) or written feedback — click a row to drill down"
          className="lg:col-span-2"
          isEmpty={negativeFeedback.length === 0}
          emptyTitle="No negative feedback"
          emptyDescription="No low ratings or dissatisfied written feedback in the current selection."
        >
          <NegativeFeedbackTable
            rows={negativeFeedback}
            activeAccountKey={accountActiveKey}
            onRowClick={(row) =>
              setDrillDown({
                dimension: 'account',
                key: row.accountKey,
                label: row.accountName,
              })
            }
          />
          <div className="mt-4 flex justify-end border-t border-border/60 pt-4">
            <button
              type="button"
              onClick={() =>
                setDrillDown({
                  dimension: 'negative',
                  key: 'negative',
                  label: 'All negative feedback',
                })
              }
              className="text-sm font-medium text-primary transition-colors duration-200 hover:text-primary-hover"
            >
              View all negative cases in drill-down →
            </button>
          </div>
        </ChartCard>
      </div>

      <DrillDownPanel
        selection={drillDown}
        cases={drillDownCases}
        onClose={() => setDrillDown(null)}
        onApplyFilter={
          drillDown?.dimension === 'month' || drillDown?.dimension === 'issue'
            ? applyDrillToFilters
            : undefined
        }
      />
    </DashboardPageShell>
  )
}
