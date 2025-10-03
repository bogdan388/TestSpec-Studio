import { useState, useRef, useEffect } from 'react'

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
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Framework Selector */}
      <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-4 mb-4">
        <label htmlFor="framework" className="block text-sm font-medium text-gray-300 mb-2">
          ⚙️ Testing Framework / Language
        </label>
        <select
          id="framework"
          value={framework}
          onChange={(e) => onFrameworkChange(e.target.value)}
          className="w-full px-4 py-2 bg-dark-700/50 border border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
      <div className="flex-1 bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-6 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-2xl font-bold text-white mb-2">Start a Conversation</h3>
            <p className="text-gray-400 max-w-md">
              Describe your testing requirements and I'll help you create comprehensive test cases.
              You can refine them by asking for changes, additions, or improvements.
            </p>
            <div className="mt-6 text-left bg-dark-700/50 rounded-lg p-4 border border-purple-500/20">
              <p className="text-sm font-medium text-gray-300 mb-2">💡 Example prompts:</p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• "Create tests for a login feature with email and password"</li>
                <li>• "Add edge cases for invalid inputs"</li>
                <li>• "Include tests for password reset functionality"</li>
                <li>• "Make the tests more detailed with specific assertions"</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
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
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-dark-700/80 text-gray-200 border border-purple-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-4">
        <div className="flex items-center space-x-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your test requirements or ask for changes... (Shift+Enter for new line)"
            className="flex-1 px-4 py-3 bg-dark-700/50 border border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 resize-none"
            rows={3}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all shadow-neon disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? '⚡ Generating...' : '🚀 Send'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
      </form>
    </div>
  )
}
