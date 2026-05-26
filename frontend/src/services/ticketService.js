import { apiFetch } from './api'

/** @returns {Promise<object[]>} */
export async function fetchTickets() {
  // Placeholder — wire to backend when ready
  return apiFetch('/tickets').catch(() => [])
}

/** @returns {Promise<object>} */
export async function fetchTicketStats() {
  return apiFetch('/tickets/stats').catch(() => ({}))
}
