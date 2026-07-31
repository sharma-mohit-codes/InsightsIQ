import React from 'react'

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customers</h1>
        <p className="text-sm text-slate-500 mt-1">Customer profiles, revenue breakdown, and order frequency.</p>
      </div>

      <div className="p-8 bg-white border border-slate-200 rounded-xl shadow-xs text-center py-16">
        <h2 className="text-lg font-semibold text-slate-700">Customers View</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Placeholder page for top customer metrics and segment distribution.
        </p>
      </div>
    </div>
  )
}
