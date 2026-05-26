import { ROUTES } from '../utils/constants'
import { formatIssueTypeLabel, getIssueTypeKey } from '../utils/dashboardFilters'
import {
  isSatisfiedRating,
  SATISFIED_RATING_THRESHOLD,
} from './customerExperienceService'
import { computeHighMttrIssues, issueLabel } from './issueIntelligenceService'
import {
  formatVendorLabel,
  isSlaBreached,
  MTTR_SLA_DAYS,
} from './operationsPerformanceService'

/**
 * @typedef {'info' | 'warning' | 'critical'} InsightSeverity
 * @typedef {'issue' | 'mttr' | 'region' | 'satisfaction' | 'vendor'} InsightCategory
 *
 * @typedef {Object} AutomatedInsight
 * @property {string} id
 * @property {InsightCategory} category
 * @property {InsightSeverity} severity
 * @property {string} title
 * @property {string} description
 * @property {string} metricLabel
 * @property {string} metricValue
 * @property {string} [path]
 */

/**
 * @param {number[]} values
 */
function average(values) {
  const valid = values.filter((v) => v !== null && Number.isFinite(v))
  if (!valid.length) return null
  return valid.reduce((sum, v) => sum + v, 0) / valid.length
}

/**
 * @param {import('../data/types').SupportCase[]} records
 */
function getSortedMonths(records) {
  return [...new Set(records.map((r) => r.month).filter(Boolean))].sort()
}

/**
 * @param {import('../data/types').SupportCase[]} records
 * @returns {AutomatedInsight | null}
 */
