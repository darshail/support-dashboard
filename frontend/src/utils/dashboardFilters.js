/**
 * @typedef {Object} DashboardFilters
 * @property {string[]} region
 * @property {string[]} productType
 * @property {string[]} issueType
 * @property {string[]} status
 * @property {string[]} month
 */

/** @type {DashboardFilters} */
export const DEFAULT_DASHBOARD_FILTERS = {
  region: [],
  productType: [],
  issueType: [],
  status: [],
  month: [],
}

/** @type {(keyof DashboardFilters)[]} */
export const FILTER_KEYS = ['region', 'productType', 'issueType', 'status', 'month']

export const FILTER_LABELS = {
  region: 'Region',
  productType: 'Product Type',
  issueType: 'Issue Type',
  status: 'Status',
  month: 'Month',
}

/**
 * @param {import('../data/types').SupportCase} record
 */
export function getIssueTypeKey(record) {
  return record.issueBucket ?? record.typeOfIssues ?? null
}

/**
 * @param {string} key
 */
export function formatIssueTypeLabel(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * @param {string} month YYYY-MM
 */
export function formatMonthLabel(month) {
  const [year, monthNum] = month.split('-')
  if (!year || !monthNum) return month
  const date = new Date(Number(year), Number(monthNum) - 1, 1)
  if (Number.isNaN(date.getTime())) return month
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

/**
 * @param {import('../data/types').SupportCase[]} records
 * @param {DashboardFilters} filters
 */
export function applyDashboardFilters(records, filters) {
  return records.filter((record) => {
    if (filters.region.length > 0 && !filters.region.includes(record.accountRegion)) {
      return false
    }
    if (filters.productType.length > 0 && !filters.productType.includes(record.productType)) {
      return false
    }
    const issueKey = getIssueTypeKey(record)
    if (filters.issueType.length > 0 && !filters.issueType.includes(issueKey)) {
      return false
    }
    if (filters.status.length > 0) {
      const status = record.status?.toLowerCase() ?? ''
      const matches = filters.status.some((s) => s.toLowerCase() === status)
      if (!matches) return false
    }
    if (filters.month.length > 0 && !filters.month.includes(record.month)) {
      return false
    }
    return true
  })
}

/**
 * @param {DashboardFilters} filters
 */
export function hasActiveFilters(filters) {
  return FILTER_KEYS.some((key) => filters[key].length > 0)
}

/**
 * @param {string[]} values
 */
function sortOptions(values) {
  return [...values].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
}

/**
 * @typedef {{ value: string, label: string }[]} FilterOptionList
 */

/**
 * @param {import('../data/types').SupportCase[]} records
 * @returns {Record<keyof DashboardFilters, FilterOptionList>}
 */
export function getFilterOptions(records) {
  const regions = new Set()
  const productTypes = new Set()
  const issueTypes = new Set()
  const statuses = new Set()
  const months = new Set()

  for (const record of records) {
    if (record.accountRegion) regions.add(record.accountRegion)
    if (record.productType) productTypes.add(record.productType)
    const issueKey = getIssueTypeKey(record)
    if (issueKey) issueTypes.add(issueKey)
    if (record.status) statuses.add(record.status)
    if (record.month) months.add(record.month)
  }

  return {
    region: sortOptions([...regions]).map((value) => ({ value, label: value })),
    productType: sortOptions([...productTypes]).map((value) => ({ value, label: value })),
    issueType: sortOptions([...issueTypes]).map((value) => ({
      value,
      label: formatIssueTypeLabel(value),
    })),
    status: sortOptions([...statuses]).map((value) => ({ value, label: value })),
    month: sortOptions([...months]).map((value) => ({
      value,
      label: formatMonthLabel(value),
    })),
  }
}
