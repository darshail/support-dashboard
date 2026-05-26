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

function ratingColor(avgRating) {
  if (avgRating >= 4) return '#10b981'
  if (avgRating >= 3) return '#f59e0b'
  return '#ef4444'
}

export default function RatingByIssueChart({
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
        <XAxis
          type="number"
          domain={[1, 5]}
          tick={{ fontSize: 11 }}
          stroke="#94a3b8"
          tickLine={false}
        />
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
                if (name === 'Responses') return v.toLocaleString()
                return `${Number(v).toFixed(2)} / 5`
              }}
            />
          }
          cursor={{ fill: 'rgba(79, 70, 229, 0.06)' }}
        />
        <Bar
          dataKey="avgRating"
          name="Avg rating"
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
              fill={ratingColor(entry.avgRating)}
              fillOpacity={activeKey && activeKey !== entry.key ? 0.35 : 1}
              stroke={activeKey === entry.key ? '#1e293b' : 'none'}
              strokeWidth={activeKey === entry.key ? 2 : 0}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
