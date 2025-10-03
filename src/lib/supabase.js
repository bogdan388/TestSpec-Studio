import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'testspec-studio-auth',
    storage: {
      getItem: (key) => {
        const value = window.localStorage.getItem(key)
        console.log('Storage getItem:', key, value ? 'found' : 'not found')
        return value
      },
      setItem: (key, value) => {
        console.log('Storage setItem:', key)
        window.localStorage.setItem(key, value)
      },
      removeItem: (key) => {
        console.log('Storage removeItem:', key)
        window.localStorage.removeItem(key)
      }
    },
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})
