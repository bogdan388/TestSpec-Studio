import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { trackSession, updateSessionActivity } from '../services/sessionService'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions
    const initAuth = async () => {
      console.log('Initializing auth...')
      try {
        console.log('Calling getSession...')

        // Add timeout to prevent infinite hanging
        const getSessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('getSession timeout')), 5000)
        )

        const result = await Promise.race([getSessionPromise, timeoutPromise])
        console.log('getSession result:', result)

        const { data: { session }, error } = result

        if (error) {
          console.error('Auth error:', error)
          setUser(null)
          setLoading(false)
          return
        }

        console.log('Session restored:', session ? 'Yes' : 'No')
        setUser(session?.user ?? null)
        setLoading(false)

        // Track session AFTER auth is initialized (delayed to avoid blocking)
        if (session?.user && session?.access_token) {
          setTimeout(() => {
            trackSession(session.user.id, session.access_token).catch(err => {
              console.error('Session tracking error:', err)
            })
          }, 1000)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setUser(null)
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event)
      setUser(session?.user ?? null)

      // Track session on SIGN_IN event only (delayed to avoid blocking)
      if (event === 'SIGNED_IN' && session?.user && session?.access_token) {
        setTimeout(() => {
          trackSession(session.user.id, session.access_token).catch(error => {
            console.error('Session tracking error:', error)
          })
        }, 1000)
      }
    })

    // Update session activity every 5 minutes
    const activityInterval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        updateSessionActivity(session.access_token)
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => {
      subscription.unsubscribe()
      clearInterval(activityInterval)
    }
  }, [])

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/workspace`,
      },
    })
    if (error) throw error
    return data
  }

  const signInWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const signUpWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/workspace`,
      },
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error} = await supabase.auth.signOut()
    if (error) throw error
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
