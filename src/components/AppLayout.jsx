import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useProductAccess } from '../contexts/ProductAccessContext'
import { checkIsAdmin } from '../services/adminService'
import AccessStatusBanner from './AccessStatusBanner'

export default function AppLayout({ children }) {
  const { user, signOut } = useAuth()
  const { hasAccess: hasProductAccess } = useProductAccess()
  const location = useLocation()
  const [isAdmin, setIsAdmin] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      setMobileMenuOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const isLegalPage = location.pathname === '/privacy' || location.pathname === '/terms'

  return (
    <div className="min-h-screen flex flex-col test-pattern">
      <AccessStatusBanner />
      <header className="bg-dark-900/80 backdrop-blur-md border-b border-purple-500/20 shadow-neon">
        <nav className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-lg sm:text-xl md:text-2xl font-bold text-white neon-text glitch truncate">
              ⚡ TestSpec Studio
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-6">
              <Link to="/" className="text-sm lg:text-base text-gray-300 hover:text-neon-purple transition whitespace-nowrap">
                Home
              </Link>
              {user ? (
                <>
                  {hasProductAccess ? (
                    <Link to="/workspace" className="text-sm lg:text-base text-gray-300 hover:text-neon-purple transition whitespace-nowrap">
                      Workspace
                    </Link>
                  ) : (
                    <Link to="/product-info" className="text-sm lg:text-base text-orange-300 hover:text-orange-200 transition whitespace-nowrap">
                      Get Access
                    </Link>
                  )}
                  <Link to="/account" className="text-sm lg:text-base text-gray-300 hover:text-neon-purple transition whitespace-nowrap">
                    Account
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="text-sm lg:text-base text-yellow-400 hover:text-yellow-300 transition font-semibold whitespace-nowrap">
                      🛡️ Admin
                    </Link>
                  )}
                  <div className="flex items-center space-x-2 lg:space-x-4">
                    <span className="text-xs lg:text-sm text-gray-400 hidden lg:inline truncate max-w-[150px]">{user.email}</span>
                    <button
                      onClick={handleSignOut}
                      className="px-3 py-2 text-sm bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition shadow-neon whitespace-nowrap"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-3 lg:px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition shadow-neon whitespace-nowrap"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-2 space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-gray-300 hover:text-neon-purple transition"
              >
                Home
              </Link>
              {user ? (
                <>
                  {hasProductAccess && (
                    <Link
                      to="/workspace"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-gray-300 hover:text-neon-purple transition"
                    >
                      Workspace
                    </Link>
                  )}
                  {!hasProductAccess && (
                    <Link
                      to="/product-info"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-orange-300 hover:text-orange-200 transition"
                    >
                      Get Access
                    </Link>
                  )}
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-300 hover:text-neon-purple transition"
                  >
                    Account
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-yellow-400 hover:text-yellow-300 transition font-semibold"
                    >
                      🛡️ Admin
                    </Link>
                  )}
                  <div className="pt-2 border-t border-purple-500/20">
                    <p className="text-xs text-gray-400 mb-2 truncate">{user.email}</p>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition shadow-neon"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition shadow-neon text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          )}
        </nav>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {!isLegalPage && (
        <footer className="bg-dark-900/80 backdrop-blur-md border-t border-purple-500/20 mt-8 sm:mt-12">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 text-gray-400 text-xs sm:text-sm">
              <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} TestSpec Studio</p>
              <div className="flex space-x-3 sm:space-x-4">
                <Link to="/privacy" className="hover:text-neon-purple transition whitespace-nowrap">
                  Privacy
                </Link>
                <Link to="/terms" className="hover:text-neon-purple transition whitespace-nowrap">
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
