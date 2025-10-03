import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          TestSpec Studio
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Transform user stories and acceptance criteria into comprehensive test suites
        </p>
        <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
          Automate your test design process. Generate manual test cases,
          automation skeletons in Playwright or Jest, and export everything
          as structured documentation.
        </p>

        <button
          onClick={() => navigate('/workspace')}
          className="bg-primary hover:bg-secondary text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          Generate Test Suite
        </button>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Manual Test Cases
            </h3>
            <p className="text-gray-600">
              Step-by-step manual test cases with expected results in CSV and Markdown formats
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Automation Ready
            </h3>
            <p className="text-gray-600">
              Generate Playwright or Jest test skeletons ready for your automation framework
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Export Bundle
            </h3>
            <p className="text-gray-600">
              Download everything as a ZIP file with CSV, Markdown, and code skeletons
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
