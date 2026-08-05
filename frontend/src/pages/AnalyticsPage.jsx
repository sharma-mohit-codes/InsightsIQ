import React, { useState, useEffect } from 'react'
import { apiFetch } from '../services/api'
import KPICard from '../components/KPICard'

const INSIGHT_CARDS = [
  {
    key: 'best_category',
    title: 'Best Category',
    icon: '🏆',
    accentClass: 'bg-blue-100 text-blue-600',
  },
  {
    key: 'lowest_profit_category',
    title: 'Lowest Profit Category',
    icon: '📉',
    accentClass: 'bg-rose-100 text-rose-600',
  },
  {
    key: 'best_region',
    title: 'Best Region',
    icon: '🌍',
    accentClass: 'bg-emerald-100 text-emerald-600',
  },
  {
    key: 'top_customer',
    title: 'Top Customer',
    icon: '👤',
    accentClass: 'bg-violet-100 text-violet-600',
  },
  {
    key: 'best_product',
    title: 'Best Selling Product',
    icon: '📦',
    accentClass: 'bg-amber-100 text-amber-600',
  },
  {
    key: 'best_sales_month',
    title: 'Best Sales Month',
    icon: '📅',
    accentClass: 'bg-sky-100 text-sky-600',
  },
]

export default function AnalyticsPage() {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    apiFetch('/insights')
      .then((json) => {
        if (!cancelled) {
          setInsights(json)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message ?? 'Failed to load insights')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Executive Business Insights
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Key business takeaways from sales performance
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
          Loading insights…
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-center justify-center py-20 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && !insights && (
        <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
          No insights available.
        </div>
      )}

      {/* Insight cards grid */}
      {!loading && !error && insights && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INSIGHT_CARDS.map(({ key, title, icon, accentClass }) => (
            <KPICard
              key={key}
              title={title}
              value={insights[key] ?? '—'}
              icon={icon}
              accentClass={accentClass}
            />
          ))}
        </div>
      )}
    </div>
  )
}
