import Card from './ui/Card'

export default function MetricCard({ label, value, change }) {
  return (
    <Card className="!p-4 sm:!p-5">
      <p className="text-sm font-medium text-text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-text sm:text-3xl">{value}</p>
      {change && <p className="mt-1 text-xs text-primary">{change} vs last week</p>}
    </Card>
  )
}
