import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { checkIsAdmin } from '../services/adminService'

export default function AppLayout({ children }) {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (user) {
      checkIsAdmin().then(setIsAdmin)
    } else {
      setIsAdmin(false)
    }
  }, [user])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const isLegalPage = location.pathname === '/privacy' || location.pathname === '/terms'

  return (
    <div className="min-h-screen flex flex-col test-pattern">
      <header className="bg-dark-900/80 backdrop-blur-md border-b border-purple-500/20 shadow-neon">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-white neon-text glitch">
              ⚡ TestSpec Studio
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-300 hover:text-neon-purple transition">
                Home
              </Link>
              {user ? (
                <>
                  <Link to="/workspace" className="text-gray-300 hover:text-neon-purple transition">
                    Workspace
                  </Link>
                  <Link to="/account" className="text-gray-300 hover:text-neon-purple transition">
                    Account
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="text-yellow-400 hover:text-yellow-300 transition font-semibold">
                      🛡️ Admin
                    </Link>
                  )}
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400">{user.email}</span>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition shadow-neon"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition shadow-neon"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {!isLegalPage && (
        <footer className="bg-dark-900/80 backdrop-blur-md border-t border-purple-500/20 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center text-gray-400 text-sm">
              <p>&copy; 2024 TestSpec Studio. AI-powered test generation.</p>
              <div className="flex space-x-4">
                <Link to="/privacy" className="hover:text-neon-purple transition">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-neon-purple transition">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
