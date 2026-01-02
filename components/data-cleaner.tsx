'use client'

import { useState } from 'react'

interface DataCleanerProps {
  dataset: any
  onCleanedDataReady: (cleaned: any) => void
}

export function DataCleaner({ dataset, onCleanedDataReady }: DataCleanerProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(dataset.numericColumns)
  const [missingStrategy, setMissingStrategy] = useState<'drop' | 'mean' | 'median'>('mean')
  const [removeOutliers, setRemoveOutliers] = useState(false)
  const [normalize, setNormalize] = useState(false)
  const [groupByConfig, setGroupByConfig] = useState<{
    enabled: boolean
    column: string
    aggFunction: 'sum' | 'mean' | 'count' | 'min' | 'max'
  }>({
    enabled: false,
    column: '',
    aggFunction: 'mean'
  })

  const toggleColumn = (col: string) => {
    setSelectedColumns(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    )
  }

  const handleClean = () => {
    let cleaned = [...dataset.raw]

    // Step 1: Handle missing values
    if (missingStrategy === 'drop') {
      cleaned = cleaned.filter((row: any) =>
        selectedColumns.every(col => row[col] != null && row[col] !== '')
      )
    } else {
      const means: { [key: string]: number } = {}
      const medians: { [key: string]: number } = {}

      selectedColumns.forEach(col => {
        const values = cleaned
          .map((row: any) => parseFloat(row[col]))
          .filter((v: number) => !isNaN(v))
          .sort((a: number, b: number) => a - b)

        means[col] = values.reduce((a: number, b: number) => a + b, 0) / values.length
        medians[col] = values[Math.floor(values.length / 2)]
      })

      cleaned = cleaned.map((row: any) => {
        const newRow = { ...row }
        selectedColumns.forEach(col => {
          if (row[col] == null || row[col] === '') {
            newRow[col] = missingStrategy === 'mean' ? means[col] : medians[col]
          }
        })
        return newRow
      })
    }

    // Step 2: Remove outliers (Z-score method)
    if (removeOutliers) {
      selectedColumns.forEach(col => {
        const values = cleaned.map((row: any) => parseFloat(row[col]))
        const mean = values.reduce((a, b) => a + b, 0) / values.length
        const std = Math.sqrt(
          values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
        )

        cleaned = cleaned.filter((row: any) => {
          const zScore = Math.abs((parseFloat(row[col]) - mean) / std)
          return zScore < 3
        })
      })
    }

    // Step 3: GroupBy aggregation
    if (groupByConfig.enabled && groupByConfig.column) {
      const grouped: { [key: string]: any[] } = {}
      
      cleaned.forEach((row: any) => {
        const key = row[groupByConfig.column]
        if (!grouped[key]) grouped[key] = []
        grouped[key].push(row)
      })

      cleaned = Object.entries(grouped).map(([key, rows]) => {
        const result: any = { [groupByConfig.column]: key }
        
        selectedColumns.forEach(col => {
          const values = rows.map(r => parseFloat(r[col])).filter(v => !isNaN(v))
          
          switch(groupByConfig.aggFunction) {
            case 'sum':
              result[col] = values.reduce((a, b) => a + b, 0)
              break
            case 'mean':
              result[col] = values.reduce((a, b) => a + b, 0) / values.length
              break
            case 'count':
              result[col] = values.length
              break
            case 'min':
              result[col] = Math.min(...values)
              break
            case 'max':
              result[col] = Math.max(...values)
              break
          }
        })
        
        return result
      })
    }

    // Step 4: Normalize (0-1 scale)
    if (normalize) {
      const mins: { [key: string]: number } = {}
      const maxs: { [key: string]: number } = {}

      selectedColumns.forEach(col => {
        const values = cleaned.map((row: any) => parseFloat(row[col]))
        mins[col] = Math.min(...values)
        maxs[col] = Math.max(...values)
      })

      cleaned = cleaned.map((row: any) => {
        const newRow = { ...row }
        selectedColumns.forEach(col => {
          const val = parseFloat(row[col])
          newRow[col] = (val - mins[col]) / (maxs[col] - mins[col])
        })
        return newRow
      })
    }

    onCleanedDataReady({
      cleaned,
      numericColumns: selectedColumns,
      stats: {
        rows: cleaned.length,
        columns: selectedColumns.length
      }
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-cyan-400 flex items-center gap-3">
        <span className="text-4xl">🧹</span> Data Transformation
      </h2>

      {/* Column Selection */}
      <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          📊 Select Columns
        </h3>
        <div className="flex flex-wrap gap-3">
          {dataset.numericColumns.map((col: string) => (
            <button
              key={col}
              onClick={() => toggleColumn(col)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedColumns.includes(col)
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {col}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-3">
          Selected: {selectedColumns.length} / {dataset.numericColumns.length} columns
        </p>
      </div>

      {/* Missing Values */}
      <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
        <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
          🔧 Handle Missing Values
        </h3>
        <div className="space-y-3">
          {[
            { value: 'drop', label: 'Drop Rows', icon: '❌' },
            { value: 'mean', label: 'Fill With Mean', icon: '➗' },
            { value: 'median', label: 'Fill With Median', icon: '📊' },
          ].map(option => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={missingStrategy === option.value}
                onChange={() => setMissingStrategy(option.value as any)}
                className="w-5 h-5"
              />
              <span className="text-lg">{option.icon}</span>
              <span className="text-white font-semibold">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* GroupBy */}
      <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
        <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
          🔀 Group By Aggregation
        </h3>
        
        <label className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            checked={groupByConfig.enabled}
            onChange={(e) => setGroupByConfig(prev => ({ ...prev, enabled: e.target.checked }))}
            className="w-5 h-5"
          />
          <span className="text-white font-semibold">Enable GroupBy</span>
        </label>

        {groupByConfig.enabled && (
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 mb-2 block">Group By Column:</label>
              <select
                value={groupByConfig.column}
                onChange={(e) => setGroupByConfig(prev => ({ ...prev, column: e.target.value }))}
                className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700"
              >
                <option value="">Select column...</option>
                {dataset.numericColumns.map((col: string) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-400 mb-2 block">Aggregation Function:</label>
              <select
                value={groupByConfig.aggFunction}
                onChange={(e) => setGroupByConfig(prev => ({ ...prev, aggFunction: e.target.value as any }))}
                className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700"
              >
                <option value="sum">Sum</option>
                <option value="mean">Mean</option>
                <option value="count">Count</option>
                <option value="min">Minimum</option>
                <option value="max">Maximum</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Options */}
      <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
        <h3 className="text-xl font-bold text-pink-400 mb-4 flex items-center gap-2">
          ⚙️ Advanced Options
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={removeOutliers}
              onChange={(e) => setRemoveOutliers(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-white font-semibold">Remove Outliers (Z-score)</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={normalize}
              onChange={(e) => setNormalize(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-white font-semibold">Normalize (0-1 scale)</span>
          </label>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 rounded-2xl border border-blue-700/50">
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-4xl font-bold text-cyan-400">{dataset.stats.rows}</div>
            <div className="text-gray-400 mt-1">Original Rows</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-400">{selectedColumns.length}</div>
            <div className="text-gray-400 mt-1">Selected Columns</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400">
              {groupByConfig.enabled ? '~' : dataset.stats.rows}
            </div>
            <div className="text-gray-400 mt-1">Est. Cleaned Rows</div>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleClean}
        disabled={selectedColumns.length === 0}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-5 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        <span className="text-3xl">✨</span>
        Apply Transformation & Generate Charts
      </button>
    </div>
  )
}
