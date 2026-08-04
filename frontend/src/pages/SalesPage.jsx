import React, { useState, useEffect } from 'react'
import { apiFetch } from '../services/api'

const fmtCurrency = (n) =>
  `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function SalesPage() {
  const [page, setPage] = useState(1)
  const [region, setRegion] = useState('All')
  const [category, setCategory] = useState('All')
  const [salesResponse, setSalesResponse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    apiFetch(
      `/sales?page=${page}&page_size=20&region=${encodeURIComponent(region)}&category=${encodeURIComponent(category)}`
    )
      .then((json) => {
        if (!cancelled) {
          setSalesResponse(json)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message ?? 'Failed to load sales transactions')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [page, region, category])

  const totalPages = salesResponse?.total_pages ?? 1
  const totalRecords = salesResponse?.total_records ?? 0
  const filteredRecords = salesResponse?.filtered_records ?? 0
  const records = salesResponse?.data ?? []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Transactions</h1>
        <p className="text-sm text-slate-500 mt-1">
          Detailed list of order records and transaction breakdown.
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-red-700">Failed to load transactions</p>
            <p className="text-xs text-red-500 mt-1 font-mono">{error}</p>
          </div>
        </div>
      )}

      {/* Filters and Record Count */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="region-filter" className="text-sm font-medium text-slate-700">
              Region:
            </label>
            <select
              id="region-filter"
              value={region}
              onChange={(e) => {
                setRegion(e.target.value)
                setPage(1)
              }}
              className="px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              <option value="All">All</option>
              <option value="Central">Central</option>
              <option value="East">East</option>
              <option value="South">South</option>
              <option value="West">West</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="category-filter" className="text-sm font-medium text-slate-700">
              Category:
            </label>
            <select
              id="category-filter"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                setPage(1)
              }}
              className="px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              <option value="All">All</option>
              <option value="Furniture">Furniture</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Technology">Technology</option>
            </select>
          </div>
        </div>

        <div className="text-sm font-medium text-slate-600">
          Showing {records.length} of {filteredRecords} records
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Sales
                </th>
                <th className="px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Profit
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3.5">
                      <div className="h-4 bg-slate-200 rounded w-24" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 bg-slate-200 rounded w-20" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 bg-slate-200 rounded w-32" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 bg-slate-200 rounded w-16" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 bg-slate-200 rounded w-20" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 bg-slate-200 rounded w-16 ml-auto" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="h-4 bg-slate-200 rounded w-16 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">
                    No transaction records found.
                  </td>
                </tr>
              ) : (
                records.map((item, idx) => (
                  <tr key={`${item.order_id}-${idx}`} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 whitespace-nowrap">
                      {item.order_id}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                      {item.order_date}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                      {item.customer_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        {item.region}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                      {item.category}
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {!loading && !error && salesResponse && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-slate-50/50">
            <div className="text-xs text-slate-500">
              Page <span className="font-semibold text-slate-700">{page}</span> of{' '}
              <span className="font-semibold text-slate-700">{totalPages}</span> ({totalRecords.toLocaleString()} total transactions)
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>

              <span className="text-xs font-medium text-slate-600 px-2">
                {page} / {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
