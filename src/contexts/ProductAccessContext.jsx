import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { checkProductAccess } from '../services/adminService'

const ProductAccessContext = createContext({})

export const useProductAccess = () => {
  const context = useContext(ProductAccessContext)
  if (!context) {
    throw new Error('useProductAccess must be used within ProductAccessProvider')
  }
  return context
}

export const ProductAccessProvider = ({ children }) => {
  const { user } = useAuth()
  const [hasAccess, setHasAccess] = useState(null)
  const [checking, setChecking] = useState(true)
  const [previousAccess, setPreviousAccess] = useState(null)

  const recheckAccess = async () => {
    if (user) {
      setChecking(true)
      const access = await checkProductAccess(user.id)

      // Check if access changed
      if (previousAccess !== null && previousAccess !== access) {
        // Access changed - show notification
        if (access) {
          console.log('✅ Product access granted!')
          // You can add a toast notification here
        } else {
          console.log('🔒 Product access revoked!')
          // You can add a toast notification here
        }
      }

      setPreviousAccess(hasAccess)
      setHasAccess(access)
      setChecking(false)
    } else {
      setHasAccess(null)
      setChecking(false)
      setPreviousAccess(null)
    }
  }

  useEffect(() => {
    recheckAccess()
  }, [user])

  // Poll for access changes every 1 second for real-time updates
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      recheckAccess()
    }, 1000) // Check every 1 second for immediate updates

    return () => clearInterval(interval)
  }, [user])

  // Also recheck when window gains focus (user comes back to tab)
  useEffect(() => {
    if (!user) return

    const handleFocus = () => {
      recheckAccess()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [user])

  const value = {
    hasAccess,
    checking,
    recheckAccess
  }

  return (
    <ProductAccessContext.Provider value={value}>
      {children}
    </ProductAccessContext.Provider>
  )
}
