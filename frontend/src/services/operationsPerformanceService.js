const CLOSED_STATUSES = ['closed', 'auto closed', 'customer closed']

/** Resolution SLA in hours (closed tickets) */
export const RESOLUTION_SLA_HOURS = 72

/** MTTR / open-case age SLA in days */
export const MTTR_SLA_DAYS = 7

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

const AGING_BUCKETS = [
  { key: '0-1', label: '0–1 days', min: 0, max: 1 },
  { key: '1-3', label: '1–3 days', min: 1, max: 3 },
  { key: '3-7', label: '3–7 days', min: 3, max: 7 },
  { key: '7-14', label: '7–14 days', min: 7, max: 14 },
  { key: '14-30', label: '14–30 days', min: 14, max: 30 },
  { key: '30+', label: '30+ days', min: 30, max: Infinity },
]

/**
 * @param {import('../data/types').SupportCase} record
 */
export function isClosedCase(record) {
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
 * @param {import('../data/types').SupportCase} record
 */
export function getTicketAgeDays(record) {
  if (record.caseAge !== null) return record.caseAge
  if (record.mttr !== null) return record.mttr
  return null
}

/**
 * @param {import('../data/types').SupportCase} record
 */
export function isSlaBreached(record) {
  const closed = isClosedCase(record)

  if (closed && record.resolutionTimeHours !== null) {
    return record.resolutionTimeHours > RESOLUTION_SLA_HOURS
  }

  const age = getTicketAgeDays(record)
  if (age !== null) {
    return age > MTTR_SLA_DAYS
  }

  if (record.mttr !== null) {
    return record.mttr > MTTR_SLA_DAYS
  }

  return false
}

/**
 * @param {string | null | undefined} vendor
 */
export function formatVendorLabel(vendor) {
  if (!vendor) return 'Unassigned'
  return vendor.length > 28 ? `${vendor.slice(0, 26)}…` : vendor
}

/**
 * @param {import('../data/types').SupportCase[]} records
 * @param {(record: import('../data/types').SupportCase) => string | null} getKey
 * @param {(key: string) => string} formatLabel
 * @param {number} [limit=12]
 * @param {number} [minCases=5]
 */
function computeMttrByDimension(records, getKey, formatLabel, limit = 12, minCases = 5) {
  const groups = new Map()

  for (const record of records) {
    const rawKey = getKey(record)
    if (!rawKey) continue
    if (!groups.has(rawKey)) {
      groups.set(rawKey, { mttr: [], breached: 0, total: 0 })
    }
    const entry = groups.get(rawKey)
    entry.total += 1
    if (isSlaBreached(record)) entry.breached += 1
    if (record.mttr !== null) entry.mttr.push(record.mttr)
  }

  return Array.from(groups.entries())
    .filter(([, stats]) => stats.total >= minCases)
    .map(([key, stats]) => ({
      key,
      name: formatLabel(key),
      avgMttr: Number(average(stats.mttr)?.toFixed(2) ?? 0),
      count: stats.total,
      breachRate: stats.total > 0 ? (stats.breached / stats.total) * 100 : 0,
    }))
    .sort((a, b) => b.avgMttr - a.avgMttr)
    .slice(0, limit)
}

/**
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeMttrByRegion(records) {
  return computeMttrByDimension(
    records,
    (r) => r.accountRegion,
    (key) => key,
    12,
    5,
  )
}

/**
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeMttrByVendor(records) {
  return computeMttrByDimension(
    records,
    (r) => r.assignedOemVendor ?? '__unassigned__',
    (key) => (key === '__unassigned__' ? 'Unassigned' : formatVendorLabel(key)),
    12,
    5,
  )
}

/**
 * @param {number | null} ageDays
 */
function getAgingBucketKey(ageDays) {
  if (ageDays === null) return null
  const bucket = AGING_BUCKETS.find((b) => ageDays >= b.min && ageDays < b.max)
  return bucket?.key ?? null
}

/**
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeTicketAging(records) {
  return AGING_BUCKETS.map((bucket) => {
    let open = 0
    let closed = 0

    for (const record of records) {
      const age = getTicketAgeDays(record)
      const key = getAgingBucketKey(age)
      if (key !== bucket.key) continue
      if (isClosedCase(record)) closed += 1
      else open += 1
    }

    return {
      key: bucket.key,
      name: bucket.label,
      open,
      closed,
      total: open + closed,
    }
  }).filter((row) => row.total > 0)
}

/**
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeSlaBreachAnalysis(records) {
  let breached = 0
  let met = 0
  const byRegion = new Map()

  for (const record of records) {
    const region = record.accountRegion ?? 'Unknown'
    if (!byRegion.has(region)) {
      byRegion.set(region, { breached: 0, total: 0 })
    }
    const entry = byRegion.get(region)
    entry.total += 1

    if (isSlaBreached(record)) {
      breached += 1
      entry.breached += 1
    } else {
      met += 1
    }
  }

  const total = records.length
  const byRegionChart = Array.from(byRegion.entries())
    .filter(([, stats]) => stats.total >= 5)
    .map(([key, stats]) => ({
      key,
      name: key,
      breached: stats.breached,
      met: stats.total - stats.breached,
      total: stats.total,
      breachRate: stats.total > 0 ? (stats.breached / stats.total) * 100 : 0,
    }))
    .sort((a, b) => b.breachRate - a.breachRate)
    .slice(0, 12)

  return {
    summary: {
      breached,
      met,
      total,
      breachRate: total > 0 ? (breached / total) * 100 : 0,
      distribution: [
        { key: 'breached', name: 'SLA breached', value: breached, fill: '#ef4444' },
        { key: 'met', name: 'Within SLA', value: met, fill: '#10b981' },
      ].filter((d) => d.value > 0),
    },
    byRegion: byRegionChart,
  }
}

/**
 * @param {import('../data/types').SupportCase} record
 */
function getAgentGroupKey(record) {
  if (record.resolvedByAgent === true) return 'agent'
  if (record.resolvedByAgent === false) return 'non_agent'
  return 'unknown'
}

const AGENT_GROUP_LABELS = {
  agent: 'Resolved by agent',
  non_agent: 'Not agent-resolved',
  unknown: 'Unknown',
}

/**
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeAgentPerformance(records) {
  const groups = new Map()

  for (const record of records) {
    const key = getAgentGroupKey(record)
    if (!groups.has(key)) {
      groups.set(key, {
        cases: 0,
        mttr: [],
        ratings: [],
        breached: 0,
        closed: 0,
      })
    }
    const entry = groups.get(key)
    entry.cases += 1
    if (record.mttr !== null) entry.mttr.push(record.mttr)
    if (record.customerRating !== null) entry.ratings.push(record.customerRating)
    if (isSlaBreached(record)) entry.breached += 1
    if (isClosedCase(record)) entry.closed += 1
  }

  return ['agent', 'non_agent', 'unknown']
    .filter((key) => groups.has(key))
    .map((key) => {
      const stats = groups.get(key)
      return {
        key,
        name: AGENT_GROUP_LABELS[key],
        cases: stats.cases,
        avgMttr: Number(average(stats.mttr)?.toFixed(2) ?? 0),
        avgRating: average(stats.ratings),
        breachRate: stats.cases > 0 ? (stats.breached / stats.cases) * 100 : 0,
        closureRate: stats.cases > 0 ? (stats.closed / stats.cases) * 100 : 0,
        fill: key === 'agent' ? CHART_COLORS[0] : key === 'non_agent' ? CHART_COLORS[2] : CHART_COLORS[4],
      }
    })
}

/**
 * @typedef {Object} OperationsDrillDown
 * @property {'region' | 'vendor' | 'aging' | 'sla' | 'agent'} dimension
 * @property {string} label
 * @property {string} key
 */

/**
 * @param {import('../data/types').SupportCase[]} records
 * @param {OperationsDrillDown | null} drillDown
 */
export function getOperationsDrillDownCases(records, drillDown) {
  if (!drillDown) return []

  return records.filter((record) => {
    switch (drillDown.dimension) {
      case 'region':
        return (record.accountRegion ?? 'Unknown') === drillDown.key
      case 'vendor':
        return (record.assignedOemVendor ?? '__unassigned__') === drillDown.key
      case 'aging':
        return getAgingBucketKey(getTicketAgeDays(record)) === drillDown.key
      case 'sla':
        return drillDown.key === 'breached' ? isSlaBreached(record) : !isSlaBreached(record)
      case 'agent':
        return getAgentGroupKey(record) === drillDown.key
      default:
        return true
    }
  })
}

/**
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeOperationsPerformance(records) {
  const sla = computeSlaBreachAnalysis(records)
  return {
    mttrByRegion: computeMttrByRegion(records),
    mttrByVendor: computeMttrByVendor(records),
    ticketAging: computeTicketAging(records),
    slaBreach: sla,
    agentPerformance: computeAgentPerformance(records),
    slaTargets: {
      resolutionHours: RESOLUTION_SLA_HOURS,
      mttrDays: MTTR_SLA_DAYS,
    },
  }
}
