import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import ChartTooltip from './ChartTooltip'

export default function SlaSummaryDonut({
  data = [],
  activeKey = null,
  onSelect,
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const breached = data.find((d) => d.key === 'breached')?.value ?? 0
  const breachRateLabel =
    total > 0 ? `${((breached / total) * 100).toFixed(1)}%` : '—'

  function handleClick(entry) {
    if (!entry?.key || !onSelect) return
    onSelect({ key: entry.key, name: entry.name })
  }

  return (
    <div className="relative h-full w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="78%"
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            onClick={(_, index) => handleClick(data[index])}
            style={{ cursor: onSelect ? 'pointer' : 'default' }}
          >
            {data.map((entry) => (
              <Cell
                key={entry.key}
                fill={entry.fill}
                stroke={activeKey === entry.key ? '#1e293b' : 'transparent'}
                strokeWidth={activeKey === entry.key ? 2 : 0}
                opacity={activeKey && activeKey !== entry.key ? 0.45 : 1}
              />
            ))}
          </Pie>
          <Tooltip
            content={
              <ChartTooltip
                valueFormatter={(v) =>
                  `${v.toLocaleString()} (${total > 0 ? ((v / total) * 100).toFixed(1) : 0}%)`
                }
              />
            }
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-text">{breachRateLabel}</span>
        <span className="text-xs text-text-muted">Breach rate</span>
      </div>
    </div>
  )
}
