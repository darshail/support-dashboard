import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { TICKET_VOLUME_DATA } from '../data'

export default function TicketVolumeChart({ data = TICKET_VOLUME_DATA }) {
  return (
    <div className="h-64 min-h-64 w-full min-w-0 sm:h-72">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={256}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <Tooltip />
          <Bar dataKey="tickets" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
