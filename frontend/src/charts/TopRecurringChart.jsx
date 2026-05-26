import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartTooltip from './ChartTooltip'

export default function TopRecurringChart({
  data = [],
  activeKey = null,
  onSelect,
}) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={288}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" tickLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tick={{ fontSize: 10 }}
          stroke="#94a3b8"
          tickLine={false}
        />
        <Tooltip
          content={
            <ChartTooltip
              valueFormatter={(v, name) => {
                if (name === 'Recurrence score') return v.toLocaleString()
                if (name === 'Recurring accounts') return `${v} accounts`
                return v.toLocaleString()
              }}
            />
          }
          cursor={{ fill: 'rgba(236, 72, 153, 0.08)' }}
        />
        <Bar
          dataKey="recurrenceScore"
          name="Recurrence score"
          radius={[0, 4, 4, 0]}
          barSize={18}
          style={{ cursor: onSelect ? 'pointer' : 'default' }}
          onClick={(bar) => {
            if (!onSelect || !bar?.key) return
            onSelect({ key: bar.key, name: bar.name })
          }}
        >
          {data.map((entry) => (
            <Cell
              key={entry.key}
              fill="#ec4899"
              fillOpacity={activeKey && activeKey !== entry.key ? 0.35 : 1}
              stroke={activeKey === entry.key ? '#be185d' : 'none'}
              strokeWidth={activeKey === entry.key ? 2 : 0}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
