import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProductInfoPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-purple-900/20 to-dark-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 neon-text">
            ⚡ TestSpec Studio
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            AI-Powered Test Case Generation Platform
          </p>
          <p className="text-lg text-gray-400">
            Transform user stories into comprehensive test suites in seconds
          </p>
        </div>

        {/* Product Access Notice */}
        {user && (
          <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-6 mb-12">
            <div className="flex items-start">
              <div className="text-3xl mr-4">🔒</div>
              <div>
                <h3 className="text-xl font-semibold text-yellow-200 mb-2">
                  Product Access Required
                </h3>
                <p className="text-yellow-100 mb-3">
                  You currently don't have access to the TestSpec Studio workspace.
                  Contact your administrator to request access or learn more about what you can do with TestSpec Studio below.
                </p>
                <p className="text-yellow-200 text-sm">
                  Logged in as: <span className="font-mono">{user.email}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-6">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Generation</h3>
            <p className="text-gray-300">
              Leverage Google Gemini AI to automatically generate comprehensive test cases from your user stories and acceptance criteria.
            </p>
          </div>

          <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-6">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold text-white mb-3">Multi-Framework Support</h3>
            <p className="text-gray-300">
              Generate automation skeletons for Playwright, Jest, and more. Get ready-to-use code templates with proper structure and best practices.
            </p>
          </div>

          <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-6">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-white mb-3">Manual Test Cases</h3>
            <p className="text-gray-300">
              Get detailed step-by-step manual test cases with expected results, preconditions, and test data requirements.
            </p>
          </div>

          <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-6">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-white mb-3">Multiple Export Formats</h3>
            <p className="text-gray-300">
              Export your test suites as CSV, Markdown, or complete ZIP bundles. Perfect for integration with test management tools.
            </p>
          </div>

          <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-3">Test History Tracking</h3>
            <p className="text-gray-300">
              All generated tests are automatically saved to your history. Track, review, and reuse past test generations.
            </p>
          </div>

          <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-6">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-3">Edge Case Coverage</h3>
            <p className="text-gray-300">
              AI automatically identifies and generates test cases for positive, negative, and edge case scenarios you might miss.
            </p>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Perfect For</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="text-2xl">👨‍💻</div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">QA Engineers</h4>
                <p className="text-gray-300">
                  Speed up test case creation by 10x. Focus on actual testing instead of documentation.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-2xl">🏢</div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Development Teams</h4>
                <p className="text-gray-300">
                  Ensure consistent test coverage across all features. Standardize testing practices.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-2xl">🚀</div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Startups</h4>
                <p className="text-gray-300">
                  Build quality into your product from day one without hiring a large QA team.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-2xl">📱</div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Product Managers</h4>
                <p className="text-gray-300">
                  Validate requirements with comprehensive test scenarios before development starts.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-2xl">🎓</div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Students & Learners</h4>
                <p className="text-gray-300">
                  Learn testing best practices by seeing how AI structures professional test cases.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-2xl">🔄</div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Agile Teams</h4>
                <p className="text-gray-300">
                  Generate test cases instantly as stories are written. Keep pace with rapid development.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Example Use Case */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">How It Works</h2>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Input Your User Story</h4>
                <p className="text-gray-300">
                  Paste your user story, acceptance criteria, or feature description into the workspace.
                </p>
                <div className="mt-3 bg-dark-900/50 rounded p-3 text-sm text-gray-400 font-mono">
                  Example: "As a user, I want to reset my password so that I can regain access to my account if I forget it."
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Select Your Framework</h4>
                <p className="text-gray-300">
                  Choose your preferred automation framework (Playwright, Jest, Cypress, etc.)
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Generate & Review</h4>
                <p className="text-gray-300">
                  AI generates comprehensive test cases including positive, negative, and edge cases in seconds.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Export & Execute</h4>
                <p className="text-gray-300">
                  Download your tests in your preferred format and start testing immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-green-500/30 p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Key Benefits</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <div className="text-green-400 text-2xl">✓</div>
              <p className="text-gray-300"><strong className="text-white">Save 90% of time</strong> on test case creation</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-green-400 text-2xl">✓</div>
              <p className="text-gray-300"><strong className="text-white">Improve coverage</strong> with AI-detected edge cases</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-green-400 text-2xl">✓</div>
              <p className="text-gray-300"><strong className="text-white">Standardize</strong> test documentation across team</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-green-400 text-2xl">✓</div>
              <p className="text-gray-300"><strong className="text-white">Free up time</strong> for exploratory testing</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-green-400 text-2xl">✓</div>
              <p className="text-gray-300"><strong className="text-white">Reduce defects</strong> with comprehensive scenarios</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-green-400 text-2xl">✓</div>
              <p className="text-gray-300"><strong className="text-white">Accelerate delivery</strong> with faster test creation</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          {user ? (
            <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
              <p className="text-gray-300 mb-6">
                Contact your administrator to request access to TestSpec Studio
              </p>
              <Link
                to="/account"
                className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition shadow-neon font-semibold"
              >
                Go to Account Settings
              </Link>
            </div>
          ) : (
            <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Get Started Today</h3>
              <p className="text-gray-300 mb-6">
                Sign up now and contact your administrator for product access
              </p>
              <Link
                to="/login"
                className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition shadow-neon font-semibold"
              >
                Sign Up / Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
