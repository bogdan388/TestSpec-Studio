import { useState } from 'react'

export default function StoryInput({ onGenerate, loading }) {
  const [story, setStory] = useState('')
  const [framework, setFramework] = useState('playwright')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (story.trim()) {
      onGenerate(story, framework)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="story" className="block text-sm font-medium text-gray-700 mb-2">
            User Story / Acceptance Criteria
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="framework" className="block text-sm font-medium text-gray-700 mb-2">
            Automation Framework
          </label>
          <select
            id="framework"
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={loading}
          >
            <option value="playwright">Playwright</option>
            <option value="jest">Jest</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !story.trim()}
          className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 px-6 rounded-lg transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate Test Suite'}
        </button>
      </form>
    </div>
  )
}
