import { Outlet, useLocation } from 'react-router-dom'
import { DashboardFilterBar } from '../components/filters'
import { AutomatedInsightsPanel } from '../components/insights'
import { useAppContext } from '../hooks'
import { PAGE_TITLES } from '../utils/constants'
import Header from './Header'
import MainContent from './MainContent'
import Sidebar from './Sidebar'

function getPageTitle(pathname) {
  return PAGE_TITLES[pathname] ?? 'Dashboard'
}

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const { sidebarCollapsed, mobileNavOpen, setMobileNavOpen } = useAppContext()
  const title = getPageTitle(pathname)

  return (
    <div className="min-h-dvh bg-app">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      <div
        className={[
          'flex min-h-dvh min-w-0 flex-col transition-[margin-left] duration-300 ease-in-out',
          sidebarCollapsed
            ? 'lg:ml-[var(--sidebar-width-collapsed)]'
            : 'lg:ml-[var(--sidebar-width-expanded)]',
        ].join(' ')}
        style={{
          '--sidebar-width-expanded': '16.5rem',
          '--sidebar-width-collapsed': '4.5rem',
        }}
      >
        <Header title={title} />
        <DashboardFilterBar />
        <MainContent>
          <div className="dashboard-stack">
            <AutomatedInsightsPanel />
            <div key={pathname}>
              <Outlet />
            </div>
          </div>
        </MainContent>
      </div>
    </div>
  )
}
