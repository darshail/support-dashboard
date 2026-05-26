import PagePlaceholder from '../components/PagePlaceholder'

export default function SettingsPage() {
  return (
    <PagePlaceholder
      title="Settings"
      description="Configure dashboard preferences and integrations."
    >
      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
          <span className="font-medium text-text">Email notifications</span>
          <span className="text-text-muted">Coming soon</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
          <span className="font-medium text-text">API connection</span>
          <span className="text-text-muted">Not configured</span>
        </div>
      </div>
    </PagePlaceholder>
  )
}
