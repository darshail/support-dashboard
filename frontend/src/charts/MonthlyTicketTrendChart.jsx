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

export default function MonthlyTicketTrendChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={288}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
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
          allowDecimals={false}
        />
        <Tooltip
          content={
            <ChartTooltip valueFormatter={(v) => `${v.toLocaleString()} tickets`} />
          }
          cursor={{ stroke: '#4f46e5', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Line
          type="monotone"
          dataKey="tickets"
          name="Tickets"
          stroke="#4f46e5"
          strokeWidth={2.5}
          dot={{ r: 3, fill: '#4f46e5', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
