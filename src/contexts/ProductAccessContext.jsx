import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
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
  const previousAccessRef = useRef(null)

  const recheckAccess = useCallback(async () => {
    if (user) {
      setChecking(true)
      const access = await checkProductAccess(user.id)

      // Check if access changed
      if (previousAccessRef.current !== null && previousAccessRef.current !== access) {
        // Access changed - show notification
        if (access) {
          console.log('✅ Product access granted!')
        } else {
          console.log('🔒 Product access revoked!')
        }
      }

      previousAccessRef.current = access
      setHasAccess(access)
      setChecking(false)
    } else {
      setHasAccess(null)
      setChecking(false)
      previousAccessRef.current = null
    }
  }, [user])

  useEffect(() => {
    recheckAccess()
  }, [recheckAccess])

  // Poll for access changes every 1 second for real-time updates
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      recheckAccess()
    }, 1000) // Check every 1 second for immediate updates

    return () => clearInterval(interval)
  }, [user, recheckAccess])

  // Also recheck when window gains focus (user comes back to tab)
  useEffect(() => {
    if (!user) return

    const handleFocus = () => {
      recheckAccess()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [user, recheckAccess])

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
