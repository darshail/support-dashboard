import Card from './ui/Card'
import PageHeader from './ui/PageHeader'

export default function PagePlaceholder({ title, description, children }) {
  return (
    <div className="dashboard-section animate-page-enter">
      <PageHeader title={title} description={description} />
      <Card>
        <div className="py-8 text-center text-sm text-text-muted">{children}</div>
      </Card>
    </div>
  )
}
