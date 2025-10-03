import { useState } from 'react'
import ManualCaseCard from './ManualCaseCard'
import CodeBlock from './CodeBlock'

export default function ResultsTabs({ results }) {
  const [activeTab, setActiveTab] = useState('manual')

  const tabs = [
    { id: 'manual', label: 'Manual Test Cases' },
    { id: 'automation', label: 'Automation Skeletons' },
    { id: 'preview', label: 'Preview Bundle' },
  ]

  return (
    <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 overflow-hidden">
      <div className="border-b border-purple-500/30">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-6 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'border-b-2 border-purple-500 text-purple-400'
                  : 'text-gray-400 hover:text-gray-300 hover:border-purple-500/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'manual' && (
          <div className="space-y-4">
            {results.manualTests?.map((test) => (
              <ManualCaseCard key={test.id} test={test} />
            ))}
          </div>
        )}

        {activeTab === 'automation' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {results.framework === 'playwright' ? 'Playwright' : results.framework.toUpperCase()} Test Skeletons
            </h3>
            <CodeBlock code={results.automationSkeletons} language="javascript" />
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Markdown Preview</h3>
              <div className="bg-dark-700/50 rounded-lg p-4 border border-purple-500/20 overflow-auto max-h-96">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                  {results.exports?.markdown}
                </pre>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">CSV Preview</h3>
              <div className="bg-dark-700/50 rounded-lg p-4 border border-purple-500/20 overflow-auto max-h-96">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                  {results.exports?.csv}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
