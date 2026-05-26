import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartTooltip from './ChartTooltip'

export default function AgentPerformanceChart({
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
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 11 }}
          stroke="#94a3b8"
          tickLine={false}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 11 }}
          stroke="#94a3b8"
          tickLine={false}
          unit="%"
        />
        <Tooltip
          content={
            <ChartTooltip
              valueFormatter={(v, name) => {
                if (name === 'Cases') return v.toLocaleString()
                if (name === 'Avg MTTR') return `${Number(v).toFixed(2)} days`
                if (name === 'Avg rating') return `${Number(v).toFixed(2)} / 5`
                return `${Number(v).toFixed(1)}%`
              }}
            />
          }
          cursor={{ fill: 'rgba(79, 70, 229, 0.06)' }}
        />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
        <Bar
          yAxisId="left"
          dataKey="cases"
          name="Cases"
          fill="#4f46e5"
          radius={[4, 4, 0, 0]}
          barSize={32}
          style={{ cursor: onSelect ? 'pointer' : 'default' }}
          onClick={(bar) => {
            if (!onSelect || !bar?.key) return
            onSelect({ key: bar.key, name: bar.name })
          }}
        >
          {data.map((entry) => (
            <Cell
              key={entry.key}
              fill={entry.fill}
              fillOpacity={activeKey && activeKey !== entry.key ? 0.35 : 1}
            />
          ))}
        </Bar>
        <Bar
          yAxisId="right"
          dataKey="breachRate"
          name="SLA breach rate"
          fill="#ef4444"
          radius={[4, 4, 0, 0]}
          barSize={32}
          style={{ cursor: onSelect ? 'pointer' : 'default' }}
          onClick={(bar) => {
            if (!onSelect || !bar?.key) return
            onSelect({ key: bar.key, name: bar.name })
          }}
        />
        <Bar
          yAxisId="right"
          dataKey="closureRate"
          name="Closure rate"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
          barSize={32}
          style={{ cursor: onSelect ? 'pointer' : 'default' }}
          onClick={(bar) => {
            if (!onSelect || !bar?.key) return
            onSelect({ key: bar.key, name: bar.name })
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
