import { useNavigate } from 'react-router-dom'
import { useAppContext, useAuth } from '../hooks'
import { ROUTES } from '../utils/constants'

const DATE_RANGES = [
  { value: '24h', label: '24h' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
]

export default function Header({ title }) {
  const navigate = useNavigate()
  const { user, logout, roles } = useAuth()
  const {
    dateRange,
    setDateRange,
    sidebarCollapsed,
    toggleSidebar,
    mobileNavOpen,
    setMobileNavOpen,
  } = useAppContext()

  function handleLogout() {
    logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-surface/90 shadow-sm backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        {!mobileNavOpen && (
          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-text-muted transition-all duration-200 hover:bg-surface-muted hover:text-text active:scale-95 lg:hidden"
            aria-label="Open navigation"
            onClick={() => setMobileNavOpen(true)}
          >
            <MenuIcon />
          </button>
        )}

        <button
          type="button"
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-text-muted transition-all duration-200 hover:bg-surface-muted hover:text-text active:scale-95 lg:inline-flex"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={toggleSidebar}
        >
          <MenuIcon />
        </button>

        <div className="min-w-0 flex-1">
          <nav className="mb-0.5 hidden text-xs text-text-muted sm:block" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5">
              <li>Home</li>
              <li aria-hidden="true" className="text-text-subtle">
                /
              </li>
              <li className="font-medium text-text">{title}</li>
            </ol>
          </nav>
          <h1 className="truncate text-lg font-semibold tracking-tight text-text sm:text-xl">{title}</h1>
        </div>

        <div className="hidden max-w-xs flex-1 md:block lg:max-w-sm">
          <label className="relative block">
            <span className="sr-only">Search</span>
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
            <input
              type="search"
              placeholder="Search tickets, reports..."
              className="h-9 w-full rounded-lg border border-border bg-surface-muted/80 pl-9 pr-3 text-sm text-text placeholder:text-text-subtle transition-all duration-200 focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center rounded-lg border border-border bg-surface-muted/60 p-0.5 sm:flex">
            {DATE_RANGES.map((range) => (
              <button
                key={range.value}
                type="button"
                onClick={() => setDateRange(range.value)}
                className={[
                  'rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200',
                  dateRange === range.value
                    ? 'bg-surface text-text shadow-sm'
                    : 'text-text-muted hover:text-text',
                ].join(' ')}
              >
                {range.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted transition-all duration-200 hover:bg-surface-muted hover:text-text active:scale-95"
            aria-label="Notifications"
          >
            <BellIcon />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent ring-2 ring-surface" />
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted/40 py-1 pl-1 pr-2 sm:pr-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-xs font-semibold text-white shadow-sm">
              {user?.name?.charAt(0) ?? 'U'}
            </div>
            <div className="hidden min-w-0 sm:block">
              <span className="block truncate text-sm font-medium text-text">
                {user?.name ?? 'User'}
              </span>
              {roles.length > 0 && (
                <span className="block truncate text-[11px] capitalize text-text-muted">
                  {roles.join(', ')}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="hidden rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-muted transition-all duration-200 hover:bg-surface-muted hover:text-text active:scale-95 sm:inline-block"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}

function MenuIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  )
}

function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  )
}
