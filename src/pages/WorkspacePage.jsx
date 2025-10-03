import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { historyService } from '../services/historyService'
import StoryInput from '../components/StoryInput'
import ResultsTabs from '../components/ResultsTabs'
import ExportButtons from '../components/ExportButtons'
import HistorySidebar from '../components/HistorySidebar'

export default function WorkspacePage() {
  const { user } = useAuth()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [streamingTests, setStreamingTests] = useState([])
  const [currentHistoryId, setCurrentHistoryId] = useState(null)
  const [story, setStory] = useState('')
  const [framework, setFramework] = useState('playwright')

  const handleGenerate = async (inputStory, inputFramework) => {
    setLoading(true)
    setError(null)
    setResults(null)
    setStreamingTests([])
    setCurrentHistoryId(null)
    setStory(inputStory)
    setFramework(inputFramework)

    try {
      const fetchPromise = fetch('/.netlify/functions/generate-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ story: inputStory, framework: inputFramework }),
      })

      await new Promise(resolve => setTimeout(resolve, 100))

      const response = await fetchPromise

      if (!response.ok) {
        throw new Error('Failed to generate tests')
      }

      const data = await response.json()

      // Display tests one by one
      if (data.manualTests && data.manualTests.length > 0) {
        setStreamingTests([data.manualTests[0]])

        for (let i = 1; i < data.manualTests.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 150))
          setStreamingTests(prev => [...prev, data.manualTests[i]])
        }
      }

      setResults(data)

      // Save to history
      if (user) {
        try {
          const historyItem = await historyService.saveToHistory(user.id, {
            story: inputStory,
            framework: inputFramework,
            manualTests: data.manualTests,
            automationSkeletons: data.automationSkeletons,
            exports: data.exports,
          })
          setCurrentHistoryId(historyItem.id)
        } catch (historyError) {
          console.error('Failed to save history:', historyError)
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectHistory = (historyItem) => {
    setCurrentHistoryId(historyItem.id)
    setStory(historyItem.story)
    setFramework(historyItem.framework)
    setResults({
      manualTests: historyItem.manual_tests,
      automationSkeletons: historyItem.automation_skeletons,
      framework: historyItem.framework,
      exports: historyItem.exports,
    })
    setStreamingTests(historyItem.manual_tests || [])
    setError(null)
  }

  return (
    <div className="flex">
      <HistorySidebar
        onSelectHistory={handleSelectHistory}
        currentHistoryId={currentHistoryId}
      />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-white mb-8 neon-text">
            🚀 Test Suite Generator
          </h1>

          <StoryInput onGenerate={handleGenerate} loading={loading} initialStory={story} initialFramework={framework} />

          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg backdrop-blur-md">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {loading && streamingTests.length === 0 && (
            <div className="mt-8 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary shadow-neon"></div>
              <p className="mt-4 text-gray-300">Analyzing your story and generating test cases...</p>
              <p className="mt-2 text-sm text-gray-400">This may take 10-20 seconds</p>
            </div>
          )}

          {streamingTests.length > 0 && (
            <div className="mt-8">
              <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  ✨ Generated Test Cases {loading && '(Loading...)'}
                </h3>
                <div className="space-y-4">
                  {streamingTests.map((test, index) => (
                    <div
                      key={test.id}
                      className="bg-dark-700/50 rounded-lg p-5 border border-purple-500/20 hover:border-purple-400/40 transition animate-fadeIn"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <h4 className="text-lg font-semibold text-white mb-3">
                        {test.id}. {test.title}
                      </h4>
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-300 mb-2">Steps:</p>
                        <ol className="list-decimal list-inside space-y-1">
                          {test.steps.map((step, idx) => (
                            <li key={idx} className="text-gray-400 text-sm">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-300 mb-1">Expected Result:</p>
                        <p className="text-gray-400 text-sm">{test.expected}</p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="mt-2 text-sm text-gray-400">Loading more tests...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {results && !loading && (
            <div className="mt-8">
              <ResultsTabs results={results} />
              <ExportButtons results={results} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
