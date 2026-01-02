'use client'

import { useState } from 'react'
import Papa from 'papaparse'

interface DataUploadProps {
  onDataReady: (rawData: Record<string, any>[]) => void
}

export function DataUpload({ onDataReady }: DataUploadProps) {
  const [loading, setLoading] = useState(false)

  const handleFileUpload = (file: File) => {
    setLoading(true)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        onDataReady(results.data)
        setLoading(false)
      },
      error: () => {
        setLoading(false)
      }
    })
  }

  return (
    <div className="p-12 border-2 border-dashed border-cyan-500/50 rounded-3xl bg-gray-900/50 hover:bg-gray-800/70 hover:border-cyan-400 transition-all backdrop-blur-sm">
      <input
        type="file"
        accept=".csv"
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
        className="hidden"
        id="upload"
      />
      <label htmlFor="upload" className="cursor-pointer block text-center">
        {loading ? (
          <div className="animate-pulse">
            <div className="text-6xl mb-4">⚡</div>
            <div className="text-cyan-400 font-bold text-2xl">Analyzing...</div>
          </div>
        ) : (
          <>
            <div className="text-7xl mb-6 filter drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">📊</div>
            <div className="text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Drop CSV Here
            </div>
            <div className="text-gray-400 text-lg">or click to browse files</div>
          </>
        )}
      </label>
    </div>
  )
}
