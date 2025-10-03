import { useState, useRef, useEffect } from 'react'

const loadingMessages = [
  '🧠 Brainstorming test scenarios...',
  '🔍 Analyzing edge cases...',
  '🤔 Consulting the QA wisdom...',
  '🎯 Targeting bugs before they exist...',
  '🚀 Launching test generation sequence...',
  '💡 Having an eureka moment...',
  '🔮 Predicting potential failures...',
  '🧪 Mixing the perfect test recipe...',
  '🎨 Painting test scenarios with precision...',
  '🏗️ Building your test fortress...',
  '🕵️ Investigating all possibilities...',
  '⚡ Channeling QA superpowers...',
  '🎭 Crafting test case masterpieces...',
  '🧩 Piecing together the test puzzle...',
  '🎪 Orchestrating the test circus...',
]

function getLoadingMessage() {
  return loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
}

export default function ChatInterface({
  messages,
  onSendMessage,
  loading,
  framework,
  onFrameworkChange
}) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !loading) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
    // Shift+Enter will create a new line naturally
  }

  return (
    <div className="flex flex-col h-full">
      {/* Framework Selector */}
      <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-3 sm:p-4 mb-3 sm:mb-4">
        <label htmlFor="framework" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
          ⚙️ Testing Framework / Language
        </label>
        <select
          id="framework"
          value={framework}
          onChange={(e) => {
            console.log('ChatInterface: Framework select changed to:', e.target.value)
            onFrameworkChange(e.target.value)
          }}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-dark-700/50 border border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          disabled={loading}
        >
          <optgroup label="JavaScript/TypeScript">
            <option value="playwright">Playwright (E2E)</option>
            <option value="cypress">Cypress (E2E)</option>
            <option value="jest">Jest (Unit/Integration)</option>
            <option value="mocha">Mocha (Unit/Integration)</option>
            <option value="jasmine">Jasmine (Unit/BDD)</option>
          </optgroup>
          <optgroup label="Python">
            <option value="pytest">Pytest</option>
            <option value="selenium-python">Selenium (Python)</option>
          </optgroup>
          <optgroup label="Java">
            <option value="selenium-java">Selenium (Java)</option>
            <option value="junit">JUnit 5</option>
            <option value="testng">TestNG</option>
          </optgroup>
          <optgroup label="C#/.NET">
            <option value="nunit">NUnit</option>
            <option value="xunit">xUnit</option>
            <option value="selenium-csharp">Selenium (C#)</option>
          </optgroup>
          <optgroup label="Ruby">
            <option value="rspec">RSpec</option>
            <option value="capybara">Capybara (E2E)</option>
          </optgroup>
          <optgroup label="API Testing">
            <option value="rest-assured">REST Assured (Java)</option>
            <option value="postman">Postman/Newman</option>
          </optgroup>
        </select>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-3 sm:p-4 md:p-6 overflow-y-auto mb-3 sm:mb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">💬</div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">Start a Conversation</h3>
            <p className="text-sm sm:text-base text-gray-400 max-w-md">
              Describe your testing requirements and I'll help you create comprehensive test cases.
            </p>
            <div className="mt-4 sm:mt-6 text-left bg-dark-700/50 rounded-lg p-3 sm:p-4 border border-purple-500/20 w-full max-w-md">
              <p className="text-xs sm:text-sm font-medium text-gray-300 mb-2">💡 Example prompts:</p>
              <ul className="text-xs sm:text-sm text-gray-400 space-y-1">
                <li>• "Create tests for a login feature"</li>
                <li>• "Add edge cases for invalid inputs"</li>
                <li>• "Include password reset tests"</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-3 sm:p-4 ${
                    message.role === 'user'
                      ? 'bg-purple-600/80 text-white'
                      : 'bg-dark-700/80 text-gray-200 border border-purple-500/20'
                  }`}
                >
                  {message.role === 'assistant' && message.testCount && (
                    <div className="text-xs text-purple-400 mb-2">
                      ✨ Generated {message.testCount} test case{message.testCount !== 1 ? 's' : ''}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap text-sm sm:text-base">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-dark-700/80 text-gray-200 border border-purple-500/20 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                    <span className="text-sm sm:text-base">{getLoadingMessage()}</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 md:gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your test requirements... (Shift+Enter for new line)"
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-dark-700/50 border border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 resize-none"
            rows={2}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all shadow-neon disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap"
          >
            {loading ? '⚡ Generating...' : '🚀 Send'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 hidden sm:block">Press Enter to send, Shift+Enter for new line</p>
      </form>
    </div>
  )
}
