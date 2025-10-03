import { useState, useRef } from 'react'
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
  const [viewMode, setViewMode] = useState('split') // 'chat', 'results', or 'split'
  const historyRefreshRef = useRef(null)

  const handleSendMessage = async (userMessage) => {
    // Add user message to chat
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)

    setLoading(true)
    setError(null)
    setViewMode('split') // Show both chat and results during generation

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

      // Update results in real-time
      setResults(data)

      // Update or create chat session
      if (user) {
        try {
          if (currentHistoryId) {
            await historyService.updateChatSession(currentHistoryId, user.id, {
              story: newMessages[0].content, // Use first user message as title
              framework,
              manualTests: data.manualTests,
              automationSkeletons: data.automationSkeletons,
              exports: data.exports,
            })
          } else {
            const historyItem = await historyService.saveToHistory(user.id, {
              story: userMessage,
              framework,
              manualTests: data.manualTests,
              automationSkeletons: data.automationSkeletons,
              exports: data.exports,
              isChatSession: true,
            })
            setCurrentHistoryId(historyItem.id)
          }
          // Refresh sidebar
          if (historyRefreshRef.current) {
            historyRefreshRef.current()
          }
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

  const handleFrameworkChange = async (newFramework) => {
    console.log('Framework changed to:', newFramework)
    setFramework(newFramework)
    if (results && results.manualTests) {
      console.log('Regenerating automation for framework:', newFramework)
      console.log('Current manual tests:', results.manualTests)
      // Regenerate automation skeletons for new framework
      try {
        const response = await fetch('/.netlify/functions/regenerate-automation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            manualTests: results.manualTests,
            framework: newFramework
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Server error:', errorText)
          throw new Error(`Failed to regenerate automation skeleton: ${response.status}`)
        }

        const data = await response.json()
        console.log('Received new automation data:', data)

        // Update results with new automation skeletons and cucumber
        setResults({
          ...results,
          framework: newFramework,
          automationSkeletons: data.automationSkeletons,
          cucumber: data.cucumber,
          exports: {
            ...results.exports,
            cucumber: data.cucumber
          }
        })

        console.log('Results updated successfully')

        // Update database if there's a current session
        if (user && currentHistoryId) {
          await historyService.updateChatSession(currentHistoryId, user.id, {
            story: results.manualTests[0]?.title || 'Chat Session',
            framework: newFramework,
            manualTests: results.manualTests,
            automationSkeletons: data.automationSkeletons,
            exports: {
              ...results.exports,
              cucumber: data.cucumber
            },
          })
          console.log('Database updated successfully')
        }
      } catch (err) {
        console.error('Failed to regenerate automation:', err)
        setError(`Failed to regenerate automation skeleton: ${err.message}`)
      }
    } else {
      console.log('No results or manual tests available')
    }
  }

  const handleNewChat = (newChat) => {
    setCurrentHistoryId(newChat.id)
    setMessages([])
    setResults(null)
    setFramework('playwright')
    setViewMode('split')
    setError(null)
  }

  const handleSelectHistory = (historyItem) => {
    setCurrentHistoryId(historyItem.id)
    setFramework(historyItem.framework)
    setResults({
      manualTests: historyItem.manual_tests,
      automationSkeletons: historyItem.automation_skeletons,
      framework: historyItem.framework,
      cucumber: historyItem.exports?.cucumber || historyItem.cucumber,
      exports: historyItem.exports,
    })
    setViewMode('split')
    setMessages([]) // Could load chat history here if stored
    setError(null)
  }

  return (
    <div className="flex h-screen">
      <HistorySidebar
        onSelectHistory={handleSelectHistory}
        currentHistoryId={currentHistoryId}
        onNewChat={handleNewChat}
        onRefresh={historyRefreshRef}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-6 border-b border-purple-500/20">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white neon-text">
              🚀 Test Suite Generator
            </h1>
            {results && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-4 py-2 rounded-lg transition ${
                    viewMode === 'split'
                      ? 'bg-purple-600 text-white'
                      : 'bg-dark-700/50 text-gray-400 hover:text-white'
                  }`}
                >
                  ⚡ Split
                </button>
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
        </div>

        <div className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-8 py-4">
          {error && (
            <div className="mb-4 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg backdrop-blur-md">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {viewMode === 'split' && (
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="overflow-hidden">
                <ChatInterface
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  loading={loading}
                  framework={framework}
                  onFrameworkChange={handleFrameworkChange}
                />
              </div>
              <div className="overflow-y-auto">
                {results ? (
                  <div>
                    <ResultsTabs results={results} />
                    <ExportButtons results={results} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📋</div>
                      <p>Results will appear here</p>
                    </div>
                  </div>
                )}
              </div>
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
            <div className="h-full overflow-y-auto">
              <ResultsTabs results={results} />
              <ExportButtons results={results} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
