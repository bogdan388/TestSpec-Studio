import { useState } from 'react'
import StoryInput from '../components/StoryInput'
import ResultsTabs from '../components/ResultsTabs'
import ExportButtons from '../components/ExportButtons'

export default function WorkspacePage() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async (story, framework) => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/.netlify/functions/generate-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ story, framework }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate tests')
      }

      const data = await response.json()
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

      {loading && (
        <div className="mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Generating test suite...</p>
        </div>
      )}

      {results && (
        <div className="mt-8">
          <ResultsTabs results={results} />
          <ExportButtons results={results} />
        </div>
      )}
    </div>
  )
}
