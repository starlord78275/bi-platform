'use client'

import { useState } from 'react'
import { Dataset } from '@/lib/data-processing/pipeline'

interface DataInspectorProps {
  dataset: Dataset
}

export function DataInspector({ dataset }: DataInspectorProps) {
  const [viewMode, setViewMode] = useState<'table' | 'info' | 'stats'>('table')
  const [rowsToShow, setRowsToShow] = useState(10)

  return (
    <div className="space-y-6">
      {/* Power BI Style Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          📊 Data Inspector
        </h2>
        
        {/* View Mode Tabs (Like Power BI) */}
        <div className="flex bg-gray-800/80 rounded-xl p-1 border border-gray-700">
          {[
            { id: 'table', label: 'Data View', icon: '📋' },
            { id: 'info', label: 'Column Info', icon: 'ℹ️' },
            { id: 'stats', label: 'Statistics', icon: '📈' }
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setViewMode(id as any)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                viewMode === id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-2">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE VIEW (df.head) */}
      {viewMode === 'table' && (
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl border border-cyan-500/20 overflow-hidden shadow-2xl">
          {/* Table Controls */}
          <div className="px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-between">
            <h3 className="font-bold text-xl text-white">Data Table</h3>
            <div className="flex items-center space-x-4">
              <span className="text-cyan-100 text-sm">Show rows:</span>
              <select
                value={rowsToShow}
                onChange={(e) => setRowsToShow(Number(e.target.value))}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-cyan-400 font-semibold"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-cyan-100 text-sm">
                Total: {dataset.stats.rows} rows
              </span>
            </div>
          </div>

          {/* Scrollable Table */}
          <div className="overflow-auto" style={{ maxHeight: '500px' }}>
            <table className="w-full text-sm">
              <thead className="bg-gray-800 sticky top-0 z-10">
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-3 text-left font-bold text-cyan-400 border-r border-gray-700">
                    #
                  </th>
                  {dataset.numericColumns.map(col => (
                    <th key={col} className="px-4 py-3 text-left font-bold text-cyan-400 whitespace-nowrap border-r border-gray-700">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataset.cleaned.slice(0, rowsToShow).map((row, i) => (
                  <tr 
                    key={i} 
                    className={`border-b border-gray-800 ${
                      i % 2 === 0 ? 'bg-gray-900/50' : 'bg-gray-800/30'
                    } hover:bg-cyan-900/20 transition-colors`}
                  >
                    <td className="px-4 py-3 font-mono text-gray-500 font-bold border-r border-gray-800">
                      {i}
                    </td>
                    {dataset.numericColumns.map(col => (
                      <td key={col} className="px-4 py-3 whitespace-nowrap font-mono text-gray-300 border-r border-gray-800">
                        {isNaN(row[col]) ? '—' : row[col].toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COLUMN INFO VIEW (df.info) */}
      {viewMode === 'info' && (
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl border border-green-500/20 overflow-hidden shadow-2xl">
          <div className="px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600">
            <h3 className="font-bold text-xl text-white">Column Information (df.info)</h3>
          </div>
          
          <div className="p-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-700">
                <div className="text-3xl font-bold text-cyan-400">{dataset.stats.rows}</div>
                <div className="text-gray-400 text-sm">Total Rows</div>
              </div>
              <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-700">
                <div className="text-3xl font-bold text-green-400">{dataset.stats.columns}</div>
                <div className="text-gray-400 text-sm">Columns</div>
              </div>
              <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-700">
                <div className="text-3xl font-bold text-purple-400">
                  {Object.values(dataset.stats.missing).reduce((a, b) => a + b, 0)}
                </div>
                <div className="text-gray-400 text-sm">Missing Values</div>
              </div>
              <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-700">
                <div className="text-3xl font-bold text-orange-400">
                  {((1 - Object.values(dataset.stats.missing).reduce((a, b) => a + b, 0) / (dataset.raw.length * dataset.stats.columns)) * 100).toFixed(1)}%
                </div>
                <div className="text-gray-400 text-sm">Data Quality</div>
              </div>
            </div>

            {/* Column Details Table */}
            <div className="overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-3 text-left font-bold text-green-400">#</th>
                    <th className="px-4 py-3 text-left font-bold text-green-400">Column Name</th>
                    <th className="px-4 py-3 text-left font-bold text-green-400">Data Type</th>
                    <th className="px-4 py-3 text-left font-bold text-green-400">Non-Null Count</th>
                    <th className="px-4 py-3 text-left font-bold text-green-400">Missing</th>
                    <th className="px-4 py-3 text-left font-bold text-green-400">Completeness</th>
                  </tr>
                </thead>
                <tbody>
                  {dataset.numericColumns.map((col, i) => {
                    const missing = dataset.stats.missing[col] || 0
                    const nonNull = dataset.raw.length - missing
                    const completeness = ((nonNull / dataset.raw.length) * 100).toFixed(1)
                    
                    return (
                      <tr key={col} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="px-4 py-3 text-gray-400 font-mono">{i}</td>
                        <td className="px-4 py-3 text-cyan-400 font-semibold">{col}</td>
                        <td className="px-4 py-3 text-gray-300">
                          <span className="px-3 py-1 bg-blue-900/40 text-blue-300 rounded-lg text-xs font-bold">
                            numeric
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-300 font-mono">{nonNull}</td>
                        <td className="px-4 py-3 text-orange-400 font-mono">{missing}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full"
                                style={{ width: `${completeness}%` }}
                              />
                            </div>
                            <span className="text-green-400 font-bold text-sm">{completeness}%</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* STATISTICS VIEW (df.describe) */}
      {viewMode === 'stats' && (
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl border border-purple-500/20 overflow-hidden shadow-2xl">
          <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600">
            <h3 className="font-bold text-xl text-white">Statistical Summary (df.describe)</h3>
          </div>
          
          <div className="p-6">
            {Object.keys(dataset.stats.summary).length > 0 ? (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800 sticky top-0">
                    <tr className="border-b border-gray-700">
                      <th className="px-4 py-3 text-left font-bold text-purple-400">Statistic</th>
                      {dataset.numericColumns.map(col => (
                        <th key={col} className="px-4 py-3 text-left font-bold text-purple-400 whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {['min', 'max', 'mean', 'median', 'std'].map((stat, i) => (
                      <tr key={stat} className={`border-b border-gray-800 ${i % 2 === 0 ? 'bg-gray-900/50' : 'bg-gray-800/30'}`}>
                        <td className="px-4 py-3 font-bold text-cyan-400 capitalize">{stat}</td>
                        {dataset.numericColumns.map(col => {
                          const value = dataset.stats.summary[col]?.[stat as keyof typeof dataset.stats.summary[typeof col]]
                          return (
                            <td key={col} className="px-4 py-3 font-mono text-gray-300">
                              {value !== undefined ? value.toFixed(4) : '—'}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <div className="text-xl text-gray-400">No statistics calculated yet</div>
                <div className="text-gray-500 text-sm mt-2">Upload data to see statistics</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
