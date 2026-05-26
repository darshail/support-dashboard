import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  clearStoredAuth,
  fetchCurrentUser,
  getStoredAuth,
  loginRequest,
} from '../services/authService'
import { hasAllRoles, hasAnyRole, hasRole } from '../utils/roles'
import { AuthContext } from './AuthContext'

export default function AuthProvider({ children }) {
  const stored = getStoredAuth()
  const [token, setToken] = useState(stored?.token ?? null)
  const [user, setUser] = useState(stored?.user ?? null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(Boolean(stored?.token))

  const isAuthenticated = Boolean(token && user)
  const roles = user?.roles ?? []

  useEffect(() => {
    if (!stored?.token) {
      setIsInitializing(false)
      return
    }

    fetchCurrentUser().then((freshUser) => {
      if (freshUser) {
        setUser(freshUser)
        setToken(getStoredAuth()?.token ?? stored.token)
      } else {
        setToken(null)
        setUser(null)
      }
      setIsInitializing(false)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- run once on mount

  const login = useCallback(async (credentials) => {
    setIsLoading(true)
    try {
      const result = await loginRequest(credentials)
      if (result.success) {
        setToken(result.token)
        setUser(result.user)
      }
      return result
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    clearStoredAuth()
    setToken(null)
    setUser(null)
  }, [])

  const checkRole = useCallback((role) => hasRole(roles, role), [roles])

  const checkAnyRole = useCallback(
    (requiredRoles) => hasAnyRole(roles, requiredRoles),
    [roles],
  )

  const checkAllRoles = useCallback(
    (requiredRoles) => hasAllRoles(roles, requiredRoles),
    [roles],
  )

  const value = useMemo(
    () => ({
      user,
      token,
      roles,
      isAuthenticated,
      isLoading,
      isInitializing,
      login,
      logout,
      hasRole: checkRole,
      hasAnyRole: checkAnyRole,
      hasAllRoles: checkAllRoles,
    }),
    [
      user,
      token,
      roles,
      isAuthenticated,
      isLoading,
      isInitializing,
      login,
      logout,
      checkRole,
      checkAnyRole,
      checkAllRoles,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
