/**
 * Format a number with locale-aware grouping.
 * @param {number} value
 */
export function formatNumber(value) {
  return new Intl.NumberFormat().format(value)
}

/**
 * Format a percentage change string.
 * @param {number} value
 */
export function formatPercent(value) {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value}%`
}
