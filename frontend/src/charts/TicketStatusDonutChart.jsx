import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import ChartTooltip from './ChartTooltip'

const DEFAULT_COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

export default function TicketStatusDonutChart({ data = [] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

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
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={entry.fill ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
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
        <span className="text-xs text-text-muted">Total</span>
      </div>
    </div>
  )
}
