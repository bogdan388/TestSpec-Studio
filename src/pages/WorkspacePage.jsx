import { useState } from 'react'
import StoryInput from '../components/StoryInput'
import ResultsTabs from '../components/ResultsTabs'
import ExportButtons from '../components/ExportButtons'

export default function WorkspacePage() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [streamingTests, setStreamingTests] = useState([])

  const handleGenerate = async (story, framework) => {
    setLoading(true)
    setError(null)
    setResults(null)
    setStreamingTests([])

    try {
      // Start fetching in the background
      const fetchPromise = fetch('/.netlify/functions/generate-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ story, framework }),
      })

      // Show first loading indicator immediately
      await new Promise(resolve => setTimeout(resolve, 100))

      const response = await fetchPromise

      if (!response.ok) {
        throw new Error('Failed to generate tests')
      }

      const data = await response.json()

      // Display tests one by one immediately after receiving response
      if (data.manualTests && data.manualTests.length > 0) {
        // Show first test immediately
        setStreamingTests([data.manualTests[0]])

        // Show rest with small delays
        for (let i = 1; i < data.manualTests.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 150))
          setStreamingTests(prev => [...prev, data.manualTests[i]])
        }
      }

      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Suite Generator</h1>

      <StoryInput onGenerate={handleGenerate} loading={loading} />

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {loading && streamingTests.length === 0 && (
        <div className="mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Analyzing your story and generating test cases...</p>
          <p className="mt-2 text-sm text-gray-500">This may take 10-20 seconds</p>
        </div>
      )}

      {streamingTests.length > 0 && (
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Generated Test Cases {loading && '(Loading...)'}
            </h3>
            <div className="space-y-4">
              {streamingTests.map((test, index) => (
                <div
                  key={test.id}
                  className="bg-gray-50 rounded-lg p-5 border border-gray-200 animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {test.id}. {test.title}
                  </h4>
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Steps:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      {test.steps.map((step, idx) => (
                        <li key={idx} className="text-gray-600 text-sm">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Expected Result:</p>
                    <p className="text-gray-600 text-sm">{test.expected}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-sm text-gray-600">Loading more tests...</p>
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
  )
}
