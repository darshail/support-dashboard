import { Link } from 'react-router-dom'

/**
 * @typedef {import('../../services/insightsService').AutomatedInsight} AutomatedInsight
 */

const SEVERITY_STYLES = {
  info: {
    border: 'border-border',
    badge: 'bg-surface-muted text-text-muted',
    icon: 'text-primary',
    accent: 'from-primary/5 to-transparent',
  },
  warning: {
    border: 'border-amber-200/90',
    badge: 'bg-amber-100 text-amber-900',
    icon: 'text-amber-600',
    accent: 'from-amber-50/80 to-transparent',
  },
  critical: {
    border: 'border-red-200/90',
    badge: 'bg-red-100 text-red-800',
    icon: 'text-red-600',
    accent: 'from-red-50/80 to-transparent',
  },
}

const CATEGORY_ICONS = {
  issue: IssueIcon,
  mttr: MttrIcon,
  region: RegionIcon,
  satisfaction: SatisfactionIcon,
  vendor: VendorIcon,
}

/**
 * @param {{ insight: AutomatedInsight, index?: number }} props
 */
export default function InsightCard({ insight, index = 0 }) {
  const styles = SEVERITY_STYLES[insight.severity]
  const Icon = CATEGORY_ICONS[insight.category] ?? IssueIcon

  const content = (
    <article
      className={[
        'card-surface animate-stagger-in relative flex h-full flex-col overflow-hidden border p-4',
        styles.border,
        insight.path ? 'hover:-translate-y-0.5' : '',
      ].join(' ')}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div
        className={['pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80', styles.accent].join(' ')}
        aria-hidden="true"
      />
      <div className="relative flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className={`rounded-lg bg-surface/80 p-2 shadow-sm backdrop-blur-sm ${styles.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
          <span
            className={[
              'shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
              styles.badge,
            ].join(' ')}
          >
            {insight.severity}
          </span>
        </div>

        <h3 className="mt-3 text-sm font-semibold text-text">{insight.title}</h3>
        <p className="mt-1.5 flex-1 text-xs leading-relaxed text-text-muted">{insight.description}</p>

        <div className="mt-4 border-t border-border/60 pt-3">
          <p className="text-[10px] font-medium uppercase tracking-wide text-text-subtle">
            {insight.metricLabel}
          </p>
          <p className="mt-0.5 text-lg font-bold tracking-tight text-text">{insight.metricValue}</p>
        </div>
      </div>
    </article>
  )

  if (insight.path) {
    return (
      <Link
        to={insight.path}
        className="block h-full rounded-xl outline-none transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.99]"
      >
        {content}
      </Link>
    )
  }

  return content
}

function IssueIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  )
}

function MttrIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function RegionIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  )
}

function SatisfactionIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
    </svg>
  )
}

function VendorIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
    </svg>
  )
}
