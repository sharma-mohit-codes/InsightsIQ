import { useState, useEffect } from 'react'
import { analyticsApi } from '../services/api'

/**
 * Custom hook that fetches regional breakdown data from the backend once on mount.
 *
 * Returns:
 *  - data    {object|array|null} — Region payload from the API, or null while loading/errored
 *  - loading {boolean}           — true while the request is in flight
 *  - error   {string|null}       — error message if the request failed, otherwise null
 */
export function useRegions() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let cancelled = false

    analyticsApi.getRegions()
      .then((json) => {
        if (!cancelled) {
          setData(json)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message ?? 'Failed to load regions')
          setLoading(false)
        }
      })

    // Cleanup: ignore the response if the component unmounts mid-request.
    return () => { cancelled = true }
  }, [])

  return { data, loading, error }
}
