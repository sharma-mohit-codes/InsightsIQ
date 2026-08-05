import React, { useState, useEffect } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { apiFetch } from '../services/api'

const fmtCurrency = (n) =>
  `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-slate-800 mb-1">{label}</p>
      <p className="text-indigo-600">Sales: {fmtCurrency(d.sales)}</p>
      <p className="text-emerald-600">Profit: {fmtCurrency(d.profit)}</p>
      <p className="text-slate-500">Qty: {Number(d.quantity).toLocaleString()}</p>
    </div>
  )
}

export default function ProductsPage() {
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    apiFetch('/products/rankings')
      .then((json) => {
        if (!cancelled) {
          setRankings(json)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message ?? 'Failed to load product rankings')
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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Product Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Top 10 Products by Sales</p>
      </div>

      {/* Chart card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6">
        <h2 className="text-base font-semibold text-slate-700 mb-4">Top 10 Products by Sales</h2>

        {loading && (
          <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
            Loading product data…
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center justify-center py-20 text-red-500 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && rankings.length === 0 && (
          <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
            No product data available.
          </div>
        )}

        {!loading && !error && rankings.length > 0 && (
          <ResponsiveContainer width="100%" height={420}>
            <BarChart
              data={rankings}
              layout="vertical"
              margin={{ top: 4, right: 40, left: 8, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis
                type="number"
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="product_name"
                width={200}
                tick={{ fontSize: 11, fill: '#475569' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
              <Bar
                dataKey="sales"
                fill="#6366f1"
                radius={[0, 4, 4, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
