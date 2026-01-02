'use client'

import { useState } from 'react'
import { DataUpload } from '@/components/data-upload'
import { DataPreview } from '@/components/data-preview'
import { DataInspector } from '@/components/data-inspector'
import { DataCleaner } from '@/components/data-cleaner'
import { ChartViewer } from '@/components/chart-viewer'
import { OfficeRibbon } from '@/components/office-ribbon'
import { StatusBar } from '@/components/status-bar'
import { analyzeDataset } from '@/lib/data-processing/pipeline'

export default function Home() {
  const [dataset, setDataset] = useState<any>(null)
  const [cleanedDataset, setCleanedDataset] = useState<any>(null)
  const [step, setStep] = useState<'upload' | 'preview' | 'inspect' | 'clean' | 'charts'>('upload')

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <OfficeRibbon 
        currentStep={step}
        onNavigate={(newStep) => setStep(newStep as any)}
        hasData={!!dataset}
      />

      <div className="flex-1 overflow-auto p-8">
        {step === 'upload' && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-gray-700/50">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">📊</div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3">
                  Office-Style BI Platform
                </h2>
                <p className="text-gray-400 text-lg">Upload CSV to begin</p>
              </div>
              
              <DataUpload onDataReady={(raw) => {
                const analyzed = analyzeDataset(raw)
                setDataset(analyzed)
                setStep('preview')
              }} />
            </div>
          </div>
        )}

        {dataset && step === 'preview' && (
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50">
              <DataPreview dataset={dataset} />
              <button
                onClick={() => setStep('inspect')}
                className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-2xl font-bold text-xl hover:shadow-lg transition-all"
              >
                Next: Deep Inspection →
              </button>
            </div>
          </div>
        )}

        {dataset && step === 'inspect' && (
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50">
              <DataInspector dataset={dataset} />
              <button
                onClick={() => setStep('clean')}
                className="w-full mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-bold text-xl hover:shadow-lg transition-all"
              >
                Next: Transform Data →
              </button>
            </div>
          </div>
        )}

        {dataset && step === 'clean' && (
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50">
              <DataCleaner 
                dataset={dataset}
                onCleanedDataReady={(cleaned) => {
                  setCleanedDataset(cleaned)
                  setStep('charts')
                }}
              />
            </div>
          </div>
        )}

        {cleanedDataset && step === 'charts' && (
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700/50">
              <ChartViewer dataset={cleanedDataset} />
            </div>
          </div>
        )}
      </div>

      <StatusBar dataset={dataset} />
    </div>
  )
}
