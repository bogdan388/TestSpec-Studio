import { Link } from 'react-router-dom'

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              TestSpec Studio
            </Link>
            <div className="space-x-4">
              <Link to="/" className="text-gray-600 hover:text-primary transition">
                Home
              </Link>
              <Link to="/workspace" className="text-gray-600 hover:text-primary transition">
                Workspace
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600">
          <p>&copy; 2024 TestSpec Studio. Convert user stories into structured test suites.</p>
        </div>
      </footer>
    </div>
  )
}
