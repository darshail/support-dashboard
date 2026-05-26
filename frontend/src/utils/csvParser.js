import { RAW_COLUMNS as C } from '../data/csvSchema'

const EMPTY_VALUES = new Set(['', 'na', 'n/a', 'null', 'none', 'unknown'])

/**
 * @param {unknown} value
 * @returns {string | null}
 */
export function parseString(value) {
  if (value === null || value === undefined) return null
  const trimmed = String(value).trim()
  if (!trimmed || EMPTY_VALUES.has(trimmed.toLowerCase())) return null
  return trimmed
}

/**
 * @param {unknown} value
 * @returns {number | null}
 */
export function parseNumber(value) {
  if (value === null || value === undefined) return null
  const trimmed = String(value).trim()
  if (!trimmed || EMPTY_VALUES.has(trimmed.toLowerCase())) return null
  const num = Number(trimmed)
  return Number.isFinite(num) ? num : null
}

/**
 * @param {unknown} value
 * @returns {boolean | null}
 */
export function parseBoolean(value) {
  const str = parseString(value)
  if (str === null) return null
  const lower = str.toLowerCase()
  if (lower === 'true') return true
  if (lower === 'false') return false
  return null
}

/**
 * Parse ISO-style datetime: 2025-05-27 15:23:00
 * @param {string} value
 */
function parseIsoDateTime(value) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/)
  if (!match) return null
  const [, y, mo, d, h, mi, s] = match
  const date = new Date(
    Number(y),
    Number(mo) - 1,
    Number(d),
    Number(h),
    Number(mi),
    Number(s),
  )
  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * Parse D/M/YYYY h:mm am/pm e.g. 27/5/2025 12:30 am
 * @param {string} value
 */
function parseDMYDateTime(value) {
  const match = value.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})\s*(am|pm)$/i,
  )
  if (!match) return null
  const [, day, month, year, hour, minute, ampm] = match
  let h = Number(hour)
  if (ampm.toLowerCase() === 'pm' && h !== 12) h += 12
  if (ampm.toLowerCase() === 'am' && h === 12) h = 0
  const date = new Date(Number(year), Number(month) - 1, Number(day), h, Number(minute))
  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * @param {unknown} value
 * @returns {Date | null}
 */
export function parseDate(value) {
  const str = parseString(value)
  if (!str) return null

  return parseIsoDateTime(str) ?? parseDMYDateTime(str) ?? fallbackDate(str)
}

function fallbackDate(value) {
  const normalized = value.includes('T') ? value : value.replace(' ', 'T')
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * @param {unknown} value
 * @returns {{ month: string | null, monthDate: Date | null }}
 */
export function parseMonth(value) {
  const str = parseString(value)
  if (!str) return { month: null, monthDate: null }

  const match = str.match(/^(\d{4})-(\d{2})$/)
  if (!match) return { month: str, monthDate: null }

  const [, year, month] = match
  const monthDate = new Date(Number(year), Number(month) - 1, 1)
  return { month: str, monthDate: Number.isNaN(monthDate.getTime()) ? null : monthDate }
}

/**
 * Normalize a raw PapaParse row into a typed SupportCase record.
 * @param {Record<string, string>} row
 */
export function normalizeRow(row) {
  const { month, monthDate } = parseMonth(row[C.MONTH])

  return {
    caseNumber: parseString(row[C.CASE_NUMBER]) ?? '',
    status: parseString(row[C.STATUS]),
    caseCategory: parseString(row[C.CASE_CATEGORY]),
    productType: parseString(row[C.PRODUCT_TYPE]),
    productSubType: parseString(row[C.PRODUCT_SUB_TYPE]),
    typeOfIssues: parseString(row[C.TYPE_OF_ISSUES]),
    dateTimeOpened: parseDate(row[C.DATE_TIME_OPENED]),
    accountName: parseString(row[C.ACCOUNT_NAME]),
    accountZone: parseString(row[C.ACCOUNT_ZONE]),
    resolutionDate: parseDate(row[C.RESOLUTION_DATE]),
    dateTimeClosed: parseDate(row[C.DATE_TIME_CLOSED]),
    resolutionCategory: parseString(row[C.RESOLUTION_CATEGORY]),
    resolutionSubType: parseString(row[C.RESOLUTION_SUB_TYPE]),
    mttr: parseNumber(row[C.MTTR]),
    caseAge: parseNumber(row[C.CASE_AGE]),
    mttrOemVendors: parseNumber(row[C.MTTR_OEM_VENDORS]),
    customerClosureChoice: parseString(row[C.CUSTOMER_CLOSURE_CHOICE]),
    customerRating: parseNumber(row[C.CUSTOMER_RATING]),
    customerFeedback: parseString(row[C.CUSTOMER_FEEDBACK]),
    assignedOemVendor: parseString(row[C.ASSIGNED_OEM_VENDOR]),
    resolvedByAgent: parseBoolean(row[C.RESOLVED_BY_AGENT]),
    accountRegion: parseString(row[C.ACCOUNT_REGION]),
    resolutionTimeHours: parseNumber(row[C.RESOLUTION_TIME_HOURS]),
    month,
    monthDate,
    issueBucket: parseString(row[C.ISSUE_BUCKET]),
  }
}
