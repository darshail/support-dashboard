import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartTooltip from './ChartTooltip'

export default function TicketAgingChart({
  data = [],
  activeKey = null,
  onSelect,
}) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={288}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10 }}
          stroke="#94a3b8"
          tickLine={false}
        />
        <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickLine={false} />
        <Tooltip
          content={<ChartTooltip valueFormatter={(v) => `${v.toLocaleString()} tickets`} />}
          cursor={{ fill: 'rgba(16, 185, 129, 0.08)' }}
        />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
        <Bar
          dataKey="open"
          name="Open"
          stackId="aging"
          fill="#f59e0b"
          radius={[0, 0, 0, 0]}
          style={{ cursor: onSelect ? 'pointer' : 'default' }}
          fillOpacity={activeKey ? 0.85 : 1}
          onClick={(bar) => {
            if (!onSelect || !bar?.key) return
            onSelect({ key: bar.key, name: `${bar.name} (all)` })
          }}
        />
        <Bar
          dataKey="closed"
          name="Closed"
          stackId="aging"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
          style={{ cursor: onSelect ? 'pointer' : 'default' }}
          fillOpacity={activeKey ? 0.85 : 1}
          onClick={(bar) => {
            if (!onSelect || !bar?.key) return
            onSelect({ key: bar.key, name: `${bar.name} (all)` })
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
