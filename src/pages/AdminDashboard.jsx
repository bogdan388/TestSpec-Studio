import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  checkIsSuperAdmin,
  getAdminStats,
  getAllUsers,
  getAllTestHistory,
  getAllSessions
} from '../services/adminService'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState({ totalUsers: 0, totalTests: 0, activeSessions: 0 })
  const [users, setUsers] = useState([])
  const [testHistory, setTestHistory] = useState([])
  const [sessions, setSessions] = useState([])
  const [activeTab, setActiveTab] = useState('overview')

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
    const [statsData, usersData, historyData, sessionsData] = await Promise.all([
      getAdminStats(),
      getAllUsers(),
      getAllTestHistory(),
      getAllSessions()
    ])

    setStats(statsData)
    setUsers(usersData)
    setTestHistory(historyData)
    setSessions(sessionsData)
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-white mb-8 neon-text">
        🛡️ Admin Dashboard
      </h1>

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

      {/* Tabs */}
      <div className="bg-dark-800/60 backdrop-blur-md rounded-lg shadow-neon border border-purple-500/30 mb-6">
        <div className="flex border-b border-purple-500/30">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'overview'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'users'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'history'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Test History ({testHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'sessions'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sessions ({sessions.length})
          </button>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {testHistory.slice(0, 5).map((item) => (
                    <div key={item.id} className="bg-dark-700/50 rounded-lg p-4 border border-purple-500/20">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.story.substring(0, 100)}...</p>
                          <p className="text-gray-400 text-sm mt-1">
                            Framework: {item.framework} • {new Date(item.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/30">
                    <th className="text-left py-3 px-4 text-gray-300">Email</th>
                    <th className="text-left py-3 px-4 text-gray-300">Created At</th>
                    <th className="text-left py-3 px-4 text-gray-300">Last Sign In</th>
                    <th className="text-left py-3 px-4 text-gray-300">Provider</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-purple-500/10 hover:bg-dark-700/30">
                      <td className="py-3 px-4 text-white">{u.email}</td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {u.app_metadata?.provider || 'email'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Test History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {testHistory.map((item) => (
                <div key={item.id} className="bg-dark-700/50 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.story.substring(0, 150)}...</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Framework: <span className="text-purple-400">{item.framework}</span> •
                        Tests: <span className="text-purple-400">{item.manual_tests?.length || 0}</span> •
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/30">
                    <th className="text-left py-3 px-4 text-gray-300">Device</th>
                    <th className="text-left py-3 px-4 text-gray-300">Last Active</th>
                    <th className="text-left py-3 px-4 text-gray-300">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr key={session.id} className="border-b border-purple-500/10 hover:bg-dark-700/30">
                      <td className="py-3 px-4 text-white">{session.device_info}</td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(session.last_active).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(session.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
