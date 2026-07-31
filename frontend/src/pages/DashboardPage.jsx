import React from 'react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of retail sales metrics and key performance indicators.</p>
      </div>

      <div className="p-8 bg-white border border-slate-200 rounded-xl shadow-xs text-center py-16">
        <h2 className="text-lg font-semibold text-slate-700">Dashboard View</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Placeholder page for overview metrics and performance summary cards.
        </p>
      </div>
    </div>
  )
}
