import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useProductAccess } from '../contexts/ProductAccessContext'
import { useAuth } from '../contexts/AuthContext'

export default function AccessStatusBanner() {
  const { hasAccess } = useProductAccess()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showBanner, setShowBanner] = useState(false)
  const [bannerType, setBannerType] = useState(null) // 'granted' or 'revoked'
  const previousAccessRef = useRef(hasAccess)

  useEffect(() => {
    // Only track changes if user is logged in
    if (!user) {
      setShowBanner(false)
      previousAccessRef.current = hasAccess
      return
    }

    const currentPath = location.pathname

    // Don't show banner on home page, login, or public pages
    const publicPages = ['/', '/login', '/privacy', '/terms', '/product-info']
    if (publicPages.includes(currentPath)) {
      previousAccessRef.current = hasAccess
      return
    }

    // Detect LIVE access change (not initial load)
    if (previousAccessRef.current !== null && previousAccessRef.current !== hasAccess) {
      // Access just changed in real-time
      if (hasAccess === false) {
        // Access was just revoked while user was on the page
        setBannerType('revoked')
        setShowBanner(true)

        // Auto-hide and redirect after 2 seconds
        setTimeout(() => {
          setShowBanner(false)
          navigate('/product-info')
        }, 2000)
      } else if (hasAccess === true) {
        // Access was just granted
        setBannerType('granted')
        setShowBanner(true)

        // Auto-hide after 3 seconds
        setTimeout(() => {
          setShowBanner(false)
        }, 3000)
      }
    }

    // Update previous access reference
    previousAccessRef.current = hasAccess
  }, [hasAccess, user, navigate, location.pathname])

  if (!showBanner) return null

  return (
    <div
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-2xl animate-bounce ${
        bannerType === 'granted'
          ? 'bg-green-600 border-2 border-green-400'
          : 'bg-red-600 border-2 border-red-400'
      }`}
      style={{
        animation: 'slideDown 0.3s ease-out'
      }}
    >
      <div className="flex items-center space-x-3">
        <div className="text-3xl">
          {bannerType === 'granted' ? '✅' : '🔒'}
        </div>
        <div>
          <p className="text-white font-bold text-lg">
            {bannerType === 'granted'
              ? 'Access Granted!'
              : 'Access Revoked'}
          </p>
          <p className="text-white text-sm">
            {bannerType === 'granted'
              ? 'You now have access to the workspace'
              : 'Your workspace access has been removed'}
          </p>
        </div>
      </div>
    </div>
  )
}
