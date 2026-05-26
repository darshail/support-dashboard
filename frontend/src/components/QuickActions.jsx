import Card from './ui/Card'

const ACTIONS = [
  { label: 'Import CSV data', variant: 'outline' },
  { label: 'View open tickets', variant: 'outline' },
  { label: 'Generate report', variant: 'primary' },
]

const variantClasses = {
  outline:
    'w-full rounded-lg border border-border px-4 py-3 text-left text-sm font-medium text-text transition-all duration-200 hover:border-primary/30 hover:bg-surface-muted active:scale-[0.99]',
  primary:
    'w-full rounded-lg bg-primary px-4 py-3 text-left text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-primary-hover active:scale-[0.99]',
}

export default function QuickActions() {
  return (
    <Card title="Quick actions" description="Common tasks for support agents">
      <ul className="space-y-2.5 text-sm">
        {ACTIONS.map((action) => (
          <li key={action.label}>
            <button type="button" className={variantClasses[action.variant]}>
              {action.label}
            </button>
          </li>
        ))}
      </ul>
    </Card>
  )
}
