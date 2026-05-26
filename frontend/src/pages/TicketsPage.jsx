import PagePlaceholder from '../components/PagePlaceholder'

export default function TicketsPage() {
  return (
    <PagePlaceholder
      title="Tickets"
      description="Track, filter, and manage support tickets."
    >
      <div className="rounded-lg border border-dashed border-border bg-surface-muted p-8 text-center text-sm text-text-muted">
        Ticket table and filters will go here.
      </div>
    </PagePlaceholder>
  )
}
