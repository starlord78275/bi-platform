'use client'

interface RibbonProps {
  currentStep: string
  onNavigate: (step: string) => void
  hasData: boolean
}

export function OfficeRibbon({ currentStep, onNavigate, hasData }: RibbonProps) {
  const tabs = [
    { id: 'upload', label: 'Home', icon: '🏠' },
    { id: 'preview', label: 'Data', icon: '📊', disabled: !hasData },
    { id: 'inspect', label: 'Inspect', icon: '🔍', disabled: !hasData },
    { id: 'clean', label: 'Transform', icon: '🧹', disabled: !hasData },
    { id: 'charts', label: 'Visualize', icon: '📈', disabled: !hasData },
  ]

  return (
    <div className="bg-gray-900 border-b border-gray-700 shadow-xl">
      <div className="flex items-center px-4 py-2 bg-gray-950 border-b border-gray-800">
        <div className="flex items-center space-x-3 mr-8">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
            BI
          </div>
          <span className="font-bold text-white text-lg">Platform</span>
        </div>

        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onNavigate(tab.id)}
            disabled={tab.disabled}
            className={`px-6 py-2 font-semibold transition-all relative ${
              currentStep === tab.id
                ? 'text-cyan-400 bg-gray-900'
                : tab.disabled
                ? 'text-gray-700 cursor-not-allowed'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
            {currentStep === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
