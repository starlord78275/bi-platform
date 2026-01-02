'use client'

import { useState } from 'react'
import { Line, Bar, Scatter, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface ChartViewerProps {
  dataset: any
}

export function ChartViewer({ dataset }: ChartViewerProps) {
  const [customChart, setCustomChart] = useState<{
    type: 'line' | 'bar' | 'scatter' | 'pie'
    xAxis: string
    yAxis: string[]
  }>({
    type: 'line',
    xAxis: dataset.numericColumns[0] || '',
    yAxis: [dataset.numericColumns[1] || '']
  })

  const [showCustomBuilder, setShowCustomBuilder] = useState(false)

  const toggleYAxis = (col: string) => {
    setCustomChart(prev => ({
      ...prev,
      yAxis: prev.yAxis.includes(col)
        ? prev.yAxis.filter(c => c !== col)
        : [...prev.yAxis, col]
    }))
  }

  // Auto-generated charts
  const autoCharts = dataset.numericColumns.slice(0, 4).map((col: string) => {
    const data = {
      labels: dataset.cleaned.map((_: any, i: number) => i),
      datasets: [{
        label: col,
        data: dataset.cleaned.map((row: any) => row[col]),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      }]
    }

    return { column: col, data, type: 'line' }
  })

  // Custom chart data
  const getCustomChartData = () => {
    const colors = [
      'rgb(59, 130, 246)',
      'rgb(16, 185, 129)',
      'rgb(245, 158, 11)',
      'rgb(239, 68, 68)',
      'rgb(139, 92, 246)',
      'rgb(236, 72, 153)',
    ]

    if (customChart.type === 'pie') {
      return {
        labels: customChart.yAxis,
        datasets: [{
          data: customChart.yAxis.map(col => {
            const values = dataset.cleaned.map((row: any) => parseFloat(row[col]))
            return values.reduce((a: number, b: number) => a + b, 0) / values.length
          }),
          backgroundColor: colors.slice(0, customChart.yAxis.length),
        }]
      }
    }

    return {
      labels: dataset.cleaned.map((row: any) => row[customChart.xAxis]),
      datasets: customChart.yAxis.map((col, i) => ({
        label: col,
        data: dataset.cleaned.map((row: any) => row[col]),
        borderColor: colors[i % colors.length],
        backgroundColor: colors[i % colors.length].replace('rgb', 'rgba').replace(')', ', 0.5)'),
      }))
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top' as const,
        labels: { color: '#fff' }
      },
    },
    scales: customChart.type !== 'pie' ? {
      x: { 
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      y: { 
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255,255,255,0.1)' }
      }
    } : undefined
  }

  const renderChart = (type: string, data: any) => {
    switch(type) {
      case 'line': return <Line data={data} options={chartOptions} />
      case 'bar': return <Bar data={data} options={chartOptions} />
      case 'scatter': return <Scatter data={data} options={chartOptions} />
      case 'pie': return <Pie data={data} options={chartOptions} />
      default: return <Line data={data} options={chartOptions} />
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-cyan-400 flex items-center gap-3">
          <span className="text-4xl">📊</span> Data Visualizations
        </h2>
        <button
          onClick={() => setShowCustomBuilder(!showCustomBuilder)}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
        >
          {showCustomBuilder ? '📈 Show Auto Charts' : '🎨 Custom Chart Builder'}
        </button>
      </div>

      {showCustomBuilder ? (
        /* CUSTOM CHART BUILDER */
        <div className="space-y-6">
          {/* Chart Type Selection */}
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
            <h3 className="text-xl font-bold text-purple-400 mb-4">📈 Chart Type</h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { type: 'line', icon: '📈', label: 'Line Chart' },
                { type: 'bar', icon: '📊', label: 'Bar Chart' },
                { type: 'scatter', icon: '🔵', label: 'Scatter Plot' },
                { type: 'pie', icon: '🥧', label: 'Pie Chart' },
              ].map(option => (
                <button
                  key={option.type}
                  onClick={() => setCustomChart(prev => ({ ...prev, type: option.type as any }))}
                  className={`p-4 rounded-xl font-semibold transition-all ${
                    customChart.type === option.type
                      ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  <div className="text-3xl mb-2">{option.icon}</div>
                  <div className="text-sm">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* X-Axis Selection */}
          {customChart.type !== 'pie' && (
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">📐 X-Axis</h3>
              <select
                value={customChart.xAxis}
                onChange={(e) => setCustomChart(prev => ({ ...prev, xAxis: e.target.value }))}
                className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 text-lg font-semibold"
              >
                {dataset.numericColumns.map((col: string) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          )}

          {/* Y-Axis Selection */}
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
            <h3 className="text-xl font-bold text-green-400 mb-4">
              📊 {customChart.type === 'pie' ? 'Data Columns' : 'Y-Axis'} (Multi-select)
            </h3>
            <div className="flex flex-wrap gap-3">
              {dataset.numericColumns
                .filter((col: string) => customChart.type === 'pie' || col !== customChart.xAxis)
                .map((col: string) => (
                  <button
                    key={col}
                    onClick={() => toggleYAxis(col)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      customChart.yAxis.includes(col)
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {col}
                  </button>
                ))}
            </div>
            <p className="text-gray-400 text-sm mt-3">
              Selected: {customChart.yAxis.length} column(s)
            </p>
          </div>

          {/* Custom Chart Display */}
          {customChart.yAxis.length > 0 && (
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-cyan-700/50">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                📈 {customChart.type.charAt(0).toUpperCase() + customChart.type.slice(1)} Chart
                {customChart.type !== 'pie' && ` (${customChart.xAxis} vs ${customChart.yAxis.join(', ')})`}
              </h3>
              <div className="h-96 bg-gray-900/50 rounded-xl p-4">
                {renderChart(customChart.type, getCustomChartData())}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* AUTO-GENERATED CHARTS */
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 p-4 rounded-xl border border-cyan-700/50">
            <p className="text-cyan-300 text-center font-semibold">
              ✨ Auto-generated visualizations for top {autoCharts.length} columns • Use Custom Builder for advanced charts
            </p>
          </div>

          {autoCharts.map((chart, i) => (
            <div key={i} className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                📈 {chart.type === 'line' ? 'Line' : 'Bar'} Chart: {chart.column} Trend
              </h3>
              <div className="h-96 bg-gray-900/50 rounded-xl p-4">
                {renderChart(chart.type, chart.data)}
              </div>
            </div>
          ))}

          {/* Distribution Charts */}
          {dataset.numericColumns.slice(0, 2).map((col: string, i: number) => {
            const values = dataset.cleaned.map((row: any) => row[col])
            const bins = 10
            const min = Math.min(...values)
            const max = Math.max(...values)
            const binSize = (max - min) / bins
            
            const histogram = Array(bins).fill(0)
            values.forEach((val: number) => {
              const binIndex = Math.min(Math.floor((val - min) / binSize), bins - 1)
              histogram[binIndex]++
            })

            const data = {
              labels: Array(bins).fill(0).map((_, i) => (min + i * binSize).toFixed(1)),
              datasets: [{
                label: `${col} Distribution`,
                data: histogram,
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 2
              }]
            }

            return (
              <div key={i} className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
                  📊 Distribution: {col}
                </h3>
                <div className="h-96 bg-gray-900/50 rounded-xl p-4">
                  <Bar data={data} options={chartOptions} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
