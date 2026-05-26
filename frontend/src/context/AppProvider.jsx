import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppContext } from './AppContext'

const SIDEBAR_STORAGE_KEY = 'product-pulse-sidebar-collapsed'

export default function AppProvider({ children }) {
  const [dateRange, setDateRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarCollapsed))
    } catch {
      /* ignore */
    }
  }, [sidebarCollapsed])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev)
  }, [])

  const value = useMemo(
    () => ({
      dateRange,
      setDateRange,
      isLoading,
      setIsLoading,
      sidebarCollapsed,
      setSidebarCollapsed,
      toggleSidebar,
      mobileNavOpen,
      setMobileNavOpen,
    }),
    [dateRange, isLoading, sidebarCollapsed, toggleSidebar, mobileNavOpen],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
