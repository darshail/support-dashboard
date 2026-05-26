import Papa from 'papaparse'
import cleanedDataUrl from '../data/cleaned_data.csv?url'
import { normalizeRow } from '../utils/csvParser'

const CLOSED_STATUSES = ['closed', 'auto closed', 'customer closed']

/**
 * @param {import('../data/types').SupportCase} record
 */
function isClosed(record) {
  return record.status && CLOSED_STATUSES.includes(record.status.toLowerCase())
}

/**
 * @param {number[]} values
 */
function average(values) {
  const valid = values.filter((v) => v !== null && Number.isFinite(v))
  if (!valid.length) return null
  return valid.reduce((sum, v) => sum + v, 0) / valid.length
}

/**
 * @param {number | null} current
 * @param {number | null} previous
 */
function calcTrendPercent(current, previous) {
  if (current === null || previous === null || previous === 0) return null
  return ((current - previous) / Math.abs(previous)) * 100
}

/**
 * @param {import('../data/types').SupportCase[]} records
 */
function getSortedMonths(records) {
  return [...new Set(records.map((r) => r.month).filter(Boolean))].sort()
}

/**
 * @param {import('../data/types').SupportCase[]} records
 * @param {string | null | undefined} month
 */
function filterByMonth(records, month) {
  if (!month) return []
  return records.filter((r) => r.month === month)
}

/**
 * Parse cleaned_data CSV text with PapaParse and apply type transforms.
 * @param {string} csvText
 */
export function parseCleanedDataCsv(csvText) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const records = results.data
          .map((row) => normalizeRow(row))
          .filter((record) => record.caseNumber)

        resolve({
          records,
          errors: results.errors,
          meta: results.meta,
        })
      },
      error: (error) => reject(error),
    })
  })
}

/**
 * Fetch and parse cleaned_data.csv from the bundled asset.
 */
export async function loadCleanedData() {
  const response = await fetch(cleanedDataUrl)
  if (!response.ok) {
    throw new Error(`Failed to load CSV (${response.status})`)
  }
  const csvText = await response.text()
  return parseCleanedDataCsv(csvText)
}

/**
 * Compute dashboard aggregates from parsed records.
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeDataSummary(records) {
  const openCount = records.filter((r) => !isClosed(r)).length
  const closedCount = records.filter(isClosed).length

  const resolutionHours = records
    .map((r) => r.resolutionTimeHours)
    .filter((v) => v !== null)
  const avgResolution =
    resolutionHours.length > 0
      ? resolutionHours.reduce((a, b) => a + b, 0) / resolutionHours.length
      : null

  const ratings = records.map((r) => r.customerRating).filter((v) => v !== null)
  const avgRating =
    ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null

  const mttrValues = records.map((r) => r.mttr).filter((v) => v !== null)

  return {
    totalCases: records.length,
    openCases: openCount,
    closedCases: closedCount,
    closureRate: records.length > 0 ? (closedCount / records.length) * 100 : null,
    avgMttr: average(mttrValues),
    avgResolutionHours: avgResolution,
    avgCustomerRating: avgRating,
  }
}

/**
 * Compute KPI metrics with month-over-month trends.
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeKpiMetrics(records) {
  const summary = computeDataSummary(records)
  const months = getSortedMonths(records)
  const currentMonth = months[months.length - 1] ?? null
  const previousMonth = months[months.length - 2] ?? null

  const currentRecords = filterByMonth(records, currentMonth)
  const previousRecords = filterByMonth(records, previousMonth)

  const currentSummary = computeDataSummary(currentRecords)
  const previousSummary = computeDataSummary(previousRecords)

  const trendLabel = previousMonth ? `vs ${previousMonth}` : 'No prior period'

  return {
    totalTickets: {
      value: summary.totalCases,
      trend: calcTrendPercent(currentRecords.length, previousRecords.length),
      trendLabel,
    },
    openTickets: {
      value: summary.openCases,
      trend: calcTrendPercent(currentSummary.openCases, previousSummary.openCases),
      trendLabel,
      invertTrend: true,
    },
    avgMttr: {
      value: summary.avgMttr,
      trend: calcTrendPercent(currentSummary.avgMttr, previousSummary.avgMttr),
      trendLabel,
      invertTrend: true,
    },
    closureRate: {
      value: summary.closureRate,
      trend: calcTrendPercent(currentSummary.closureRate, previousSummary.closureRate),
      trendLabel,
    },
    avgCustomerRating: {
      value: summary.avgCustomerRating,
      trend: calcTrendPercent(
        currentSummary.avgCustomerRating,
        previousSummary.avgCustomerRating,
      ),
      trendLabel,
    },
  }
}

/**
 * Group case counts by month for charts.
 * @param {import('../data/types').SupportCase[]} records
 */
export function groupCasesByMonth(records) {
  const counts = new Map()

  for (const record of records) {
    const key = record.month ?? 'Unknown'
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([name, tickets]) => ({ name, tickets }))
}

const CHART_COLORS = [
  '#4f46e5',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
]

/**
 * Monthly ticket volume for line chart (last 12 months).
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeMonthlyTicketTrend(records) {
  const counts = new Map()
  for (const record of records) {
    const key = record.month ?? 'Unknown'
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, tickets]) => ({ month, tickets }))
}

/**
 * Top issue types for bar chart.
 * @param {import('../data/types').SupportCase[]} records
 * @param {number} [limit=8]
 */
export function computeTopIssueTypes(records, limit = 8) {
  const counts = new Map()
  for (const record of records) {
    const key = record.issueBucket ?? record.typeOfIssues ?? 'Unknown'
    const label = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    counts.set(label, (counts.get(label) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }))
}

/**
 * Average MTTR by month for trend line chart.
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeMttrTrend(records) {
  const byMonth = new Map()

  for (const record of records) {
    if (record.mttr === null || !record.month) continue
    if (!byMonth.has(record.month)) byMonth.set(record.month, [])
    byMonth.get(record.month).push(record.mttr)
  }

  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, values]) => ({
      month,
      mttr: Number(average(values)?.toFixed(2) ?? 0),
    }))
}

/**
 * Ticket status distribution for donut chart.
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeStatusDistribution(records) {
  const counts = new Map()
  for (const record of records) {
    const key = record.status ?? 'Unknown'
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([name, value], index) => ({
      name,
      value,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }))
}

/**
 * All executive dashboard chart datasets.
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeExecutiveCharts(records) {
  return {
    monthlyTicketTrend: computeMonthlyTicketTrend(records),
    topIssueTypes: computeTopIssueTypes(records),
    mttrTrend: computeMttrTrend(records),
    statusDistribution: computeStatusDistribution(records),
  }
}
