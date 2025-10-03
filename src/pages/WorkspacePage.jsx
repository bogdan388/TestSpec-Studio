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
  const [showHistorySidebar, setShowHistorySidebar] = useState(false)
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
    setShowHistorySidebar(false) // Close sidebar on mobile after selection
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
    setShowHistorySidebar(false) // Close sidebar on mobile after selection
  }

  return (
    <div className="flex flex-col md:flex-row h-screen relative">
      {/* Mobile history sidebar overlay */}
      {showHistorySidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowHistorySidebar(false)}
        />
      )}

      {/* History sidebar */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-50 md:z-0
        transform transition-transform duration-300 ease-in-out
        ${showHistorySidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <HistorySidebar
          onSelectHistory={handleSelectHistory}
          currentHistoryId={currentHistoryId}
          onNewChat={handleNewChat}
          onRefresh={historyRefreshRef}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 border-b border-purple-500/20">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              {/* Mobile history toggle button */}
              <button
                onClick={() => setShowHistorySidebar(!showHistorySidebar)}
                className="md:hidden p-2 text-purple-400 hover:text-purple-300 flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white neon-text truncate">
                🚀 Test Suite
              </h1>
            </div>

            {results && (
              <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                <button
                  onClick={() => setViewMode('split')}
                  className={`hidden lg:block px-3 sm:px-4 py-2 rounded-lg transition text-sm ${
                    viewMode === 'split'
                      ? 'bg-purple-600 text-white'
                      : 'bg-dark-700/50 text-gray-400 hover:text-white'
                  }`}
                >
                  ⚡ Split
                </button>
                <button
                  onClick={() => setViewMode('chat')}
                  className={`px-2 sm:px-3 md:px-4 py-2 rounded-lg transition text-xs sm:text-sm ${
                    viewMode === 'chat'
                      ? 'bg-purple-600 text-white'
                      : 'bg-dark-700/50 text-gray-400 hover:text-white'
                  }`}
                >
                  💬 <span className="hidden sm:inline">Chat</span>
                </button>
                <button
                  onClick={() => setViewMode('results')}
                  className={`px-2 sm:px-3 md:px-4 py-2 rounded-lg transition text-xs sm:text-sm ${
                    viewMode === 'results'
                      ? 'bg-purple-600 text-white'
                      : 'bg-dark-700/50 text-gray-400 hover:text-white'
                  }`}
                >
                  📋 <span className="hidden sm:inline">Results</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden px-2 sm:px-3 md:px-4 lg:px-8 py-2 sm:py-3 md:py-4">
          {error && (
            <div className="mb-4 bg-red-900/50 border border-red-500 text-red-200 px-3 sm:px-4 py-2 sm:py-3 rounded-lg backdrop-blur-md text-sm">
              <p className="font-semibold">Error:</p>
              <p className="text-xs sm:text-sm">{error}</p>
            </div>
          )}

          {/* Split view - only on desktop */}
          {viewMode === 'split' && (
            <div className="hidden lg:grid lg:grid-cols-2 gap-4 h-full">
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

          {/* Chat view */}
          {(viewMode === 'chat' || (viewMode === 'split' && window.innerWidth < 1024)) && (
            <div className="h-full">
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                loading={loading}
                framework={framework}
                onFrameworkChange={handleFrameworkChange}
              />
            </div>
          )}

          {/* Results view */}
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
