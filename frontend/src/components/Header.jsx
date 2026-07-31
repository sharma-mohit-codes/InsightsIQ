import React from 'react'
import { Menu, Bell, User } from 'lucide-react'

export default function Header({ onMenuClick }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Workspace</span>
          <h2 className="text-sm font-semibold text-slate-800">Sample Superstore Analytics</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          Local Environment
        </div>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-slate-800 leading-tight">Data Analyst</p>
            <p className="text-[10px] text-slate-500 leading-tight">InsightIQ Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}
