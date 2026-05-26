import IssueCasesTable from './IssueCasesTable'

/**
 * @param {Object} props
 * @param {{ dimension: string, label: string } | null} selection
 * @param {import('../../data/types').SupportCase[]} cases
 * @param {() => void} onClose
 * @param {() => void} [onApplyFilter]
 */
export default function DrillDownPanel({ selection, cases, onClose, onApplyFilter }) {
  if (!selection) return null

  const avgMttr =
    cases.length > 0
      ? cases
          .map((c) => c.mttr)
          .filter((v) => v !== null)
          .reduce((sum, v, _, arr) => sum + v / arr.length, 0)
      : null

  return (
    <section
      className="card-surface animate-fade-in-up border-primary/20 p-5 ring-2 ring-primary/10 sm:p-6"
      aria-label="Drill-down details"
    >
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Drill-down</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-text sm:text-xl">
            {selection.label}
          </h3>
          <p className="mt-1.5 text-sm text-text-muted">
            {cases.length.toLocaleString()} cases
            {avgMttr !== null && !Number.isNaN(avgMttr) && (
              <>
                {' '}
                · avg MTTR {avgMttr.toFixed(1)}d
              </>
            )}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {onApplyFilter && (
            <button
              type="button"
              onClick={onApplyFilter}
              className="rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-primary-hover active:scale-[0.98]"
            >
              Apply to filters
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-text-muted transition-all duration-200 hover:bg-surface-muted hover:text-text active:scale-[0.98]"
          >
            Clear
          </button>
        </div>
      </div>

      {cases.length === 0 ? (
        <p className="py-10 text-center text-sm text-text-muted">No cases match this selection.</p>
      ) : (
        <IssueCasesTable cases={cases} />
      )}
    </section>
  )
}
