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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)

      // Track session if user is logged in
      if (session?.user && session?.access_token) {
        trackSession(session.user.id, session.access_token)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)

      // Track session on sign in
      if (session?.user && session?.access_token) {
        await trackSession(session.user.id, session.access_token)
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
