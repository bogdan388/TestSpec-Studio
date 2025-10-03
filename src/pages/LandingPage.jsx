import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <div className="relative">
          <h1 className="text-6xl font-extrabold text-white mb-6 neon-text animate-float">
            ⚡ TestSpec Studio
          </h1>
          <div className="absolute inset-0 blur-3xl bg-purple-600 opacity-20 animate-pulse-slow"></div>
        </div>

        <p className="text-2xl text-neon-purple mb-8">
          AI-Powered Test Generation for QA Engineers
        </p>
        <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
          Transform user stories into comprehensive test suites with AI.
          Generate manual test cases, automation skeletons, and export everything
          in seconds. Built for the future of QA.
        </p>

        <button
          onClick={() => navigate('/workspace')}
          className="relative group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-10 rounded-lg shadow-neon-lg transition-all duration-300 transform hover:scale-105 animate-glow"
        >
          <span className="relative z-10">Start Generating Tests →</span>
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-30 blur transition-opacity"></div>
        </button>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative group bg-dark-800/60 backdrop-blur-md p-8 rounded-xl border border-purple-500/30 hover:border-purple-400 transition-all duration-300 hover:shadow-neon">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Manual Test Cases
            </h3>
            <p className="text-gray-300">
              AI-generated step-by-step test cases with expected results. Export as CSV or Markdown.
            </p>
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition"></div>
          </div>

          <div className="relative group bg-dark-800/60 backdrop-blur-md p-8 rounded-xl border border-purple-500/30 hover:border-purple-400 transition-all duration-300 hover:shadow-neon">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Automation Ready
            </h3>
            <p className="text-gray-300">
              Generate Playwright or Jest skeletons ready for your CI/CD pipeline. No manual writing.
            </p>
            <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition"></div>
          </div>

          <div className="relative group bg-dark-800/60 backdrop-blur-md p-8 rounded-xl border border-purple-500/30 hover:border-purple-400 transition-all duration-300 hover:shadow-neon">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Export Bundle
            </h3>
            <p className="text-gray-300">
              Download complete packages with CSV, Markdown docs, and automation code in one ZIP.
            </p>
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition"></div>
          </div>
        </div>

        <div className="mt-20 bg-dark-800/40 backdrop-blur-md rounded-2xl p-10 border border-purple-500/20">
          <h2 className="text-3xl font-bold text-white mb-6 neon-text">
            Powered by AI 🤖
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Using Google Gemini AI to understand your requirements and generate
            comprehensive, context-aware test cases. From positive scenarios to edge cases.
          </p>
        </div>
      </div>
    </div>
  )
}
