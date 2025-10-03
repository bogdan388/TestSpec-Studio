import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductAccess } from '../contexts/ProductAccessContext'
import { useAuth } from '../contexts/AuthContext'

export default function AccessStatusBanner() {
  const { hasAccess } = useProductAccess()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showBanner, setShowBanner] = useState(false)
  const [bannerType, setBannerType] = useState(null) // 'granted' or 'revoked'

  useEffect(() => {
    // Only show banner if user is logged in and on workspace/account pages
    if (!user) {
      setShowBanner(false)
      return
    }

    const currentPath = window.location.pathname

    // If access is false and user is not on product-info page, they're being redirected
    if (hasAccess === false && currentPath !== '/product-info' && currentPath !== '/login') {
      setBannerType('revoked')
      setShowBanner(true)

      // Auto-hide and redirect after 2 seconds
      setTimeout(() => {
        setShowBanner(false)
        navigate('/product-info')
      }, 2000)
    }

    // If access is true and they just got access
    if (hasAccess === true && currentPath === '/product-info') {
      setBannerType('granted')
      setShowBanner(true)

      // Auto-hide after 3 seconds
      setTimeout(() => {
        setShowBanner(false)
      }, 3000)
    }
  }, [hasAccess, user, navigate])

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
