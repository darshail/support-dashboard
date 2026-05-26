/**
 * @param {number | null | undefined} value
 */
export function formatKpiCount(value) {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat().format(Math.round(value))
}

/**
 * @param {number | null | undefined} value
 * @param {number} [decimals=1]
 */
export function formatKpiDays(value, decimals = 1) {
  if (value === null || value === undefined) return '—'
  return `${value.toFixed(decimals)}d`
}

/**
 * @param {number | null | undefined} value
 * @param {number} [decimals=1]
 */
export function formatKpiPercent(value, decimals = 1) {
  if (value === null || value === undefined) return '—'
  return `${value.toFixed(decimals)}%`
}

/**
 * @param {number | null | undefined} value
 * @param {number} [decimals=1]
 */
export function formatKpiRating(value, decimals = 1) {
  if (value === null || value === undefined) return '—'
  return `${value.toFixed(decimals)} / 5`
}
