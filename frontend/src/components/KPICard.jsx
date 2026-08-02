import React from 'react'

/**
 * KPICard — displays a single key performance indicator.
 *
 * Props:
 *  - title      {string}  — label shown above the value
 *  - value      {string}  — pre-formatted value string (e.g. "$1,234.56")
 *  - icon       {ReactNode} — icon element rendered in the accent chip
 *  - accentClass {string} — Tailwind colour classes applied to the icon chip background
 *                           and the top border accent strip
 */
export default function KPICard({ title, value, icon, accentClass = 'bg-blue-100 text-blue-600' }) {
  return (
    <div className="relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col gap-4 p-5 hover:shadow-md transition-shadow duration-200">
      {/* Top accent strip */}
      <div className={`absolute inset-x-0 top-0 h-0.5 ${accentClass.split(' ')[0]}`} />

      {/* Header row */}
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider leading-tight">
          {title}
        </p>
        <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 ${accentClass}`}>
          {icon}
        </span>
      </div>

      {/* Value */}
      <p className="text-2xl font-bold text-slate-900 tracking-tight">
        {value}
      </p>
    </div>
  )
}
