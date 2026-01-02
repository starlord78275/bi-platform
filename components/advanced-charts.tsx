'use client'

import { Dataset } from '@/lib/data-processing/pipeline'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface AdvancedChartsProps {
  dataset: Dataset
}

// Calculate correlation matrix
function calculateCorrelation(dataset: Dataset): number[][] {
  const cols = dataset.numericColumns
  const n = dataset.cleaned.length
  const matrix: number[][] = []

  for (let i = 0; i < cols.length; i++) {
    matrix[i] = []
    const col1 = cols[i]
    const values1 = dataset.cleaned.map(r => r[col1]).filter(v => !isNaN(v))
    const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length

    for (let j = 0; j < cols.length; j++) {
      const col2 = cols[j]
      const values2 = dataset.cleaned.map(r => r[col2]).filter(v => !isNaN(v))
      const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length

      if (i === j) {
        matrix[i][j] = 1
      } else {
        let numerator = 0
        let sum1 = 0
        let sum2 = 0

        for (let k = 0; k < Math.min(values1.length, values2.length); k++) {
          const diff1 = values1[k] - mean1
          const diff2 = values2[k] - mean2
          numerator += diff1 * diff2
          sum1 += diff1 * diff1
          sum2 += diff2 * diff2
        }

        const denominator = Math.sqrt(sum1 * sum2)
        matrix[i][j] = denominator === 0 ? 0 : numerator / denominator
      }
    }
  }

  return matrix
}

// Get color for correlation value
function getCorrelationColor(value: number): string {
  if (value > 0.7) return '#ef4444' // Strong positive - red
  if (value > 0.4) return '#f59e0b' // Moderate positive - orange
  if (value > 0) return '#fbbf24' // Weak positive - yellow
  if (value === 0) return '#6b7280' // Zero - gray
  if (value > -0.4) return '#60a5fa' // Weak negative - light blue
  if (value > -0.7) return '#3b82f6' // Moderate negative - blue
  return '#1e40af' // Strong negative - dark blue
}

export function AdvancedCharts({ dataset }: AdvancedChartsProps) {
  const correlation = calculateCorrelation(dataset)
  const cellSize = Math.min(60, 500 / dataset.numericColumns.length)

  // Grouped bar chart data
  const groupedBarData = dataset.cleaned.slice(0, 10).map((row, i) => {
    const dataPoint: any = { name: `Row ${i}` }
    dataset.numericColumns.slice(0, 5).forEach(col => {
      dataPoint[col] = row[col]
    })
    return dataPoint
  })

  const COLORS = ['#22d3ee', '#10b981', '#a78bfa', '#f59e0b', '#ef4444']

  return (
    <div className="space-y-8">
      {/* CORRELATION HEATMAP */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-2xl shadow-2xl border border-red-500/20">
        <h3 className="font-bold text-2xl mb-6 text-red-400">🔥 Correlation Heatmap</h3>
        <p className="text-gray-400 text-sm mb-4">
          Shows how columns correlate with each other (-1 to +1). Red = strong positive, Blue = strong negative.
        </p>
        
        <div className="overflow-auto bg-gray-900/50 p-4 rounded-xl">
          <svg width={cellSize * dataset.numericColumns.length + 150} height={cellSize * dataset.numericColumns.length + 150}>
            {/* Column labels (top) */}
            {dataset.numericColumns.map((col, i) => (
              <text
                key={`col-${i}`}
                x={150 + i * cellSize + cellSize / 2}
                y={20}
                textAnchor="middle"
                fill="#d1d5db"
                fontSize="11"
                fontWeight="bold"
              >
                {col.length > 10 ? col.slice(0, 10) + '...' : col}
              </text>
            ))}

            {/* Row labels (left) */}
            {dataset.numericColumns.map((col, i) => (
              <text
                key={`row-${i}`}
                x={140}
                y={40 + i * cellSize + cellSize / 2}
                textAnchor="end"
                fill="#d1d5db"
                fontSize="11"
                fontWeight="bold"
              >
                {col.length > 10 ? col.slice(0, 10) + '...' : col}
              </text>
            ))}

            {/* Heatmap cells */}
            {correlation.map((row, i) => 
              row.map((value, j) => (
                <g key={`cell-${i}-${j}`}>
                  <rect
                    x={150 + j * cellSize}
                    y={30 + i * cellSize}
                    width={cellSize - 2}
                    height={cellSize - 2}
                    fill={getCorrelationColor(value)}
                    stroke="#1f2937"
                    strokeWidth="1"
                    opacity="0.9"
                  />
                  <text
                    x={150 + j * cellSize + cellSize / 2}
                    y={30 + i * cellSize + cellSize / 2 + 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {value.toFixed(2)}
                  </text>
                </g>
              ))
            )}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center space-x-6 flex-wrap">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span className="text-gray-300 text-sm">Strong + (0.7 to 1)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: '#fbbf24' }}></div>
            <span className="text-gray-300 text-sm">Weak + (0 to 0.4)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: '#60a5fa' }}></div>
            <span className="text-gray-300 text-sm">Weak - (-0.4 to 0)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: '#1e40af' }}></div>
            <span className="text-gray-300 text-sm">Strong - (-1 to -0.7)</span>
          </div>
        </div>
      </div>

      {/* GROUPED BAR CHART */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-2xl shadow-2xl border border-yellow-500/20">
        <h3 className="font-bold text-2xl mb-6 text-yellow-400">📊 Grouped Bar Chart (Multi-Column Comparison)</h3>
        <p className="text-gray-400 text-sm mb-4">
          Compare multiple columns side-by-side for each row (first 10 rows, top 5 columns)
        </p>
        
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={groupedBarData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#d1d5db' }} />
            <YAxis stroke="#9ca3af" tick={{ fill: '#d1d5db' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }}
              labelStyle={{ color: '#d1d5db' }}
            />
            <Legend wrapperStyle={{ color: '#d1d5db' }} />
            {dataset.numericColumns.slice(0, 5).map((col, i) => (
              <Bar 
                key={col} 
                dataKey={col} 
                fill={COLORS[i]} 
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
