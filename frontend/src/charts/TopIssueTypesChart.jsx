import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartTooltip from './ChartTooltip'

export default function TopIssueTypesChart({ data = [] }) {
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
          width={110}
          tick={{ fontSize: 10 }}
          stroke="#94a3b8"
          tickLine={false}
        />
        <Tooltip
          content={<ChartTooltip valueFormatter={(v) => `${v.toLocaleString()} cases`} />}
          cursor={{ fill: 'rgba(79, 70, 229, 0.06)' }}
        />
        <Bar dataKey="count" name="Cases" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  )
}
