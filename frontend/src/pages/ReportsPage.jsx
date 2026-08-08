import React, { useState } from 'react'
import { Download, FileSpreadsheet, Loader2, AlertCircle } from 'lucide-react'

export default function ReportsPage() {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState(null)

  const handleDownload = async () => {
    setDownloading(true)
    setError(null)

    try {
      const BASE_URL = 'http://localhost:8000'
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

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports</h1>
        <p className="text-sm text-slate-500 mt-1">
          Export your sales data for further analysis.
        </p>
      </div>

      <div className="max-w-xl bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg flex-shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <h2 className="text-base font-semibold text-slate-900">Sales Data Report</h2>
            <p className="text-sm text-slate-500">
              Download the complete sales dataset as a CSV file.
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
                <span>Download CSV Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
