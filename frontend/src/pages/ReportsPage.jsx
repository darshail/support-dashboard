import PagePlaceholder from '../components/PagePlaceholder'

export default function ReportsPage() {
  return (
    <PagePlaceholder
      title="Reports"
      description="Generate and export support performance reports."
    >
      <ul className="space-y-2 text-sm text-text-muted">
        <li>Weekly summary report</li>
        <li>Agent performance report</li>
        <li>CSAT trend report</li>
      </ul>
    </PagePlaceholder>
  )
}
