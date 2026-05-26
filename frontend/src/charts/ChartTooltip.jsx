/**
 * Shared Recharts tooltip with enterprise styling.
 * @param {{ active?: boolean, payload?: Array<{ name: string, value: number, color: string }>, label?: string, valueFormatter?: (v: number) => string }} props
 */
export default function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter = (v) => v.toLocaleString(),
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2.5 shadow-lg ring-1 ring-black/5">
      {label && <p className="mb-1.5 text-xs font-semibold text-text">{label}</p>}
      <ul className="space-y-1">
        {payload.map((entry) => (
          <li key={entry.name} className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-text-muted">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}
            </span>
            <span className="font-semibold text-text">{valueFormatter(entry.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
