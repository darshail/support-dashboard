import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartTooltip from './ChartTooltip'

/**
 * @param {Object} props
 * @param {{ rows: object[], issueSeries: { key: string, name: string, fill: string }[] }} data
 * @param {{ productKey: string, issueKey?: string } | null} activeSelection
 * @param {(payload: { productKey: string, issueKey?: string, label: string }) => void} [onSelect]
 */
export default function IssueProductChart({ data = { rows: [], issueSeries: [] }, activeSelection, onSelect }) {
  const { rows = [], issueSeries = [] } = data

  function handleBarClick(bar, issueKey) {
    if (!onSelect || !bar?.productKey) return
    const issueName = issueSeries.find((s) => s.key === issueKey)?.name ?? issueLabel(issueKey)
    onSelect({
      productKey: bar.productKey,
      issueKey,
      label: `${bar.product} · ${issueName}`,
    })
  }

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320}>
      <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="product"
          tick={{ fontSize: 10 }}
          stroke="#94a3b8"
          tickLine={false}
          angle={-28}
          textAnchor="end"
          height={72}
          interval={0}
        />
        <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickLine={false} />
        <Tooltip
          content={<ChartTooltip valueFormatter={(v) => `${v.toLocaleString()} cases`} />}
          cursor={{ fill: 'rgba(79, 70, 229, 0.06)' }}
        />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
        {issueSeries.map((series) => (
          <Bar
            key={series.key}
            dataKey={series.key}
            name={series.name}
            stackId="issues"
            fill={series.fill}
            style={{ cursor: onSelect ? 'pointer' : 'default' }}
            fillOpacity={getSegmentOpacity(activeSelection, series.key)}
            onClick={(bar) => handleBarClick(bar, series.key)}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

function issueLabel(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * @param {{ productKey?: string, issueKey?: string } | null} activeSelection
 * @param {string} issueKey
 */
function getSegmentOpacity(activeSelection, issueKey) {
  if (!activeSelection) return 1
  if (activeSelection.issueKey && activeSelection.issueKey !== issueKey) return 0.35
  return 1
}
