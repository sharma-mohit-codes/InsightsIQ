import { useState, useEffect } from 'react'
import { analyticsApi } from '../services/api'

/**
 * Custom hook that fetches category breakdown data from the backend once on mount.
 *
 * Returns:
 *  - data    {object|array|null} — Category payload from the API, or null while loading/errored
 *  - loading {boolean}           — true while the request is in flight
 *  - error   {string|null}       — error message if the request failed, otherwise null
 */
export function useCategories() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let cancelled = false

    analyticsApi.getCategories()
      .then((json) => {
        if (!cancelled) {
          setData(json)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message ?? 'Failed to load categories')
          setLoading(false)
        }
      })

    // Cleanup: ignore the response if the component unmounts mid-request.
    return () => { cancelled = true }
  }, [])

  return { data, loading, error }
}
