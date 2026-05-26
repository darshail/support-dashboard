/**
 * @param {Object} props
 * @param {Array<{
 *   caseNumber: string
 *   accountName: string
 *   accountKey: string
 *   customerRating: number | null
 *   customerFeedback: string | null
 *   issueLabel: string
 *   issueKey: string
 *   productType: string | null
 *   accountRegion: string | null
 *   month: string | null
 *   status: string | null
 * }>} rows
 * @param {(row: object) => void} [onRowClick]
 * @param {string | null} [activeAccountKey]
 */
export default function NegativeFeedbackTable({ rows, onRowClick, activeAccountKey }) {
  if (!rows.length) {
    return null
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-muted text-xs font-medium uppercase tracking-wide text-text-muted">
            <th className="px-3 py-2.5">Case</th>
            <th className="px-3 py-2.5">Account</th>
            <th className="px-3 py-2.5">Rating</th>
            <th className="px-3 py-2.5">Issue</th>
            <th className="px-3 py-2.5">Region</th>
            <th className="px-3 py-2.5">Feedback</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.caseNumber}
              onClick={() => onRowClick?.(row)}
              className={[
                'border-b border-border/60 last:border-0',
                onRowClick ? 'cursor-pointer hover:bg-surface-muted/80' : '',
                activeAccountKey === row.accountKey ? 'bg-primary/5' : '',
              ].join(' ')}
            >
              <td className="px-3 py-2 font-medium text-text">{row.caseNumber}</td>
              <td className="max-w-[10rem] truncate px-3 py-2 text-text-muted">
                {row.accountName}
              </td>
              <td className="px-3 py-2">
                <RatingBadge rating={row.customerRating} />
              </td>
              <td className="max-w-[8rem] truncate px-3 py-2 text-text-muted">
                {row.issueLabel}
              </td>
              <td className="px-3 py-2 text-text-muted">{row.accountRegion ?? '—'}</td>
              <td className="max-w-xs truncate px-3 py-2 text-text-muted">
                {row.customerFeedback?.trim() || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * @param {{ rating: number | null }} props
 */
function RatingBadge({ rating }) {
  if (rating === null) {
    return <span className="text-text-subtle">—</span>
  }

  const tone =
    rating <= 2 ? 'bg-red-100 text-red-800' : rating <= 3 ? 'bg-amber-100 text-amber-900' : 'bg-surface-muted text-text'

  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${tone}`}>
      {rating} / 5
    </span>
  )
}
