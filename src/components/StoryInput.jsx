import { useState, useEffect } from 'react'

export default function StoryInput({ onGenerate, loading, initialStory = '', initialFramework = 'playwright' }) {
  const [story, setStory] = useState(initialStory)
  const [framework, setFramework] = useState(initialFramework)

  useEffect(() => {
    setStory(initialStory)
    setFramework(initialFramework)
  }, [initialStory, initialFramework])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (story.trim()) {
      onGenerate(story, framework)
    }
  }

  return (
    <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="story" className="block text-sm font-medium text-gray-300 mb-2">
            📝 User Story / Acceptance Criteria
          </label>
          <textarea
            id="story"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Paste your user story or acceptance criteria here...

Example:
As a registered user, I want to login so I can access my account.

Acceptance Criteria:
- Valid credentials allow successful login
- Invalid credentials show error message
- Password field is masked
- Remember me option persists session"
            rows={12}
            className="w-full px-4 py-3 bg-dark-700/50 border border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none placeholder-gray-500"
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="framework" className="block text-sm font-medium text-gray-300 mb-2">
            ⚙️ Testing Framework / Language
          </label>
          <select
            id="framework"
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
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

        <button
          type="submit"
          disabled={loading || !story.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-neon disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02]"
        >
          {loading ? '⚡ Generating...' : '🚀 Generate Test Suite'}
        </button>
      </form>
    </div>
  )
}
