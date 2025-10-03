import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  checkIsSuperAdmin,
  getAdminStats,
  getUsersDetailed,
  getTestHistoryGroupedByUser,
  getSessionsGroupedByUser,
  getAdminActivityLogs,
  banUser,
  unbanUser,
  sendPasswordReset,
  deleteUserData,
  grantProductAccess,
  revokeProductAccess
} from '../services/adminService'

export default function AdminDashboardEnhanced() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState({ totalUsers: 0, totalTests: 0, activeSessions: 0 })
  const [users, setUsers] = useState([])
  const [testHistoryGrouped, setTestHistoryGrouped] = useState({})
  const [sessionsGrouped, setSessionsGrouped] = useState({})
  const [activityLogs, setActivityLogs] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    checkAdminAccess()
  }, [user])

  const checkAdminAccess = async () => {
    setLoading(true)
    const adminStatus = await checkIsSuperAdmin()

    if (!adminStatus) {
      navigate('/workspace')
      return
    }

    setIsAdmin(true)
    await loadData()
    setLoading(false)
  }

  const loadData = async () => {
    const [statsData, usersData, historyData, sessionsData, logsData] = await Promise.all([
      getAdminStats(),
      getUsersDetailed(searchQuery, filterStatus),
      getTestHistoryGroupedByUser(),
      getSessionsGroupedByUser(),
      getAdminActivityLogs(50)
    ])

    setStats(statsData)
    setUsers(usersData)
    setTestHistoryGrouped(historyData)
    setSessionsGrouped(sessionsData)
    setActivityLogs(logsData)
  }

  useEffect(() => {
    if (isAdmin) {
      loadData()
    }
  }, [searchQuery, filterStatus])

  const handleBanUser = async (userId) => {
    const reason = prompt('Enter reason for banning this user:')
    if (!reason) return

    setActionLoading(true)
    const result = await banUser(userId, reason)

    if (result.success) {
      setMessage({ type: 'success', text: 'User banned successfully' })
      await loadData()
    } else {
      setMessage({ type: 'error', text: result.error })
    }
    setActionLoading(false)
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const handleUnbanUser = async (userId) => {
    if (!confirm('Are you sure you want to unban this user?')) return

    setActionLoading(true)
    const result = await unbanUser(userId)

    if (result.success) {
      setMessage({ type: 'success', text: 'User unbanned successfully' })
      await loadData()
    } else {
      setMessage({ type: 'error', text: result.error })
    }
    setActionLoading(false)
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const handlePasswordReset = async (userId) => {
    if (!confirm('Reset password for this user?')) return

    setActionLoading(true)
    const result = await sendPasswordReset(userId)

    if (result.success) {
      setMessage({ type: 'success', text: result.message })
    } else {
      setMessage({ type: 'error', text: result.error })
    }
    setActionLoading(false)
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  const handleDeleteUserData = async (userId) => {
    if (!confirm('This will delete ALL data for this user (tests, sessions). Continue?')) return

    setActionLoading(true)
    const result = await deleteUserData(userId)

    if (result.success) {
      setMessage({ type: 'success', text: 'User data deleted successfully' })
      await loadData()
      setSelectedUser(null)
    } else {
      setMessage({ type: 'error', text: result.error })
    }
    setActionLoading(false)
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const handleGrantAccess = async (userId) => {
    if (!confirm('Grant product access to this user?')) return

    setActionLoading(true)
    const result = await grantProductAccess(userId)

    if (result.success) {
      setMessage({ type: 'success', text: 'Product access granted successfully' })
      await loadData()
    } else {
      setMessage({ type: 'error', text: result.error })
    }
    setActionLoading(false)
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const handleRevokeAccess = async (userId) => {
    if (!confirm('Revoke product access from this user? They will no longer be able to use the workspace.')) return

    setActionLoading(true)
    const result = await revokeProductAccess(userId)

    if (result.success) {
      setMessage({ type: 'success', text: 'Product access revoked successfully' })
      await loadData()
    } else {
      setMessage({ type: 'error', text: result.error })
    }
    setActionLoading(false)
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  const userTestHistory = selectedUser ? testHistoryGrouped[selectedUser.id] || [] : []
  const userSessions = selectedUser ? sessionsGrouped[selectedUser.id] || [] : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-white mb-8 neon-text">
        🛡️ Super Admin Dashboard
      </h1>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-900/30 border border-green-500/30 text-green-200'
            : 'bg-red-900/30 border border-red-500/30 text-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-white mt-2">{users.length}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Tests Generated</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.totalTests}</p>
            </div>
            <div className="text-4xl">🧪</div>
          </div>
        </div>

        <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Sessions</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.activeSessions}</p>
            </div>
            <div className="text-4xl">🔐</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <div className="lg:col-span-1">
          <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Users</h2>

            {/* Search and Filter */}
            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Search by email or user ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-dark-700 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-dark-700 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Users</option>
                <option value="active">Active Only</option>
                <option value="banned">Banned Only</option>
              </select>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {users.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No users found</p>
              ) : (
                users.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`p-4 rounded-lg cursor-pointer transition ${
                      selectedUser?.id === u.id
                        ? 'bg-purple-600/30 border-2 border-purple-500'
                        : 'bg-dark-700/50 border border-purple-500/20 hover:bg-dark-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {u.email}
                          {u.isBanned && <span className="ml-2 text-red-400 text-xs">🚫 BANNED</span>}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {u.id.substring(0, 8)}...
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Tests: {u.testCount} • Sessions: {u.sessionCount}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="lg:col-span-2">
          {selectedUser ? (
            <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    User Details
                    {selectedUser.isBanned && <span className="ml-3 text-red-400">🚫 BANNED</span>}
                  </h2>
                  <p className="text-gray-400 mt-1">ID: {selectedUser.id}</p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {selectedUser.isBanned && (
                <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-6">
                  <p className="text-red-200 font-semibold">Ban Reason:</p>
                  <p className="text-red-300 mt-1">{selectedUser.banReason}</p>
                </div>
              )}

              {/* Product Access Status */}
              <div className={`border rounded-lg p-4 mb-6 ${
                selectedUser.hasProductAccess
                  ? 'bg-green-900/20 border-green-500/30'
                  : 'bg-orange-900/20 border-orange-500/30'
              }`}>
                <p className={`font-semibold ${
                  selectedUser.hasProductAccess ? 'text-green-200' : 'text-orange-200'
                }`}>
                  Product Access: {selectedUser.hasProductAccess ? '✅ Enabled' : '🔒 Disabled'}
                </p>
                <p className={`text-sm mt-1 ${
                  selectedUser.hasProductAccess ? 'text-green-300' : 'text-orange-300'
                }`}>
                  {selectedUser.hasProductAccess
                    ? 'User can access the workspace and generate tests'
                    : 'User cannot access the workspace - will see product info page'}
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {selectedUser.hasProductAccess ? (
                  <button
                    onClick={() => handleRevokeAccess(selectedUser.id)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition disabled:opacity-50"
                  >
                    🔒 Revoke Access
                  </button>
                ) : (
                  <button
                    onClick={() => handleGrantAccess(selectedUser.id)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition disabled:opacity-50"
                  >
                    ✅ Grant Access
                  </button>
                )}

                {selectedUser.isBanned ? (
                  <button
                    onClick={() => handleUnbanUser(selectedUser.id)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition disabled:opacity-50"
                  >
                    ✅ Unban User
                  </button>
                ) : (
                  <button
                    onClick={() => handleBanUser(selectedUser.id)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition disabled:opacity-50"
                  >
                    🚫 Ban User
                  </button>
                )}
                <button
                  onClick={() => handlePasswordReset(selectedUser.id)}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition disabled:opacity-50"
                >
                  🔑 Reset Password
                </button>
                <button
                  onClick={() => handleDeleteUserData(selectedUser.id)}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 col-span-2"
                >
                  🗑️ Delete All User Data
                </button>
              </div>

              {/* Tabs for User Data */}
              <div className="border-t border-purple-500/30 pt-6">
                <div className="flex space-x-4 mb-4">
                  <button
                    onClick={() => setActiveTab('tests')}
                    className={`px-4 py-2 rounded-lg transition ${
                      activeTab === 'tests'
                        ? 'bg-purple-600 text-white'
                        : 'bg-dark-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    Test History ({userTestHistory.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('sessions')}
                    className={`px-4 py-2 rounded-lg transition ${
                      activeTab === 'sessions'
                        ? 'bg-purple-600 text-white'
                        : 'bg-dark-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    Sessions ({userSessions.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`px-4 py-2 rounded-lg transition ${
                      activeTab === 'activity'
                        ? 'bg-purple-600 text-white'
                        : 'bg-dark-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    Activity Logs
                  </button>
                </div>

                {activeTab === 'tests' && (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {userTestHistory.length === 0 ? (
                      <p className="text-gray-400">No test history</p>
                    ) : (
                      userTestHistory.map((test) => (
                        <div key={test.id} className="bg-dark-700/50 rounded-lg p-4 border border-purple-500/20">
                          <p className="text-white font-medium">{test.story.substring(0, 100)}...</p>
                          <p className="text-gray-400 text-sm mt-2">
                            {test.framework} • {test.manual_tests?.length || 0} tests •
                            {new Date(test.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'sessions' && (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {userSessions.length === 0 ? (
                      <p className="text-gray-400">No active sessions</p>
                    ) : (
                      userSessions.map((session) => (
                        <div key={session.id} className="bg-dark-700/50 rounded-lg p-4 border border-purple-500/20">
                          <p className="text-white">{session.device_info}</p>
                          <p className="text-gray-400 text-sm mt-2">
                            Last active: {new Date(session.last_active).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {activityLogs.filter(log => log.target_user_id === selectedUser.id).length === 0 ? (
                      <p className="text-gray-400">No activity logs for this user</p>
                    ) : (
                      activityLogs
                        .filter(log => log.target_user_id === selectedUser.id)
                        .map((log) => (
                          <div key={log.id} className="bg-dark-700/50 rounded-lg p-4 border border-purple-500/20">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-white font-medium">{log.action.replace(/_/g, ' ')}</p>
                                {log.details?.reason && (
                                  <p className="text-gray-400 text-sm mt-1">Reason: {log.details.reason}</p>
                                )}
                              </div>
                              <p className="text-gray-400 text-xs">
                                {new Date(log.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 p-6">
              <div className="text-center text-gray-400 py-20">
                <p className="text-2xl mb-2">👈</p>
                <p>Select a user to view details and manage their account</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
