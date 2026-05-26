import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  computeDataSummary,
  computeExecutiveCharts,
  computeKpiMetrics,
  groupCasesByMonth,
  loadCleanedData,
} from '../services/dataService'
import { computeIssueIntelligence } from '../services/issueIntelligenceService'
import { computeCustomerExperience } from '../services/customerExperienceService'
import { generateAutomatedInsights } from '../services/insightsService'
import { computeOperationsPerformance } from '../services/operationsPerformanceService'
import {
  applyDashboardFilters,
  DEFAULT_DASHBOARD_FILTERS,
  getFilterOptions,
  getIssueTypeKey,
  hasActiveFilters,
} from '../utils/dashboardFilters'
import { DataContext } from './DataContext'

export default function DataProvider({ children }) {
  const [records, setRecords] = useState([])
  const [filters, setFilters] = useState(DEFAULT_DASHBOARD_FILTERS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [meta, setMeta] = useState(null)
  const [parseErrors, setParseErrors] = useState([])

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await loadCleanedData()
      setRecords(result.records)
      setMeta(result.meta)
      setParseErrors(result.errors)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
      setRecords([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filterOptions = useMemo(() => getFilterOptions(records), [records])

  const filteredRecords = useMemo(
    () => applyDashboardFilters(records, filters),
    [records, filters],
  )

  const summary = useMemo(() => computeDataSummary(filteredRecords), [filteredRecords])
  const kpiMetrics = useMemo(() => computeKpiMetrics(filteredRecords), [filteredRecords])
  const executiveCharts = useMemo(
    () => computeExecutiveCharts(filteredRecords),
    [filteredRecords],
  )
  const casesByMonth = useMemo(() => groupCasesByMonth(filteredRecords), [filteredRecords])
  const issueIntelligence = useMemo(
    () => computeIssueIntelligence(filteredRecords),
    [filteredRecords],
  )
  const operationsPerformance = useMemo(
    () => computeOperationsPerformance(filteredRecords),
    [filteredRecords],
  )
  const customerExperience = useMemo(
    () => computeCustomerExperience(filteredRecords),
    [filteredRecords],
  )
  const automatedInsights = useMemo(
    () => generateAutomatedInsights(filteredRecords),
    [filteredRecords],
  )

  const setFilter = useCallback((key, values) => {
    setFilters((prev) => ({ ...prev, [key]: values }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_DASHBOARD_FILTERS)
  }, [])

  const activeFilters = useMemo(() => hasActiveFilters(filters), [filters])

  const getByStatus = useCallback(
    (status) =>
      filteredRecords.filter((r) => r.status?.toLowerCase() === status.toLowerCase()),
    [filteredRecords],
  )

  const getByMonth = useCallback(
    (month) => filteredRecords.filter((r) => r.month === month),
    [filteredRecords],
  )

  const getByRegion = useCallback(
    (region) => filteredRecords.filter((r) => r.accountRegion === region),
    [filteredRecords],
  )

  const getByProductType = useCallback(
    (productType) => filteredRecords.filter((r) => r.productType === productType),
    [filteredRecords],
  )

  const getByIssueType = useCallback(
    (issueType) => filteredRecords.filter((r) => getIssueTypeKey(r) === issueType),
    [filteredRecords],
  )

  const value = useMemo(
    () => ({
      records: filteredRecords,
      allRecords: records,
      filteredCount: filteredRecords.length,
      totalCount: records.length,
      isLoading,
      error,
      meta,
      parseErrors,
      summary,
      kpiMetrics,
      executiveCharts,
      casesByMonth,
      issueIntelligence,
      operationsPerformance,
      customerExperience,
      automatedInsights,
      filters,
      filterOptions,
      setFilter,
      resetFilters,
      hasActiveFilters: activeFilters,
      reload: loadData,
      getByStatus,
      getByMonth,
      getByRegion,
      getByProductType,
      getByIssueType,
    }),
    [
      filteredRecords,
      records,
      isLoading,
      error,
      meta,
      parseErrors,
      summary,
      kpiMetrics,
      executiveCharts,
      casesByMonth,
      issueIntelligence,
      operationsPerformance,
      customerExperience,
      automatedInsights,
      filters,
      filterOptions,
      setFilter,
      resetFilters,
      activeFilters,
      loadData,
      getByStatus,
      getByMonth,
      getByRegion,
      getByProductType,
      getByIssueType,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
