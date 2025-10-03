import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { historyService } from '../services/historyService'
import ChatInterface from '../components/ChatInterface'
import ResultsTabs from '../components/ResultsTabs'
import ExportButtons from '../components/ExportButtons'
import HistorySidebar from '../components/HistorySidebar'

export default function WorkspacePage() {
  const { user } = useAuth()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentHistoryId, setCurrentHistoryId] = useState(null)
  const [framework, setFramework] = useState('playwright')
  const [messages, setMessages] = useState([])
  const [viewMode, setViewMode] = useState('chat') // 'chat' or 'results'

  const handleSendMessage = async (userMessage) => {
    // Add user message to chat
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/.netlify/functions/chat-generate-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          framework
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate tests')
      }

      const data = await response.json()

      // Add assistant response to chat
      setMessages([...newMessages, {
        role: 'assistant',
        content: data.message,
        testCount: data.manualTests.length
      }])

      setResults(data)
      setViewMode('results')

      // Save to history
      if (user) {
        try {
          const historyItem = await historyService.saveToHistory(user.id, {
            story: userMessage,
            framework,
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
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'Sorry, I encountered an error generating tests. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleFrameworkChange = (newFramework) => {
    setFramework(newFramework)
    if (results) {
      // Regenerate automation skeletons for new framework
      // This would need backend support - for now just update state
      setResults({ ...results, framework: newFramework })
    }
  }

  const handleSelectHistory = (historyItem) => {
    setCurrentHistoryId(historyItem.id)
    setFramework(historyItem.framework)
    setResults({
      manualTests: historyItem.manual_tests,
      automationSkeletons: historyItem.automation_skeletons,
      framework: historyItem.framework,
      exports: historyItem.exports,
    })
    setViewMode('results')
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white neon-text">
              🚀 Test Suite Generator
            </h1>
            {results && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('chat')}
                  className={`px-4 py-2 rounded-lg transition ${
                    viewMode === 'chat'
                      ? 'bg-purple-600 text-white'
                      : 'bg-dark-700/50 text-gray-400 hover:text-white'
                  }`}
                >
                  💬 Chat
                </button>
                <button
                  onClick={() => setViewMode('results')}
                  className={`px-4 py-2 rounded-lg transition ${
                    viewMode === 'results'
                      ? 'bg-purple-600 text-white'
                      : 'bg-dark-700/50 text-gray-400 hover:text-white'
                  }`}
                >
                  📋 Results
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg backdrop-blur-md">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {viewMode === 'chat' && (
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              loading={loading}
              framework={framework}
              onFrameworkChange={handleFrameworkChange}
            />
          )}

          {viewMode === 'results' && results && (
            <div>
              <ResultsTabs results={results} />
              <ExportButtons results={results} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
