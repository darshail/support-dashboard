import { formatIssueTypeLabel, getIssueTypeKey } from '../utils/dashboardFilters'

/** Ratings at or below this are negative */
export const NEGATIVE_RATING_THRESHOLD = 2

/** Ratings below this count as low satisfaction */
export const LOW_RATING_THRESHOLD = 3

/** Ratings at or above this count as satisfied */
export const SATISFIED_RATING_THRESHOLD = 4

const CHART_COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

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
export function hasFeedbackText(record) {
  const text = record.customerFeedback?.trim()
  if (!text) return false
  const lower = text.toLowerCase()
  return !['na', 'n/a', 'null', 'none', 'unknown'].includes(lower)
}

/**
 * @param {import('../data/types').SupportCase} record
 */
export function isNegativeFeedback(record) {
  if (record.customerRating !== null && record.customerRating <= NEGATIVE_RATING_THRESHOLD) {
    return true
  }
  if (hasFeedbackText(record)) {
    return record.customerRating === null || record.customerRating <= LOW_RATING_THRESHOLD
  }
  return false
}

/**
 * @param {import('../data/types').SupportCase} record
 */
export function isSatisfiedRating(record) {
  return record.customerRating !== null && record.customerRating >= SATISFIED_RATING_THRESHOLD
}

/**
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeRatingTrends(records) {
  const byMonth = new Map()

  for (const record of records) {
    if (record.customerRating === null || !record.month) continue
    if (!byMonth.has(record.month)) {
      byMonth.set(record.month, { ratings: [], satisfied: 0 })
    }
    const entry = byMonth.get(record.month)
    entry.ratings.push(record.customerRating)
    if (isSatisfiedRating(record)) entry.satisfied += 1
  }

  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, stats]) => ({
      month,
      key: month,
      avgRating: Number(average(stats.ratings)?.toFixed(2) ?? 0),
      count: stats.ratings.length,
      satisfactionRate:
        stats.ratings.length > 0 ? (stats.satisfied / stats.ratings.length) * 100 : 0,
    }))
}

/**
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeSatisfactionTrends(records) {
  const trends = computeRatingTrends(records)
  return trends.map((row) => ({
    month: row.month,
    key: row.key,
    satisfactionRate: Number(row.satisfactionRate.toFixed(1)),
    responseCount: row.count,
    avgRating: row.avgRating,
  }))
}

/**
 * @param {import('../data/types').SupportCase[]} records
 * @param {number} [minRatings=3]
 */
export function computeRatingByIssue(records, minRatings = 3) {
  const byIssue = new Map()

  for (const record of records) {
    if (record.customerRating === null) continue
    const key = getIssueTypeKey(record) ?? 'unknown'
    if (!byIssue.has(key)) byIssue.set(key, [])
    byIssue.get(key).push(record.customerRating)
  }

  return Array.from(byIssue.entries())
    .filter(([, ratings]) => ratings.length >= minRatings)
    .map(([key, ratings]) => ({
      key,
      name: formatIssueTypeLabel(key),
      avgRating: Number(average(ratings)?.toFixed(2) ?? 0),
      count: ratings.length,
    }))
    .sort((a, b) => a.avgRating - b.avgRating)
    .slice(0, 12)
}

/**
 * @param {import('../data/types').SupportCase[]} records
 * @param {number} [limit=50]
 */
export function computeNegativeFeedback(records, limit = 50) {
  return records
    .filter(isNegativeFeedback)
    .map((record) => ({
      caseNumber: record.caseNumber,
      accountName: record.accountName ?? 'Unknown account',
      accountKey: record.accountName ?? '__unknown__',
      customerRating: record.customerRating,
      customerFeedback: record.customerFeedback,
      issueLabel: formatIssueTypeLabel(getIssueTypeKey(record) ?? 'unknown'),
      issueKey: getIssueTypeKey(record) ?? 'unknown',
      productType: record.productType,
      accountRegion: record.accountRegion,
      month: record.month,
      status: record.status,
    }))
    .sort((a, b) => {
      const ratingA = a.customerRating ?? 0
      const ratingB = b.customerRating ?? 0
      if (ratingA !== ratingB) return ratingA - ratingB
      return (b.customerFeedback?.length ?? 0) - (a.customerFeedback?.length ?? 0)
    })
    .slice(0, limit)
}

/**
 * @param {import('../data/types').SupportCase[]} records
 * @param {number} [limit=12]
 */
export function computeRepeatedComplaintAccounts(records, limit = 12) {
  const byAccount = new Map()

  for (const record of records) {
    const isComplaint =
      (record.customerRating !== null && record.customerRating <= LOW_RATING_THRESHOLD) ||
      hasFeedbackText(record)

    if (!isComplaint) continue

    const key = record.accountName ?? '__unknown__'
    if (!byAccount.has(key)) {
      byAccount.set(key, {
        accountName: record.accountName ?? 'Unknown account',
        complaints: [],
        ratings: [],
      })
    }
    const entry = byAccount.get(key)
    entry.complaints.push(record)
    if (record.customerRating !== null) entry.ratings.push(record.customerRating)
  }

  return Array.from(byAccount.entries())
    .filter(([, stats]) => stats.complaints.length >= 2)
    .map(([key, stats]) => ({
      key,
      name:
        stats.accountName.length > 32
          ? `${stats.accountName.slice(0, 30)}…`
          : stats.accountName,
      fullName: stats.accountName,
      complaintCount: stats.complaints.length,
      avgRating: Number(average(stats.ratings)?.toFixed(2) ?? 0),
      ratingCount: stats.ratings.length,
      fill: CHART_COLORS[0],
    }))
    .sort((a, b) => b.complaintCount - a.complaintCount)
    .slice(0, limit)
}

/**
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeCustomerExperienceSummary(records) {
  const rated = records.filter((r) => r.customerRating !== null)
  const satisfied = rated.filter(isSatisfiedRating)
  const negative = records.filter(isNegativeFeedback)

  return {
    ratedCount: rated.length,
    avgRating: average(rated.map((r) => r.customerRating)),
    satisfactionRate: rated.length > 0 ? (satisfied.length / rated.length) * 100 : null,
    negativeFeedbackCount: negative.length,
    feedbackWithTextCount: records.filter(hasFeedbackText).length,
  }
}

/**
 * @typedef {Object} CustomerExperienceDrillDown
 * @property {'month' | 'issue' | 'account' | 'negative'} dimension
 * @property {string} label
 * @property {string} key
 */

/**
 * @param {import('../data/types').SupportCase[]} records
 * @param {CustomerExperienceDrillDown | null} drillDown
 */
export function getCustomerExperienceDrillDownCases(records, drillDown) {
  if (!drillDown) return []

  return records.filter((record) => {
    switch (drillDown.dimension) {
      case 'month':
        return record.month === drillDown.key
      case 'issue':
        return (getIssueTypeKey(record) ?? 'unknown') === drillDown.key
      case 'account':
        return (record.accountName ?? '__unknown__') === drillDown.key
      case 'negative':
        return isNegativeFeedback(record)
      default:
        return true
    }
  })
}

/**
 * @param {import('../data/types').SupportCase[]} records
 */
export function computeCustomerExperience(records) {
  return {
    summary: computeCustomerExperienceSummary(records),
    ratingTrends: computeRatingTrends(records),
    satisfactionTrends: computeSatisfactionTrends(records),
    ratingByIssue: computeRatingByIssue(records),
    negativeFeedback: computeNegativeFeedback(records),
    repeatedComplaints: computeRepeatedComplaintAccounts(records),
  }
}
