import Card from '../ui/Card'
import EmptyState from '../ui/EmptyState'

/**
 * @param {Object} props
 * @param {string} title
 * @param {string} [description]
 * @param {import('react').ReactNode} children
 * @param {string} [className]
 * @param {string} [heightClass]
 * @param {boolean} [isEmpty]
 * @param {string} [emptyTitle]
 * @param {string} [emptyDescription]
 */
export default function ChartCard({
  title,
  description,
  children,
  className = '',
  heightClass = 'h-72 min-h-[18rem] sm:min-h-72',
  isEmpty = false,
  emptyTitle = 'No chart data',
  emptyDescription = 'Not enough data in the current selection to render this chart.',
}) {
  return (
    <Card title={title} description={description} className={className}>
      <div className={`w-full min-w-0 ${heightClass}`}>
        {isEmpty ? (
          <EmptyState compact title={emptyTitle} description={emptyDescription} />
        ) : (
          children
        )}
      </div>
    </Card>
  )
}
