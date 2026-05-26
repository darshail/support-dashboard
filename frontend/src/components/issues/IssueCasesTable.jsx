import { formatIssueTypeLabel } from '../../utils/dashboardFilters'
import { formatKpiDays } from '../../utils/kpiFormatters'

/**
 * @param {Object} props
 * @param {import('../../data/types').SupportCase[]} cases
 * @param {number} [limit=25]
 */
export default function IssueCasesTable({ cases, limit = 25 }) {
  const rows = cases.slice(0, limit)

  if (!rows.length) {
    return (
      <p className="py-10 text-center text-sm text-text-muted">No cases match this selection.</p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface-muted/30">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-muted/80 text-xs font-medium uppercase tracking-wide text-text-muted">
            <th className="px-3 py-2.5">Case</th>
            <th className="px-3 py-2.5">Status</th>
            <th className="px-3 py-2.5">Issue</th>
            <th className="px-3 py-2.5">Product</th>
            <th className="px-3 py-2.5">Region</th>
            <th className="px-3 py-2.5">Month</th>
            <th className="px-3 py-2.5 text-right">MTTR</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((record) => (
            <tr
              key={record.caseNumber}
              className="border-b border-border/60 last:border-0 transition-colors duration-150 hover:bg-surface-muted"
            >
              <td className="px-3 py-2 font-medium text-text">{record.caseNumber}</td>
              <td className="px-3 py-2 text-text-muted">{record.status ?? '—'}</td>
              <td className="max-w-[10rem] truncate px-3 py-2 text-text-muted">
                {formatIssueTypeLabel(
                  record.issueBucket ?? record.typeOfIssues ?? 'unknown',
                )}
              </td>
              <td className="max-w-[8rem] truncate px-3 py-2 text-text-muted">
                {record.productType ?? '—'}
              </td>
              <td className="px-3 py-2 text-text-muted">{record.accountRegion ?? '—'}</td>
              <td className="px-3 py-2 text-text-muted">{record.month ?? '—'}</td>
              <td className="px-3 py-2 text-right font-medium text-text">
                {formatKpiDays(record.mttr)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {cases.length > limit && (
        <p className="border-t border-border bg-surface-muted px-3 py-2 text-xs text-text-muted">
          Showing {limit} of {cases.length.toLocaleString()} cases
        </p>
      )}
    </div>
  )
}
