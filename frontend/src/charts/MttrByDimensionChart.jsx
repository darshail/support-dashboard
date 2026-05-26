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

export default function MttrByDimensionChart({
  data = [],
  activeKey = null,
  onSelect,
  valueLabel = 'Avg MTTR',
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
          tick={{ fontSize: 11 }}
          stroke="#94a3b8"
          tickLine={false}
          unit="d"
        />
        <YAxis
          type="category"
          dataKey="name"
          width={130}
          tick={{ fontSize: 10 }}
          stroke="#94a3b8"
          tickLine={false}
        />
        <Tooltip
          content={
            <ChartTooltip
              valueFormatter={(v, name) => {
                if (name === 'Breach rate') return `${Number(v).toFixed(1)}%`
                return `${Number(v).toFixed(2)} days`
              }}
            />
          }
          cursor={{ fill: 'rgba(14, 165, 233, 0.08)' }}
        />
        <Bar
          dataKey="avgMttr"
          name={valueLabel}
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
              fill="#0ea5e9"
              fillOpacity={activeKey && activeKey !== entry.key ? 0.35 : 1}
              stroke={activeKey === entry.key ? '#0369a1' : 'none'}
              strokeWidth={activeKey === entry.key ? 2 : 0}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
