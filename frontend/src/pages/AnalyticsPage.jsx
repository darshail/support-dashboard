import PagePlaceholder from '../components/PagePlaceholder'

export default function AnalyticsPage() {
  return (
    <PagePlaceholder
      title="Analytics"
      description="Deep-dive metrics, trends, and performance insights."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-40 rounded-lg border border-dashed border-border bg-surface-muted" />
        <div className="h-40 rounded-lg border border-dashed border-border bg-surface-muted" />
      </div>
    </PagePlaceholder>
  )
}
