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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-6 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {results.framework === 'playwright' ? 'Playwright' : 'Jest'} Test Skeletons
            </h3>
            <CodeBlock code={results.automationSkeletons} language="javascript" />
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Markdown Preview</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 overflow-auto max-h-96">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  {results.exports?.markdown}
                </pre>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">CSV Preview</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 overflow-auto max-h-96">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
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
