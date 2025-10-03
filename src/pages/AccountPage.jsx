import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { getUserSessions, deleteSession } from '../services/sessionService'

export default function AccountPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [sessionsLoading, setSessionsLoading] = useState(true)
  const [sessions, setSessions] = useState([])
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (user?.id) {
      loadSessions()
    }
  }, [user?.id])

  const loadSessions = async () => {
    setSessionsLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const currentToken = session?.access_token

      // Get all sessions from database
      const allSessions = await getUserSessions(user.id)

      // Mark current session
      const sessionsWithCurrent = allSessions.map(s => ({
        ...s,
        current: s.session_token === currentToken,
        device: s.device_info,
        lastActive: s.last_active
      }))

      setSessions(sessionsWithCurrent)
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      setSessionsLoading(false)
    }
  }

  const handleSetPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      if (error) throw error
      setMessage({ type: 'success', text: 'Password set successfully!' })
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordForm(false)
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async (sessionId, isCurrent) => {
    try {
      // Delete session from database
      await deleteSession(sessionId)

      // If it's the current session, sign out from Supabase
      if (isCurrent) {
        await supabase.auth.signOut()
      } else {
        // Just reload sessions list for remote sign out
        await loadSessions()
        setMessage({ type: 'success', text: 'Device signed out successfully' })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      }
    } catch (error) {
      console.error('Error signing out:', error)
      setMessage({ type: 'error', text: 'Failed to sign out device' })
    }
  }

  const isGoogleUser = user?.app_metadata?.provider === 'google'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-white mb-8 neon-text">
        👤 Account Management
      </h1>

      {/* User Profile Section */}
      <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-6 mb-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            {user?.user_metadata?.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                alt="Avatar"
                className="w-16 h-16 rounded-full border-2 border-purple-500"
              />
            )}
            <div>
              <p className="text-white font-semibold">
                {user?.user_metadata?.full_name || user?.email}
              </p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              <p className="text-gray-500 text-xs mt-1">
                {isGoogleUser ? '🔐 Signed in with Google' : '📧 Email account'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Management */}
      <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-6 mb-6">
        <h2 className="text-2xl font-semibold text-white mb-4">🔑 Password Management</h2>

        {isGoogleUser && (
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-4">
            <p className="text-blue-200 text-sm">
              💡 You're signed in with Google. Setting a password will allow you to also sign in with email/password.
            </p>
          </div>
        )}

        {!showPasswordForm ? (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition shadow-neon"
          >
            {isGoogleUser ? 'Set Password' : 'Change Password'}
          </button>
        ) : (
          <form onSubmit={handleSetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 bg-dark-700/50 border border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-dark-700/50 border border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                required
                minLength={6}
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition shadow-neon disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Password'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false)
                  setNewPassword('')
                  setConfirmPassword('')
                  setMessage({ type: '', text: '' })
                }}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {message.text && (
          <div className={`mt-4 p-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-900/30 border border-green-500/30 text-green-200'
              : 'bg-red-900/30 border border-red-500/30 text-red-200'
          }`}>
            {message.text}
          </div>
        )}
      </div>

      {/* Connected Devices/Sessions */}
      <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">💻 Connected Devices</h2>
        {sessionsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-gray-400 text-sm">No active sessions found.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-dark-700/50 rounded-lg p-4 border border-purple-500/20 flex justify-between items-start"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-white font-medium">
                      {session.current ? 'This Device' : 'Other Device'}
                    </span>
                    {session.current && (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded">
                        Active Now
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-1">
                    {session.device}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Last active: {new Date(session.lastActive).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleSignOut(session.id, session.current)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg transition"
                >
                  {session.current ? 'Sign Out' : 'Remove'}
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="text-gray-400 text-xs mt-4">
          💡 Sessions are tracked across all your devices. Sign out remotely to revoke access.
        </p>
      </div>
    </div>
  )
}
