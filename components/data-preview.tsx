'use client'

import { Dataset } from '@/lib/data-processing/pipeline'

export function DataPreview({ dataset }: { dataset: Dataset }) {
  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        📊 Data Analysis
      </h2>
      
      {/* Stats Cards - Neon Glow */}
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl shadow-xl border border-cyan-500/30">
          <div className="text-5xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            {dataset.stats.rows}
          </div>
          <div className="text-cyan-200 mt-2">Rows</div>
        </div>
        <div className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl shadow-xl border border-green-500/30">
          <div className="text-5xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
            {dataset.stats.columns}
          </div>
          <div className="text-green-200 mt-2">Columns</div>
        </div>
        <div className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-500/30">
          <div className="text-xl font-bold text-purple-300 truncate">
            {dataset.numericColumns.slice(0, 2).join(', ')}
          </div>
          <div className="text-purple-200 text-sm mt-2">Top Columns</div>
        </div>
      </div>

      {/* Columns List - Dark with Neon */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-2xl border border-cyan-500/20 backdrop-blur-sm">
        <h3 className="font-bold mb-4 text-2xl text-cyan-400">
          🔢 Numeric Columns ({dataset.numericColumns.length})
        </h3>
        <div className="flex flex-wrap gap-3">
          {dataset.numericColumns.map(col => (
            <span 
              key={col} 
              className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 border border-cyan-500/40 rounded-xl text-sm font-semibold text-cyan-300 shadow-lg hover:shadow-cyan-500/50 hover:border-cyan-400 transition-all"
            >
              {col}
            </span>
          ))}
        </div>
      </div>

      {/* Table - Dark Theme */}
      <div className="bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600">
          <h3 className="font-bold text-xl text-white">📋 Sample Data (First 5 Rows)</h3>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 sticky top-0">
              <tr className="border-b border-gray-700">
                {dataset.numericColumns.map(col => (
                  <th key={col} className="px-4 py-3 text-left font-bold text-cyan-400 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataset.stats.sample.map((row, i) => (
                <tr 
                  key={i} 
                  className={`border-b border-gray-800 ${i % 2 === 0 ? 'bg-gray-900/50' : 'bg-gray-800/30'} hover:bg-cyan-900/20 transition-colors`}
                >
                  {dataset.numericColumns.map(col => (
                    <td key={col} className="px-4 py-3 whitespace-nowrap font-mono text-gray-300 font-medium">
                      {isNaN(row[col]) ? '—' : row[col].toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
