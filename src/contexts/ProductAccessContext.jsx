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

  const recheckAccess = async () => {
    if (user) {
      setChecking(true)
      const access = await checkProductAccess(user.id)
      setHasAccess(access)
      setChecking(false)
    } else {
      setHasAccess(null)
      setChecking(false)
    }
  }

  useEffect(() => {
    recheckAccess()
  }, [user])

  // Poll for access changes every 5 seconds
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      recheckAccess()
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
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
