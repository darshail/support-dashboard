import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartTooltip from './ChartTooltip'

export default function SatisfactionTrendChart({
  data = [],
  activeKey = null,
  onSelect,
}) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={288}>
      <AreaChart
        data={data}
        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
        onClick={(state) => {
          if (!onSelect || !state?.activePayload?.[0]?.payload) return
          const row = state.activePayload[0].payload
          onSelect({ key: row.key, name: row.month })
        }}
        style={{ cursor: onSelect ? 'pointer' : 'default' }}
      >
        <defs>
          <linearGradient id="satisfactionGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11 }}
          stroke="#94a3b8"
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11 }}
          stroke="#94a3b8"
          tickLine={false}
          axisLine={false}
          unit="%"
        />
        <Tooltip
          content={
            <ChartTooltip
              valueFormatter={(v, name) => {
                if (name === 'Satisfaction rate') return `${Number(v).toFixed(1)}%`
                if (name === 'Responses') return v.toLocaleString()
                return `${Number(v).toFixed(2)} / 5`
              }}
            />
          }
          cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Area
          type="monotone"
          dataKey="satisfactionRate"
          name="Satisfaction rate"
          stroke="#10b981"
          strokeWidth={2.5}
          fill="url(#satisfactionGradient)"
          dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
          opacity={activeKey ? 0.85 : 1}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
