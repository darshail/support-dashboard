export const ROLES = {
  ADMIN: 'admin',
  ANALYST: 'analyst',
  VIEWER: 'viewer',
}

/** @param {string[] | undefined} userRoles */
export function hasRole(userRoles, role) {
  return Array.isArray(userRoles) && userRoles.includes(role)
}

/** @param {string[] | undefined} userRoles */
export function hasAnyRole(userRoles, roles) {
  return roles.some((role) => hasRole(userRoles, role))
}

/** @param {string[] | undefined} userRoles */
export function hasAllRoles(userRoles, roles) {
  return roles.every((role) => hasRole(userRoles, role))
}
