import { useMemo, useState } from 'react'
import {
  AgentPerformanceChart,
  MttrByDimensionChart,
  SlaBreachChart,
  SlaSummaryDonut,
  TicketAgingChart,
} from '../charts'
import ChartCard from '../components/charts/ChartCard'
import { DrillDownPanel } from '../components/issues'
import { DashboardPageShell } from '../components/layout'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import { useData } from '../hooks'
import { getOperationsDrillDownCases } from '../services/operationsPerformanceService'
import { formatKpiCount, formatKpiDays, formatKpiPercent } from '../utils/kpiFormatters'

/** @typedef {import('../services/operationsPerformanceService').OperationsDrillDown} OperationsDrillDown */

export default function OperationsPage() {
  const { operationsPerformance, records, isLoading, error, setFilter, hasActiveFilters } =
    useData()
  const [drillDown, setDrillDown] = useState(/** @type {OperationsDrillDown | null} */ (null))

  const drillDownCases = useMemo(
    () => getOperationsDrillDownCases(records, drillDown),
    [records, drillDown],
  )

  function selectDrill(dimension, payload) {
    setDrillDown({ dimension, key: payload.key, label: payload.name })
  }

  const regionActiveKey = drillDown?.dimension === 'region' ? drillDown.key : null
  const vendorActiveKey = drillDown?.dimension === 'vendor' ? drillDown.key : null
  const agingActiveKey = drillDown?.dimension === 'aging' ? drillDown.key : null
  const slaActiveKey = drillDown?.dimension === 'sla' ? drillDown.key : null
  const agentActiveKey = drillDown?.dimension === 'agent' ? drillDown.key : null

  const { mttrByRegion, mttrByVendor, ticketAging, slaBreach, agentPerformance, slaTargets } =
    operationsPerformance

  const avgMttrAll =
    records.length > 0
      ? records
          .map((r) => r.mttr)
          .filter((v) => v !== null)
          .reduce((s, v, _, a) => (a.length ? s + v / a.length : 0), 0) || null
      : null

  return (
    <DashboardPageShell isLoading={isLoading} error={error} skeletonVariant="analytics">
      <PageHeader
        title="Operations Performance"
        description={
          hasActiveFilters
            ? 'Operational metrics for your filtered case set. Click chart segments to drill down.'
            : 'MTTR, aging, SLA compliance, and resolution performance. Click chart segments to drill down.'
        }
        meta={`SLA targets: ${slaTargets.resolutionHours}h resolution (closed) · ${slaTargets.mttrDays}d MTTR / open age`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="SLA breach rate"
          value={formatKpiPercent(slaBreach.summary.breachRate)}
          hint={`${formatKpiCount(slaBreach.summary.breached)} of ${formatKpiCount(slaBreach.summary.total)} cases`}
          delayMs={0}
        />
        <StatCard
          label="Avg MTTR (all)"
          value={formatKpiDays(avgMttrAll)}
          hint="Across filtered tickets with MTTR"
          delayMs={50}
        />
        <StatCard
          label="Agent-resolved"
          value={formatKpiCount(agentPerformance.find((a) => a.key === 'agent')?.cases ?? 0)}
          hint="Tickets marked resolved by agent"
          delayMs={100}
        />
      </div>

      <div className="dashboard-grid lg:grid-cols-2">
        <ChartCard
          title="MTTR by region"
          description="Average resolution time by account region (min. 5 cases)"
          heightClass="h-80 min-h-[20rem]"
          isEmpty={mttrByRegion.length === 0}
        >
          <MttrByDimensionChart
            data={mttrByRegion}
            activeKey={regionActiveKey}
            onSelect={(p) => selectDrill('region', p)}
          />
        </ChartCard>

        <ChartCard
          title="MTTR by vendor"
          description="Average MTTR by assigned OEM / vendor"
          heightClass="h-80 min-h-[20rem]"
          isEmpty={mttrByVendor.length === 0}
        >
          <MttrByDimensionChart
            data={mttrByVendor}
            activeKey={vendorActiveKey}
            onSelect={(p) => selectDrill('vendor', p)}
          />
        </ChartCard>

        <ChartCard
          title="Ticket aging analysis"
          description="Open vs closed tickets by age bucket (days)"
          heightClass="h-80 min-h-[20rem]"
          isEmpty={ticketAging.length === 0}
        >
          <TicketAgingChart
            data={ticketAging}
            activeKey={agingActiveKey}
            onSelect={(p) => selectDrill('aging', p)}
          />
        </ChartCard>

        <ChartCard
          title="SLA breach analysis"
          description="Breach rate by region and overall SLA compliance"
          heightClass="h-80 min-h-[20rem]"
          isEmpty={slaBreach.summary.distribution.length === 0 && slaBreach.byRegion.length === 0}
        >
          <div className="grid h-full min-h-[16rem] gap-4 md:grid-cols-2">
            <SlaSummaryDonut
              data={slaBreach.summary.distribution}
              activeKey={slaActiveKey}
              onSelect={(p) => selectDrill('sla', p)}
            />
            <SlaBreachChart
              data={slaBreach.byRegion}
              activeKey={regionActiveKey}
              onSelect={(p) => selectDrill('region', p)}
            />
          </div>
        </ChartCard>

        <ChartCard
          title="Agent performance"
          description="Volume, SLA breach rate, and closure rate by resolution path"
          className="lg:col-span-2"
          heightClass="h-80 min-h-[20rem]"
          isEmpty={agentPerformance.length === 0}
        >
          <AgentPerformanceChart
            data={agentPerformance}
            activeKey={agentActiveKey}
            onSelect={(p) => selectDrill('agent', p)}
          />
        </ChartCard>
      </div>

      <DrillDownPanel
        selection={drillDown}
        cases={drillDownCases}
        onClose={() => setDrillDown(null)}
        onApplyFilter={drillDown?.dimension === 'region' ? () => setFilter('region', [drillDown.key]) : undefined}
      />
    </DashboardPageShell>
  )
}
