import { getAuthToken } from './authService'

export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

/**
 * Parse FastAPI error detail into a readable message.
 * @param {unknown} detail
 */
export function parseApiErrorDetail(detail) {
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg
  return null
}

/**
 * Base fetch wrapper for API calls.
 * @param {string} path
 * @param {RequestInit} [options]
 */
export async function apiFetch(path, options = {}) {
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const data = await response.json()
      const parsed = parseApiErrorDetail(data.detail)
      if (parsed) message = parsed
    } catch {
      /* ignore */
    }
    const error = new Error(message)
    error.status = response.status
    throw error
  }

  return response.json()
}
