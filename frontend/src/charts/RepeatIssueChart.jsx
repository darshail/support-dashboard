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

export default function RepeatIssueChart({
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
          angle={-24}
          textAnchor="end"
          height={64}
          interval={0}
        />
        <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickLine={false} />
        <Tooltip
          content={
            <ChartTooltip valueFormatter={(v) => `${v.toLocaleString()} repeat cases`} />
          }
          cursor={{ fill: 'rgba(245, 158, 11, 0.08)' }}
        />
        <Bar
          dataKey="repeatCases"
          name="Repeat cases"
          radius={[4, 4, 0, 0]}
          barSize={28}
          style={{ cursor: onSelect ? 'pointer' : 'default' }}
          onClick={(bar) => {
            if (!onSelect || !bar?.key) return
            onSelect({ key: bar.key, name: bar.name })
          }}
        >
          {data.map((entry) => (
            <Cell
              key={entry.key}
              fill="#f59e0b"
              fillOpacity={activeKey && activeKey !== entry.key ? 0.35 : 1}
              stroke={activeKey === entry.key ? '#b45309' : 'none'}
              strokeWidth={activeKey === entry.key ? 2 : 0}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
