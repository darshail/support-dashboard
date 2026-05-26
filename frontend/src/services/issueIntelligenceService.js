import { formatIssueTypeLabel, getIssueTypeKey } from '../utils/dashboardFilters'

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
 * @param {number[]} values
 */
function average(values) {
  const valid = values.filter((v) => v !== null && Number.isFinite(v))
  if (!valid.length) return null
  return valid.reduce((sum, v) => sum + v, 0) / valid.length
}

/**
 * @param {string} key
 */
export function issueLabel(key) {
  if (!key) return 'Unknown'
  return formatIssueTypeLabel(key)
}

/**
 * @param {string} key
 */
export function productLabel(key) {
  if (!key) return 'Unknown'
  return key.replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Issue distribution for donut chart.
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeIssueDistribution(records) {
  const counts = new Map()
  for (const record of records) {
    const key = getIssueTypeKey(record) ?? 'unknown'
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([key, value], index) => ({
      key,
      name: issueLabel(key),
      value,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }))
}

/**
 * Issues ranked by average MTTR (minimum case threshold).
 * @param {import('../data/types').SupportCase[]} records
 * @param {number} [limit=10]
 * @param {number} [minCases=5]
 */
export function computeHighMttrIssues(records, limit = 10, minCases = 5) {
  const byIssue = new Map()

  for (const record of records) {
    if (record.mttr === null) continue
    const key = getIssueTypeKey(record) ?? 'unknown'
    if (!byIssue.has(key)) byIssue.set(key, [])
    byIssue.get(key).push(record.mttr)
  }

  return Array.from(byIssue.entries())
    .filter(([, values]) => values.length >= minCases)
    .map(([key, values]) => ({
      key,
      name: issueLabel(key),
      avgMttr: Number(average(values)?.toFixed(2) ?? 0),
      count: values.length,
      maxMttr: Math.max(...values),
    }))
    .sort((a, b) => b.avgMttr - a.avgMttr)
    .slice(0, limit)
}

/**
 * Stacked bar data: top products with top issue breakdown.
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeIssueProductAnalysis(records, productLimit = 8, issueLimit = 5) {
  const matrix = new Map()
  const productTotals = new Map()
  const issueTotals = new Map()

  for (const record of records) {
    const product = record.productType ?? 'unknown'
    const issue = getIssueTypeKey(record) ?? 'unknown'
    productTotals.set(product, (productTotals.get(product) ?? 0) + 1)
    issueTotals.set(issue, (issueTotals.get(issue) ?? 0) + 1)
    const key = `${product}::${issue}`
    matrix.set(key, (matrix.get(key) ?? 0) + 1)
  }

  const topProducts = Array.from(productTotals.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, productLimit)
    .map(([key]) => key)

  const topIssues = Array.from(issueTotals.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, issueLimit)
    .map(([key]) => key)

  const rows = topProducts.map((productKey) => {
    const row = {
      productKey,
      product: productLabel(productKey),
      total: productTotals.get(productKey) ?? 0,
    }
    for (const issueKey of topIssues) {
      row[issueKey] = matrix.get(`${productKey}::${issueKey}`) ?? 0
    }
    return row
  })

  const issueSeries = topIssues.map((key, index) => ({
    key,
    name: issueLabel(key),
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }))

  return { rows, issueSeries }
}

/**
 * Repeat tickets: same account + same issue type, more than once.
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeRepeatIssueAnalysis(records) {
  const groups = new Map()

  for (const record of records) {
    const account = record.accountName ?? 'Unknown account'
    const issue = getIssueTypeKey(record) ?? 'unknown'
    const groupKey = `${account}::${issue}`
    if (!groups.has(groupKey)) {
      groups.set(groupKey, { account, issue, cases: [] })
    }
    groups.get(groupKey).cases.push(record)
  }

  let repeatCases = 0
  const byIssue = new Map()

  for (const { account, issue, cases } of groups.values()) {
    if (cases.length < 2) continue
    const extra = cases.length - 1
    repeatCases += extra

    if (!byIssue.has(issue)) {
      byIssue.set(issue, { repeatCases: 0, affectedAccounts: 0, totalCases: 0 })
    }
    const entry = byIssue.get(issue)
    entry.repeatCases += extra
    entry.affectedAccounts += 1
    entry.totalCases += cases.length
  }

  const byIssueChart = Array.from(byIssue.entries())
    .map(([key, stats]) => ({
      key,
      name: issueLabel(key),
      repeatCases: stats.repeatCases,
      affectedAccounts: stats.affectedAccounts,
      totalCases: stats.totalCases,
      repeatRate: stats.totalCases > 0 ? (stats.repeatCases / stats.totalCases) * 100 : 0,
    }))
    .sort((a, b) => b.repeatCases - a.repeatCases)
    .slice(0, 10)

  const accountsWithRepeats = [...groups.values()].filter((g) => g.cases.length >= 2).length

  return {
    repeatCases,
    repeatRate: records.length > 0 ? (repeatCases / records.length) * 100 : 0,
    accountsWithRepeats,
    byIssue: byIssueChart,
  }
}

/**
 * Top recurring problems ranked by repeat volume and affected accounts.
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeTopRecurringProblems(records, limit = 10) {
  const byIssue = new Map()

  for (const record of records) {
    const account = record.accountName ?? 'Unknown account'
    const issue = getIssueTypeKey(record) ?? 'unknown'
    if (!byIssue.has(issue)) {
      byIssue.set(issue, { accounts: new Map(), cases: [], mttr: [] })
    }
    const entry = byIssue.get(issue)
    entry.cases.push(record)
    if (record.mttr !== null) entry.mttr.push(record.mttr)
    const prev = entry.accounts.get(account) ?? 0
    entry.accounts.set(account, prev + 1)
  }

  return Array.from(byIssue.entries())
    .map(([key, entry]) => {
      const recurringAccounts = [...entry.accounts.values()].filter((c) => c >= 2).length
      const recurrenceScore = [...entry.accounts.values()]
        .filter((c) => c >= 2)
        .reduce((sum, c) => sum + (c - 1), 0)

      return {
        key,
        name: issueLabel(key),
        occurrences: entry.cases.length,
        recurringAccounts,
        recurrenceScore,
        avgMttr: average(entry.mttr),
      }
    })
    .filter((row) => row.recurrenceScore > 0 || row.recurringAccounts > 0)
    .sort((a, b) => b.recurrenceScore - a.recurrenceScore || b.occurrences - a.occurrences)
    .slice(0, limit)
}

/**
 * @typedef {Object} DrillDownSelection
 * @property {'issue' | 'product' | 'issueProduct' | 'account'} dimension
 * @property {string} label
 * @property {string} [issueKey]
 * @property {string} [productKey]
 * @property {string} [accountName]
 */

/**
 * @param {import('../data/types').SupportCase[]} records
 * @param {DrillDownSelection | null} drillDown
 */
export function getDrillDownCases(records, drillDown) {
  if (!drillDown) return []

  return records.filter((record) => {
    switch (drillDown.dimension) {
      case 'issue':
        return getIssueTypeKey(record) === drillDown.issueKey
      case 'product':
        return record.productType === drillDown.productKey
      case 'issueProduct':
        return (
          record.productType === drillDown.productKey &&
          getIssueTypeKey(record) === drillDown.issueKey
        )
      case 'account':
        return record.accountName === drillDown.accountName
      default:
        return true
    }
  })
}

/**
 * All issue intelligence datasets for the dashboard.
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeIssueIntelligence(records) {
  return {
    issueDistribution: computeIssueDistribution(records),
    highMttrIssues: computeHighMttrIssues(records),
    issueProduct: computeIssueProductAnalysis(records),
    repeatAnalysis: computeRepeatIssueAnalysis(records),
    topRecurring: computeTopRecurringProblems(records),
  }
}