function buildMostCommonIssueInsight(records) {
  if (!records.length) return null

  const counts = new Map()
  for (const record of records) {
    const key = getIssueTypeKey(record) ?? 'unknown'
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const [topKey, topCount] = [...counts.entries()].sort(([, a], [, b]) => b - a)[0]
  const share = (topCount / records.length) * 100
  const name = issueLabel(topKey)

  return {
    id: 'most-common-issue',
    category: 'issue',
    severity: share >= 25 ? 'warning' : 'info',
    title: 'Most common issue category',
    description: `${name} accounts for ${share.toFixed(1)}% of cases in the current view.`,
    metricLabel: 'Case volume',
    metricValue: topCount.toLocaleString(),
    path: ROUTES.ISSUES,
  }
}

/**
 * @param {import('../data/types').SupportCase[]} records
 * @returns {AutomatedInsight | null}
 */
function buildHighestMttrInsight(records) {
  const top = computeHighMttrIssues(records, 1, 5)[0]
  if (!top) {
    return {
      id: 'highest-mttr',
      category: 'mttr',
      severity: 'info',
      title: 'Highest MTTR issue',
      description: 'Not enough MTTR data per issue type to surface a leader (needs 5+ cases each).',
      metricLabel: 'Status',
      metricValue: 'Insufficient data',
      path: ROUTES.OPERATIONS,
    }
  }

  let severity = 'info'
  if (top.avgMttr > MTTR_SLA_DAYS * 2) severity = 'critical'
  else if (top.avgMttr > MTTR_SLA_DAYS) severity = 'warning'

  return {
    id: 'highest-mttr',
    category: 'mttr',
    severity,
    title: 'Highest MTTR issue',
    description: `${top.name} has the longest average resolution time among issue types with sufficient volume.`,
    metricLabel: 'Avg MTTR',
    metricValue: `${top.avgMttr}d`,
    path: ROUTES.OPERATIONS,
  }
}

/**
 * @param {import('../data/types').SupportCase[]} records
 * @returns {AutomatedInsight}
 */
function buildRegionSpikeInsight(records) {
  const months = getSortedMonths(records)
  const currentMonth = months[months.length - 1]
  const previousMonth = months[months.length - 2]

  if (!currentMonth || !previousMonth) {
    return {
      id: 'region-spike',
      category: 'region',
      severity: 'info',
      title: 'Regional ticket spikes',
      description: 'Need at least two months of data to compare regional ticket volume.',
      metricLabel: 'Status',
      metricValue: 'Awaiting trend',
      path: ROUTES.DASHBOARD,
    }
  }

  const currentByRegion = new Map()
  const previousByRegion = new Map()

  for (const record of records) {
    if (!record.accountRegion || !record.month) continue
    const map = record.month === currentMonth ? currentByRegion : record.month === previousMonth ? previousByRegion : null
    if (!map) continue
    map.set(record.accountRegion, (map.get(record.accountRegion) ?? 0) + 1)
  }

  let bestSpike = null

  for (const [region, currentCount] of currentByRegion.entries()) {
    const previousCount = previousByRegion.get(region) ?? 0
    if (previousCount < 3) continue

    const change = currentCount - previousCount
    const changePct = (change / previousCount) * 100

    if (changePct < 50 && change < 5) continue

    if (
      !bestSpike ||
      changePct > bestSpike.changePct ||
      (changePct === bestSpike.changePct && change > bestSpike.change)
    ) {
      bestSpike = { region, currentCount, previousCount, change, changePct }
    }
  }

  if (!bestSpike) {
    return {
      id: 'region-spike',
      category: 'region',
      severity: 'info',
      title: 'Regional ticket spikes',
      description: `No region exceeded a 50% MoM increase between ${previousMonth} and ${currentMonth}.`,
      metricLabel: 'Latest month',
      metricValue: currentMonth,
      path: ROUTES.DASHBOARD,
    }
  }

  const severity = bestSpike.changePct >= 100 || bestSpike.change >= 15 ? 'critical' : 'warning'

  return {
    id: 'region-spike',
    category: 'region',
    severity,
    title: 'Regions with spike in tickets',
    description: `${bestSpike.region} ticket volume rose ${bestSpike.changePct.toFixed(0)}% vs the prior month (${bestSpike.previousCount} → ${bestSpike.currentCount}).`,
    metricLabel: 'MoM change',
    metricValue: `+${bestSpike.change}`,
    path: ROUTES.DASHBOARD,
  }
}

/**
 * @param {import('../data/types').SupportCase[]} records
 * @returns {AutomatedInsight}
 */
function buildSatisfactionInsight(records) {
  const rated = records.filter((r) => r.customerRating !== null)

  if (rated.length < 5) {
    return {
      id: 'low-satisfaction',
      category: 'satisfaction',
      severity: 'info',
      title: 'Customer satisfaction',
      description: 'Too few rated tickets in this view to generate a satisfaction alert.',
      metricLabel: 'Rated cases',
      metricValue: rated.length.toLocaleString(),
      path: ROUTES.CUSTOMER_EXPERIENCE,
    }
  }

  const satisfied = rated.filter(isSatisfiedRating).length
  const satisfactionRate = (satisfied / rated.length) * 100
  const avgRating = average(rated.map((r) => r.customerRating))

  const byIssue = new Map()
  for (const record of rated) {
    const key = getIssueTypeKey(record) ?? 'unknown'
    if (!byIssue.has(key)) byIssue.set(key, [])
    byIssue.get(key).push(record.customerRating)
  }

  const worstIssue = [...byIssue.entries()]
    .filter(([, ratings]) => ratings.length >= 3)
    .map(([key, ratings]) => ({
      key,
      name: formatIssueTypeLabel(key),
      avg: average(ratings),
    }))
    .sort((a, b) => (a.avg ?? 5) - (b.avg ?? 5))[0]

  let severity = 'info'
  let description = `Overall satisfaction is ${satisfactionRate.toFixed(0)}% (ratings ${SATISFIED_RATING_THRESHOLD}+).`

  if (satisfactionRate < 50 || (avgRating !== null && avgRating < 3)) {
    severity = 'critical'
    description = `Only ${satisfactionRate.toFixed(0)}% of rated tickets meet the satisfaction threshold.`
  } else if (satisfactionRate < 70 || (avgRating !== null && avgRating < 3.5)) {
    severity = 'warning'
    description = `Satisfaction has slipped to ${satisfactionRate.toFixed(0)}% — review low-rated cases.`
  }

  if (worstIssue && worstIssue.avg !== null && worstIssue.avg < 3.5) {
    description += ` ${worstIssue.name} averages ${worstIssue.avg.toFixed(1)} / 5.`
    if (severity === 'info') severity = 'warning'
  }

  const negativeCount = records.filter(
    (r) => r.customerRating !== null && r.customerRating <= 2,
  ).length

  if (negativeCount > 0 && severity === 'info') {
    severity = 'warning'
    description += ` ${negativeCount} tickets rated 2 stars or below.`
  }

  return {
    id: 'low-satisfaction',
    category: 'satisfaction',
    severity,
    title: 'Customer satisfaction alert',
    description,
    metricLabel: 'Avg rating',
    metricValue: avgRating !== null ? `${avgRating.toFixed(1)} / 5` : '—',
    path: ROUTES.CUSTOMER_EXPERIENCE,
  }
}

/**
 * @param {import('../data/types').SupportCase[]} records
 * @returns {AutomatedInsight}
 */
function buildVendorInsight(records) {
  const groups = new Map()

  for (const record of records) {
    const key = record.assignedOemVendor ?? '__unassigned__'
    if (!groups.has(key)) {
      groups.set(key, { mttr: [], breached: 0, total: 0 })
    }
    const entry = groups.get(key)
    entry.total += 1
    if (isSlaBreached(record)) entry.breached += 1
    if (record.mttr !== null) entry.mttr.push(record.mttr)
  }

  const vendors = [...groups.entries()]
    .filter(([, s]) => s.total >= 5 && s.mttr.length > 0)
    .map(([key, stats]) => ({
      key,
      name: key === '__unassigned__' ? 'Unassigned' : formatVendorLabel(key),
      avgMttr: average(stats.mttr) ?? 0,
      breachRate: (stats.breached / stats.total) * 100,
      total: stats.total,
    }))
    .sort((a, b) => b.breachRate - a.breachRate || b.avgMttr - a.avgMttr)

  const concern = vendors.find((v) => v.breachRate >= 45 || v.avgMttr > MTTR_SLA_DAYS * 1.5)

  if (!concern) {
    const top = vendors[0]
    return {
      id: 'vendor-performance',
      category: 'vendor',
      severity: 'info',
      title: 'Vendor performance',
      description: top
        ? `No vendor exceeds SLA risk thresholds. Highest breach rate: ${top.name} at ${top.breachRate.toFixed(0)}%.`
        : 'Insufficient vendor-assigned volume to assess performance.',
      metricLabel: 'Vendors tracked',
      metricValue: vendors.length.toLocaleString(),
      path: ROUTES.OPERATIONS,
    }
  }

  const severity =
    concern.breachRate >= 60 || concern.avgMttr > MTTR_SLA_DAYS * 2 ? 'critical' : 'warning'

  return {
    id: 'vendor-performance',
    category: 'vendor',
    severity,
    title: 'Vendor performance concern',
    description: `${concern.name} shows elevated SLA risk with ${concern.breachRate.toFixed(0)}% breach rate across ${concern.total} cases.`,
    metricLabel: 'Avg MTTR',
    metricValue: `${concern.avgMttr.toFixed(1)}d`,
    path: ROUTES.OPERATIONS,
  }
}

const SEVERITY_ORDER = { critical: 0, warning: 1, info: 2 }

/**
 * @param {import('../data/types').SupportCase[]} records
 * @returns {AutomatedInsight[]}
 */
export function generateAutomatedInsights(records) {
  if (!records.length) {
    return [
      {
        id: 'no-data',
        category: 'issue',
        severity: 'info',
        title: 'No cases in view',
        description: 'Adjust global filters or load data to generate automated insights.',
        metricLabel: 'Cases',
        metricValue: '0',
      },
    ]
  }

  const insights = [
    buildMostCommonIssueInsight(records),
    buildHighestMttrInsight(records),
    buildRegionSpikeInsight(records),
    buildSatisfactionInsight(records),
    buildVendorInsight(records),
  ].filter(Boolean)

  return insights.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
}
