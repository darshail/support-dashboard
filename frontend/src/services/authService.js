import { validateEmail, validatePassword } from '../utils/validation'
import { API_BASE, parseApiErrorDetail } from './api'

const AUTH_STORAGE_KEY = 'product_pulse_auth'
const LOGIN_PATH = '/api/v1/auth/login'
const ME_PATH = '/api/v1/auth/me'

/**
 * @returns {{ token: string, user: object } | null}
 */
export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.token || !parsed?.user) return null
    return parsed
  } catch {
    return null
  }
}

/**
 * @param {string} token
 * @param {object} user
 */
export function persistAuth(token, user) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }))
  } catch {
    /* ignore */
  }
}

export function clearStoredAuth() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function getAuthToken() {
  return getStoredAuth()?.token ?? null
}

/**
 * Fetch current user from API using stored JWT.
 * @returns {Promise<object | null>}
 */
export async function fetchCurrentUser() {
  const token = getAuthToken()
  if (!token) return null

  try {
    const response = await fetch(`${API_BASE}${ME_PATH}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      clearStoredAuth()
      return null
    }

    const user = await response.json()
    persistAuth(token, user)
    return user
  } catch {
    return null
  }
}

/**
 * Authenticate via FastAPI POST /api/v1/auth/login.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ success: boolean, error?: string, token?: string, user?: object }>}
 */
export async function loginRequest(credentials) {
  const { email, password } = credentials

  const emailError = validateEmail(email)
  if (emailError) return { success: false, error: emailError }

  const passwordError = validatePassword(password)
  if (passwordError) return { success: false, error: passwordError }

  try {
    const response = await fetch(`${API_BASE}${LOGIN_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
      }),
    })

    if (!response.ok) {
      let errorMessage = 'Invalid email or password. Please try again.'
      try {
        const data = await response.json()
        const parsed = parseApiErrorDetail(data.detail)
        if (parsed) errorMessage = parsed
      } catch {
        /* ignore */
      }
      return { success: false, error: errorMessage }
    }

    const data = await response.json()
    const token = data.access_token
    const user = data.user

    if (!token || !user) {
      return { success: false, error: 'Invalid response from server.' }
    }

    persistAuth(token, user)
    return { success: true, token, user }
  } catch (error) {
    if (error instanceof TypeError) {
      return {
        success: false,
        error: 'Unable to connect to the server. Make sure the API is running on port 8000.',
      }
    }
    return { success: false, error: 'Something went wrong. Please try again later.' }
  }
}
