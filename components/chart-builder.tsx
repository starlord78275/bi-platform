'use client'

import { useState } from 'react'
import { 
  LineChart, Line, 
  BarChart, Bar, 
  ScatterChart, Scatter, 
  AreaChart, Area,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
import { Dataset } from '@/lib/data-processing/pipeline'

interface ChartBuilderProps {
  dataset: Dataset
}

const COLORS = ['#22d3ee', '#10b981', '#a78bfa', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#6366f1']

const CHART_TYPES = [
  { id: 'line', name: 'Line Chart', icon: '📉', desc: 'Show trends over time' },
  { id: 'bar', name: 'Bar Chart', icon: '📊', desc: 'Compare values' },
  { id: 'horizontal-bar', name: 'Horizontal Bar', icon: '📊', desc: 'Side-by-side comparison' },
  { id: 'area', name: 'Area Chart', icon: '📈', desc: 'Filled line chart' },
  { id: 'scatter', name: 'Scatter Plot', icon: '🔵', desc: 'Show correlation' },
  { id: 'pie', name: 'Pie Chart', icon: '🥧', desc: 'Show proportions' },
  { id: 'radar', name: 'Radar Chart', icon: '🎯', desc: 'Multi-dimensional' },
  { id: 'multi-line', name: 'Multi-Line', icon: '📊', desc: 'Compare multiple columns' },
]

export function ChartBuilder({ dataset }: ChartBuilderProps) {
  const [selectedChart, setSelectedChart] = useState('line')
  const [xColumn, setXColumn] = useState(dataset.numericColumns[0])
  const [yColumns, setYColumns] = useState<string[]>([dataset.numericColumns[1] || dataset.numericColumns[0]])

  // Prepare data
  const chartData = dataset.cleaned.slice(0, 50).map((row, i) => {
    const point: any = { index: i, name: `Row ${i}` }
    dataset.numericColumns.forEach(col => {
      point[col] = row[col] || 0
    })
    return point
  })

  // Pie data
  const pieData = yColumns.map(col => {
    const values = dataset.cleaned.map(r => r[col]).filter(v => !isNaN(v))
    const sum = values.reduce((a, b) => a + b, 0)
    return {
      name: col,
      value: Math.abs(sum / values.length) || 1
    }
  }).filter(d => d.value > 0)

  const toggleYColumn = (col: string) => {
    setYColumns(prev => 
      prev.includes(col) 
        ? prev.filter(c => c !== col)
        : [...prev, col]
    )
  }

  const renderChart = () => {
    switch (selectedChart) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={450}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="index" stroke="#9ca3af" tick={{ fill: '#d1d5db' }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#d1d5db' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }} />
              <Legend wrapperStyle={{ color: '#d1d5db' }} />
              <Line type="monotone" dataKey={yColumns[0]} stroke="#22d3ee" strokeWidth={3} dot={{ fill: '#06b6d4', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={chartData.slice(0, 20)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="index" stroke="#9ca3af" tick={{ fill: '#d1d5db' }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#d1d5db' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }} />
              <Legend wrapperStyle={{ color: '#d1d5db' }} />
              <Bar dataKey={yColumns[0]} fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'horizontal-bar':
        return (
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={chartData.slice(0, 20)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" tick={{ fill: '#d1d5db' }} />
              <YAxis dataKey="index" type="category" stroke="#9ca3af" tick={{ fill: '#d1d5db' }} width={50} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }} />
              <Legend wrapperStyle={{ color: '#d1d5db' }} />
              <Bar dataKey={yColumns[0]} fill="#3b82f6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={450}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="index" stroke="#9ca3af" tick={{ fill: '#d1d5db' }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#d1d5db' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }} />
              <Legend wrapperStyle={{ color: '#d1d5db' }} />
              <Area type="monotone" dataKey={yColumns[0]} stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorArea)" />
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={450}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey={xColumn} name={xColumn} stroke="#9ca3af" tick={{ fill: '#d1d5db' }} />
              <YAxis dataKey={yColumns[0]} name={yColumns[0]} stroke="#9ca3af" tick={{ fill: '#d1d5db' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }} />
              <Scatter name="Data Points" data={chartData} fill="#a78bfa" />
            </ScatterChart>
          </ResponsiveContainer>
        )

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={450}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={(entry) => `${entry.name}: ${entry.value.toFixed(1)}`}
                outerRadius={140}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }} />
              <Legend wrapperStyle={{ color: '#d1d5db' }} />
            </PieChart>
          </ResponsiveContainer>
        )

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={450}>
            <RadarChart data={chartData.slice(0, 10)}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="index" tick={{ fill: '#d1d5db' }} />
              <PolarRadiusAxis tick={{ fill: '#d1d5db' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }} />
              <Radar name={yColumns[0]} dataKey={yColumns[0]} stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
              <Legend wrapperStyle={{ color: '#d1d5db' }} />
            </RadarChart>
          </ResponsiveContainer>
        )

      case 'multi-line':
        return (
          <ResponsiveContainer width="100%" height={450}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="index" stroke="#9ca3af" tick={{ fill: '#d1d5db' }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#d1d5db' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }} />
              <Legend wrapperStyle={{ color: '#d1d5db' }} />
              {yColumns.map((col, i) => (
                <Line 
                  key={col}
                  type="monotone" 
                  dataKey={col} 
                  stroke={COLORS[i % COLORS.length]} 
                  strokeWidth={2}
                  dot={{ fill: COLORS[i % COLORS.length], r: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )

      default:
        return <div className="text-gray-400">Select a chart type</div>
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600 bg-clip-text text-transparent">
        🎨 Custom Chart Builder
      </h2>

      {/* Chart Type Selection */}
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-6 rounded-2xl border border-purple-500/30">
        <h3 className="font-bold text-xl mb-4 text-purple-400">📊 Choose Chart Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CHART_TYPES.map(chart => (
            <button
              key={chart.id}
              onClick={() => setSelectedChart(chart.id)}
              className={`p-4 rounded-xl transition-all ${
                selectedChart === chart.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/50 scale-105'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <div className="text-3xl mb-2">{chart.icon}</div>
              <div className="font-bold text-sm">{chart.name}</div>
              <div className="text-xs opacity-70 mt-1">{chart.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Column Selection */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* X-Axis Column */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-6 rounded-2xl border border-cyan-500/30">
          <h3 className="font-bold text-xl mb-4 text-cyan-400">📍 X-Axis Column</h3>
          <select
            value={xColumn}
            onChange={(e) => setXColumn(e.target.value)}
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-cyan-500/30 font-semibold text-lg"
          >
            {dataset.numericColumns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>

        {/* Y-Axis Columns */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-6 rounded-2xl border border-green-500/30">
          <h3 className="font-bold text-xl mb-4 text-green-400">
            📈 Y-Axis Column{selectedChart === 'multi-line' ? 's (select multiple)' : ''}
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {dataset.numericColumns.map(col => (
              <label 
                key={col}
                className={`flex items-center space-x-3 cursor-pointer p-3 rounded-xl transition-all ${
                  yColumns.includes(col)
                    ? 'bg-green-500/20 border border-green-500/50'
                    : 'bg-gray-900/50 hover:bg-gray-800'
                }`}
              >
                <input
                  type={selectedChart === 'multi-line' ? 'checkbox' : 'radio'}
                  checked={yColumns.includes(col)}
                  onChange={() => {
                    if (selectedChart === 'multi-line') {
                      toggleYColumn(col)
                    } else {
                      setYColumns([col])
                    }
                  }}
                  className="w-5 h-5 accent-green-500"
                />
                <span className="text-gray-300 font-medium flex-1">{col}</span>
                {dataset.stats.summary[col] && (
                  <span className="text-xs text-gray-500">
                    Avg: {dataset.stats.summary[col].mean.toFixed(1)}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Display */}
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-8 rounded-2xl border border-blue-500/30 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-2xl text-blue-400">
            {CHART_TYPES.find(c => c.id === selectedChart)?.icon} {CHART_TYPES.find(c => c.id === selectedChart)?.name}
          </h3>
          <div className="text-gray-400 text-sm">
            {yColumns.length} column{yColumns.length > 1 ? 's' : ''} selected
          </div>
        </div>
        {renderChart()}
      </div>
    </div>
  )
}
