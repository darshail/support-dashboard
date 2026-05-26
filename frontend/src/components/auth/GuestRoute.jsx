import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks'
import { ROUTES } from '../../utils/constants'

export default function GuestRoute() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <Outlet />
}
