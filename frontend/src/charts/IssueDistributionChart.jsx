import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import ChartTooltip from './ChartTooltip'

export default function IssueDistributionChart({
  data = [],
  activeKey = null,
  onSelect,
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  function handleClick(entry) {
    if (!entry?.key || !onSelect) return
    onSelect({ key: entry.key, name: entry.name })
  }

  return (
    <div className="relative h-full w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={288}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="58%"
            outerRadius="82%"
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
        <span className="text-2xl font-bold text-text">{total.toLocaleString()}</span>
        <span className="text-xs text-text-muted">Cases</span>
      </div>
    </div>
  )
}
