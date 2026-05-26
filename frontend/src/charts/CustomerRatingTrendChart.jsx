import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartTooltip from './ChartTooltip'

export default function CustomerRatingTrendChart({
  data = [],
  activeKey = null,
  onSelect,
}) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={288}>
      <LineChart
        data={data}
        margin={{ top: 8, right: 48, left: 0, bottom: 0 }}
        onClick={(state) => {
          if (!onSelect || !state?.activePayload?.[0]?.payload) return
          const row = state.activePayload[0].payload
          onSelect({ key: row.key, name: row.month })
        }}
        style={{ cursor: onSelect ? 'pointer' : 'default' }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11 }}
          stroke="#94a3b8"
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          yAxisId="rating"
          domain={[1, 5]}
          tick={{ fontSize: 11 }}
          stroke="#94a3b8"
          tickLine={false}
          axisLine={false}
          tickCount={5}
        />
        <YAxis
          yAxisId="count"
          orientation="right"
          tick={{ fontSize: 11 }}
          stroke="#94a3b8"
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          content={
            <ChartTooltip
              valueFormatter={(v, name) => {
                if (name === 'Responses') return v.toLocaleString()
                if (name === 'Avg rating') return `${Number(v).toFixed(2)} / 5`
                return String(v)
              }}
            />
          }
          cursor={{ stroke: '#4f46e5', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Line
          yAxisId="rating"
          type="monotone"
          dataKey="avgRating"
          name="Avg rating"
          stroke="#4f46e5"
          strokeWidth={2.5}
          dot={{ r: 3, fill: '#4f46e5', strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
          opacity={activeKey ? 0.85 : 1}
        />
        <Line
          yAxisId="count"
          type="monotone"
          dataKey="count"
          name="Responses"
          stroke="#0ea5e9"
          strokeWidth={2}
          strokeDasharray="6 4"
          dot={{ r: 2, fill: '#0ea5e9', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
