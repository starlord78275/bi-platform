'use client'

interface StatusBarProps {
  dataset: any
  currentView: string
}

export function StatusBar({ dataset, currentView }: StatusBarProps) {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 px-6 py-2 flex items-center justify-between text-sm">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">View:</span>
          <span className="text-cyan-400 font-semibold">{currentView}</span>
        </div>
        
        {dataset && (
          <>
            <div className="h-4 w-px bg-gray-700"></div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Rows:</span>
              <span className="text-white font-bold">{dataset.stats.rows.toLocaleString()}</span>
            </div>
            
            <div className="h-4 w-px bg-gray-700"></div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Columns:</span>
              <span className="text-white font-bold">{dataset.stats.columns}</span>
            </div>
            
            <div className="h-4 w-px bg-gray-700"></div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Data Quality:</span>
              <div className="flex items-center space-x-1">
                <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: '85%' }}></div>
                </div>
                <span className="text-green-400 font-bold text-xs">85%</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-400 text-xs">Ready</span>
        </div>
        <div className="text-gray-500 text-xs">
          v1.0.0
        </div>
      </div>
    </div>
  )
}
