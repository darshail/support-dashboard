import { useAuth } from '../../hooks'

/**
 * Renders children only when the user has the required role(s).
 * @param {{ roles: string | string[], requireAll?: boolean, fallback?: React.ReactNode, children: React.ReactNode }} props
 */
export default function RoleGuard({ roles, requireAll = false, fallback = null, children }) {
  const { hasRole, hasAnyRole, hasAllRoles } = useAuth()
  const required = Array.isArray(roles) ? roles : [roles]

  const allowed = requireAll ? hasAllRoles(required) : hasAnyRole(required)

  if (!allowed) return fallback
  return children
}
