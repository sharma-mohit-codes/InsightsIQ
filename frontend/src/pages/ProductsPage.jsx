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

const truncateLabel = (str, maxLen = 22) =>
  str && str.length > maxLen ? `${str.substring(0, maxLen)}...` : str

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm max-w-[260px] sm:max-w-xs break-words">
      <p className="font-semibold text-slate-800 mb-1 leading-snug">{d.product_name || label}</p>
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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 sm:p-6 min-w-0">
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
          <ResponsiveContainer width="100%" height={isMobile ? 380 : 420}>
            <BarChart
              data={rankings}
              layout="vertical"
              margin={
                isMobile
                  ? { top: 4, right: 12, left: 0, bottom: 4 }
                  : { top: 4, right: 40, left: 8, bottom: 4 }
              }
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis
                type="number"
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: isMobile ? 10 : 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="product_name"
                tickFormatter={(v) => truncateLabel(v, isMobile ? 12 : 22)}
                width={isMobile ? 105 : 180}
                tick={{ fontSize: isMobile ? 10 : 11, fill: '#475569' }}
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

      {/* Rankings table card */}
      {!loading && !error && rankings.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-base font-semibold text-slate-700">Product Rankings</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Sales
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Profit
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Quantity
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {rankings.map((item, idx) => (
                  <tr key={item.product_name} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-500 whitespace-nowrap">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {item.product_name}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 text-right whitespace-nowrap">
                      {fmtCurrency(item.sales)}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm font-medium text-right whitespace-nowrap ${
                        Number(item.profit) >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {fmtCurrency(item.profit)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 text-right whitespace-nowrap">
                      {Number(item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
