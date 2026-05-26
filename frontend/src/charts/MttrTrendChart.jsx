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

export default function MttrTrendChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={288}>
      <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="mttrGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
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
          tick={{ fontSize: 11 }}
          stroke="#94a3b8"
          tickLine={false}
          axisLine={false}
          unit="d"
        />
        <Tooltip
          content={<ChartTooltip valueFormatter={(v) => `${v} days`} />}
          cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Area
          type="monotone"
          dataKey="mttr"
          name="Avg MTTR"
          stroke="#8b5cf6"
          strokeWidth={2.5}
          fill="url(#mttrGradient)"
          dot={{ r: 3, fill: '#8b5cf6', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
