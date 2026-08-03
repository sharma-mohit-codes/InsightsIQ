import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { useKPIs } from '../hooks/useKPIs'
import { useMonthlyTrends } from '../hooks/useMonthlyTrends'
import KPICard from '../components/KPICard'

// ── Value formatters ────────────────────────────────────────────────────────
const fmtCurrency = (n) =>
  `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const fmtPercent = (n) =>
  `${Number(n).toFixed(2)}%`

const fmtInt = (n) =>
  Number(n).toLocaleString('en-US')

// ── KPI card definitions ────────────────────────────────────────────────────
function buildCards(data) {
  return [
    {
      id: 'total-revenue',
      title: 'Total Revenue',
      value: fmtCurrency(data.total_revenue),
      icon: '💰',
      accentClass: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'total-profit',
      title: 'Total Profit',
      value: fmtCurrency(data.total_profit),
      icon: '📈',
      accentClass: 'bg-emerald-100 text-emerald-600',
    },
    {
      id: 'total-orders',
      title: 'Total Orders',
      value: fmtInt(data.total_orders),
      icon: '🛒',
      accentClass: 'bg-violet-100 text-violet-600',
    },
    {
      id: 'avg-order-value',
      title: 'Avg Order Value',
      value: fmtCurrency(data.average_order_value),
      icon: '🧾',
      accentClass: 'bg-amber-100 text-amber-600',
    },
    {
      id: 'total-customers',
      title: 'Total Customers',
      value: fmtInt(data.total_customers),
      icon: '👥',
      accentClass: 'bg-sky-100 text-sky-600',
    },
    {
      id: 'profit-margin',
      title: 'Profit Margin',
      value: fmtPercent(data.profit_margin_pct),
      icon: '🎯',
      accentClass: 'bg-rose-100 text-rose-600',
    },
  ]
}

// ── Loading skeleton ────────────────────────────────────────────────────────
function KPISkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-28 animate-pulse"
        >
          <div className="flex justify-between mb-4">
            <div className="h-3 w-28 bg-slate-200 rounded" />
            <div className="h-9 w-9 bg-slate-100 rounded-lg" />
          </div>
          <div className="h-7 w-36 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-96 animate-pulse flex flex-col justify-between">
      <div className="h-4 w-40 bg-slate-200 rounded mb-4" />
      <div className="h-64 bg-slate-100 rounded w-full" />
    </div>
  )
}

// ── Error state ─────────────────────────────────────────────────────────────
function KPIError({ message }) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
      <span className="text-xl">⚠️</span>
      <div>
        <p className="text-sm font-semibold text-red-700">Failed to load KPIs</p>
        <p className="text-xs text-red-500 mt-1 font-mono">{message}</p>
        <p className="text-xs text-red-400 mt-1">
          Make sure the backend is running on <code className="font-mono">http://localhost:8000</code>
        </p>
      </div>
    </div>
  )
}

function ChartError({ message }) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
      <span className="text-xl">⚠️</span>
      <div>
        <p className="text-sm font-semibold text-red-700">Failed to load monthly trends</p>
        <p className="text-xs text-red-500 mt-1 font-mono">{message}</p>
      </div>
    </div>
  )
}

// ── Dashboard Page ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: kpiData, loading: kpiLoading, error: kpiError } = useKPIs()
  const { data: trendsData, loading: trendsLoading, error: trendsError } = useMonthlyTrends()

  const formattedTrends = React.useMemo(() => {
    if (!trendsData || !Array.isArray(trendsData)) return []
    return trendsData.map((item) => ({
      ...item,
      period: item.month_name
        ? `${item.month_name.slice(0, 3)} ${item.year}`
        : `${item.month}/${item.year}`,
    }))
  }, [trendsData])

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Overview of retail sales metrics and key performance indicators.
        </p>
      </div>

      {/* KPI section */}
      <section aria-label="Key Performance Indicators">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Key Performance Indicators
        </h2>

        {kpiLoading && <KPISkeleton />}

        {kpiError && <KPIError message={kpiError} />}

        {kpiData && !kpiLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {buildCards(kpiData).map((card) => (
              <KPICard
                key={card.id}
                title={card.title}
                value={card.value}
                icon={card.icon}
                accentClass={card.accentClass}
              />
            ))}
          </div>
        )}
      </section>

      {/* Monthly Trends Chart section */}
      <section aria-label="Monthly Trends">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Monthly Sales &amp; Profit Trends
        </h2>

        {trendsLoading && <ChartSkeleton />}

        {trendsError && <ChartError message={trendsError} />}

        {trendsData && !trendsLoading && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedTrends} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="period" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(val) => `$${val.toLocaleString()}`}
                  />
                  <Tooltip
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, undefined]}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '0.5rem', borderColor: '#e2e8f0' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    name="Sales"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    name="Profit"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
