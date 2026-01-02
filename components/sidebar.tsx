'use client'

interface SidebarProps {
  currentStep: string
  onStepChange: (step: string) => void
  dataLoaded: boolean
}

export function Sidebar({ currentStep, onStepChange, dataLoaded }: SidebarProps) {
  const steps = [
    { id: 'upload', icon: '📤', label: 'Data Source', disabled: false },
    { id: 'preview', icon: '👁️', label: 'Preview', disabled: !dataLoaded },
    { id: 'inspect', icon: '🔍', label: 'Inspect', disabled: !dataLoaded },
    { id: 'clean', icon: '🧹', label: 'Transform', disabled: !dataLoaded },
    { id: 'charts', icon: '📊', label: 'Visualize', disabled: !dataLoaded },
  ]

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          BI Platform
        </h1>
        <p className="text-gray-500 text-xs mt-1">Data Analytics Suite</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => !step.disabled && onStepChange(step.id)}
            disabled={step.disabled}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all ${
              currentStep === step.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                : step.disabled
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-2xl">{step.icon}</span>
            <span>{step.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="bg-gray-800/50 rounded-xl p-3 text-center">
          <div className="text-cyan-400 font-bold text-sm">Status</div>
          <div className={`text-xs mt-1 ${dataLoaded ? 'text-green-400' : 'text-gray-500'}`}>
            {dataLoaded ? '✅ Data Loaded' : '⏳ Waiting...'}
          </div>
        </div>
      </div>
    </div>
  )
}
