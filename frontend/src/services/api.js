/**
 * Centralized API client using the native fetch() API.
 * All backend requests should originate from this module so that
 * the base URL is configured in exactly one place.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

/**
 * GET request helper.
 * Throws an Error with a descriptive message on non-2xx responses.
 *
 * @param {string} path - API path, e.g. '/analytics/kpis'
 * @returns {Promise<any>} Parsed JSON body
 */
export async function apiFetch(path) {
  const response = await fetch(`${BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

export const analyticsApi = {
  getKPIs: () => apiFetch('/analytics/kpis'),
  getTrends: () => apiFetch('/analytics/trends'),
  getCategories: () => apiFetch('/analytics/categories'),
  getRegions: () => apiFetch('/analytics/regions'),
}
