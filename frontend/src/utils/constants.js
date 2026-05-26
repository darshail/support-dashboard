export const APP_NAME = 'Product Pulse'

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  EXECUTIVE: '/executive',
  ISSUES: '/issues',
  OPERATIONS: '/operations',
  CUSTOMER_EXPERIENCE: '/customer-experience',
}

export const NAV_ITEMS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'dashboard' },
  { label: 'Executive', path: ROUTES.EXECUTIVE, icon: 'executive' },
  { label: 'Issue Intelligence', path: ROUTES.ISSUES, icon: 'issues' },
  { label: 'Operations Performance', path: ROUTES.OPERATIONS, icon: 'operations' },
  { label: 'Customer Experience', path: ROUTES.CUSTOMER_EXPERIENCE, icon: 'customerExperience' },
]

export const PAGE_TITLES = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.EXECUTIVE]: 'Executive Dashboard',
  [ROUTES.ISSUES]: 'Issue Intelligence',
  [ROUTES.OPERATIONS]: 'Operations Performance',
  [ROUTES.CUSTOMER_EXPERIENCE]: 'Customer Experience',
}
