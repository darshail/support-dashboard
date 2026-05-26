import { NavLink } from 'react-router-dom'
import NavIcon from '../components/NavIcon'
import { useAppContext } from '../hooks'
import { APP_NAME, NAV_ITEMS, ROUTES } from '../utils/constants'

function navLinkClass({ isActive }, showCollapsed) {
  return [
    'group relative flex items-center rounded-lg text-sm font-medium transition-all duration-200',
    showCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5',
    isActive
      ? 'bg-sidebar-active text-sidebar-text-active shadow-sm'
      : 'text-sidebar-text hover:bg-white/5 hover:text-sidebar-text-active',
    isActive && !showCollapsed && 'border-l-2 border-sidebar-active-border pl-[10px]',
  ].join(' ')
}

export default function Sidebar({ collapsed, mobileOpen, onMobileClose }) {
  const { toggleSidebar } = useAppContext()

  /** On mobile drawer, always show expanded sidebar (no narrow strip). */
  const showCollapsed = collapsed && !mobileOpen

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar text-white',
          'transition-[width,transform] duration-300 ease-in-out',
          showCollapsed ? 'w-[var(--sidebar-width-collapsed)]' : 'w-[var(--sidebar-width-expanded)]',
          'max-lg:w-[var(--sidebar-width-expanded)]',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
        style={{
          '--sidebar-width-expanded': '16.5rem',
          '--sidebar-width-collapsed': '4.5rem',
        }}
        aria-label="Sidebar navigation"
      >
        <div
          className={[
            'flex h-16 shrink-0 items-center border-b border-sidebar-border',
            showCollapsed ? 'justify-center px-2' : 'gap-3 px-5',
          ].join(' ')}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
            <span className="text-sm font-bold text-white">PP</span>
          </div>
          {!showCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold tracking-tight text-white">{APP_NAME}</p>
              <p className="truncate text-[11px] text-sidebar-text">Analytics Platform</p>
            </div>
          )}
          {mobileOpen && (
            <button
              type="button"
              onClick={onMobileClose}
              className="ml-auto inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sidebar-text transition-colors hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Close navigation"
            >
              <CloseIcon />
            </button>
          )}
        </div>

        <nav
          className={[
            'scrollbar-thin flex-1 space-y-1 overflow-y-auto py-4',
            showCollapsed ? 'px-2' : 'px-3',
          ].join(' ')}
          aria-label="Main navigation"
        >
          {!showCollapsed && (
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-sidebar-text">
              Main Menu
            </p>
          )}
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ROUTES.DASHBOARD}
              className={(state) => navLinkClass(state, showCollapsed)}
              onClick={onMobileClose}
              title={showCollapsed ? item.label : undefined}
            >
              <NavIcon name={item.icon} />
              {!showCollapsed && <span>{item.label}</span>}
              {showCollapsed && (
                <span className="pointer-events-none absolute left-full z-50 ml-2 hidden whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-xs text-white shadow-lg group-hover:block">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className={['shrink-0 border-t border-sidebar-border', showCollapsed ? 'p-2' : 'p-3'].join(' ')}>
          <button
            type="button"
            onClick={toggleSidebar}
            className={[
              'hidden w-full items-center rounded-lg text-sidebar-text transition-colors hover:bg-white/5 hover:text-white lg:flex',
              showCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
            ].join(' ')}
            aria-label={showCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={showCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <CollapseIcon collapsed={showCollapsed} />
            {!showCollapsed && <span className="text-sm font-medium">Collapse</span>}
          </button>

          {!showCollapsed && (
            <div className="mt-3 rounded-lg bg-sidebar-elevated px-3 py-3">
              <p className="text-xs font-medium text-white">Pro Plan</p>
              <p className="mt-0.5 text-[11px] text-sidebar-text">Unlimited analytics exports</p>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function CollapseIcon({ collapsed }) {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      {collapsed ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      )}
    </svg>
  )
}
