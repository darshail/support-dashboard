import KpiCard from './KpiCard'

/**
 * @param {{ metrics: Array<Parameters<typeof KpiCard>[0]>, isLoading?: boolean }} props
 */
export default function KpiGrid({ metrics, isLoading = false }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {metrics.map((metric, index) => (
        <KpiCard key={metric.label} {...metric} isLoading={isLoading} index={index} />
      ))}
    </div>
  )
}
