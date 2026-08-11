import React, { useState } from 'react'
import { Download, FileSpreadsheet, Loader2, AlertCircle } from 'lucide-react'
import { BASE_URL } from '../services/api'
export default function ReportsPage() {
  // ── Unfiltered Complete Dataset State ─────────────────────────────────────
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState(null)

  // ── Filtered Report State ─────────────────────────────────────────────────
  const [region, setRegion] = useState('All')
  const [category, setCategory] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [preparing, setPreparing] = useState(false)
  const [reportReady, setReportReady] = useState(false)
  const [filteredDownloading, setFilteredDownloading] = useState(false)
  const [filteredError, setFilteredError] = useState(null)

  // Invalidate prepared report whenever any filter value changes
  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value)
    setReportReady(false)
    setFilteredError(null)
  }

  const buildExportQuery = () => {
    const params = []
    if (region && region !== 'All') params.push(`region=${encodeURIComponent(region)}`)
    if (category && category !== 'All') params.push(`category=${encodeURIComponent(category)}`)
    if (dateFrom) params.push(`date_from=${encodeURIComponent(dateFrom)}`)
    if (dateTo) params.push(`date_to=${encodeURIComponent(dateTo)}`)
    return params.length ? `?${params.join('&')}` : ''
  }

  // ── Handlers for Complete Dataset ──────────────────────────────────────────
  const handleDownload = async () => {
    setDownloading(true)
    setError(null)

    try {
      const response = await fetch(`${BASE_URL}/reports/export`)

      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}: ${response.statusText}`)
      }

      const disposition =
        response.headers.get('content-disposition') ||
        response.headers.get('Content-Disposition')
      let filename = 'insightiq_sales_report.csv'
      if (disposition && disposition.includes('filename=')) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition)
        if (matches && matches[1]) {
          filename = matches[1].replace(/['"]/g, '')
        }
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (err) {
      console.error('Failed to download report:', err)
      setError(err.message || 'Failed to download report. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  // ── Handlers for Filtered Dataset ──────────────────────────────────────────
  const handleCreateReport = async () => {
    setPreparing(true)
    setFilteredError(null)
    setReportReady(false)

    try {
      const query = buildExportQuery()
      const response = await fetch(`${BASE_URL}/reports/export${query}`)

      if (!response.ok) {
        throw new Error(`Report preparation failed with status ${response.status}: ${response.statusText}`)
      }

      // Discard the body so the browser can release the connection immediately.
      await response.body?.cancel()

      setReportReady(true)
    } catch (err) {
      console.error('Failed to create report:', err)
      setFilteredError(err.message || 'Failed to prepare filtered report. Please try again.')
    } finally {
      setPreparing(false)
    }
  }

  const handleDownloadFiltered = async () => {
    setFilteredDownloading(true)
    setFilteredError(null)

    try {
      const query = buildExportQuery()
      const response = await fetch(`${BASE_URL}/reports/export${query}`)

      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}: ${response.statusText}`)
      }

      const disposition =
        response.headers.get('content-disposition') ||
        response.headers.get('Content-Disposition')
      let filename = 'insightiq_filtered_report.csv'
      if (disposition && disposition.includes('filename=')) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition)
        if (matches && matches[1]) {
          filename = matches[1].replace(/['"]/g, '')
        }
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (err) {
      console.error('Failed to download filtered report:', err)
      setFilteredError(err.message || 'Failed to download report. Please try again.')
    } finally {
      setFilteredDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports</h1>
        <p className="text-sm text-slate-500 mt-1">
          Export your sales data for further analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Card 1: Complete Sales Dataset Report */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg flex-shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <h2 className="text-base font-semibold text-slate-900">Complete Sales Data Report</h2>
              <p className="text-sm text-slate-500">
                Download the complete, unfiltered sales dataset as a CSV file.
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium text-sm rounded-lg shadow-xs transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Complete CSV</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card 2: Custom Filtered Sales Report */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <h2 className="text-base font-semibold text-slate-900">Custom Filtered Sales Report</h2>
              <p className="text-sm text-slate-500">
                Filter sales records by region, category, and date range before exporting.
              </p>
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label htmlFor="report-region" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Region
              </label>
              <select
                id="report-region"
                value={region}
                onChange={handleFilterChange(setRegion)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              >
                <option value="All">All Regions</option>
                <option value="Central">Central</option>
                <option value="East">East</option>
                <option value="South">South</option>
                <option value="West">West</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="report-category" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Category
              </label>
              <select
                id="report-category"
                value={category}
                onChange={handleFilterChange(setCategory)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              >
                <option value="All">All Categories</option>
                <option value="Furniture">Furniture</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Technology">Technology</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="report-date-from" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                From Date
              </label>
              <input
                id="report-date-from"
                type="date"
                value={dateFrom}
                onChange={handleFilterChange(setDateFrom)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="report-date-to" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                To Date
              </label>
              <input
                id="report-date-to"
                type="date"
                value={dateTo}
                onChange={handleFilterChange(setDateTo)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>
          </div>

          {filteredError && (
            <div className="flex items-center space-x-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{filteredError}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCreateReport}
              disabled={preparing}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-medium text-sm rounded-lg shadow-xs transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed"
            >
              {preparing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing Report...</span>
                </>
              ) : (
                <span>Create Report</span>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadFiltered}
              disabled={!reportReady || filteredDownloading}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium text-sm rounded-lg shadow-xs transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed"
            >
              {filteredDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Filtered CSV</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
