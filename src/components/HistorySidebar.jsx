import { useState, useEffect } from 'react'
import { historyService } from '../services/historyService'
import { useAuth } from '../contexts/AuthContext'

export default function HistorySidebar({ onSelectHistory, currentHistoryId }) {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadHistory()
    }
  }, [user])

  const loadHistory = async () => {
    try {
      const data = await historyService.getHistory(user.id)
      setHistory(data)
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (confirm('Delete this history item?')) {
      try {
        await historyService.deleteHistoryItem(user.id, id)
        setHistory(history.filter((h) => h.id !== id))
      } catch (error) {
        console.error('Error deleting history:', error)
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  if (loading) {
    return (
      <div className="w-72 bg-dark-800/60 backdrop-blur-md border-r border-purple-500/20 p-4">
        <h3 className="text-lg font-semibold text-white mb-4">History</h3>
        <div className="animate-pulse space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-dark-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-72 bg-dark-800/60 backdrop-blur-md border-r border-purple-500/20 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">📚 History</h3>
        <span className="text-xs text-gray-400">{history.length}/10</span>
      </div>

      {history.length === 0 ? (
        <div className="text-center text-gray-400 text-sm mt-8">
          <p>No history yet</p>
          <p className="mt-2">Generate tests to start</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectHistory(item)}
              className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                currentHistoryId === item.id
                  ? 'bg-purple-600/30 border border-purple-500'
                  : 'bg-dark-700/50 hover:bg-dark-700 border border-transparent hover:border-purple-500/30'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-400">{formatDate(item.created_at)}</span>
                <button
                  onClick={(e) => handleDelete(e, item.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition text-xs"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-white line-clamp-2 mb-1">{item.story}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                  {item.framework}
                </span>
                <span className="text-xs text-gray-400">
                  {item.manual_tests?.length || 0} tests
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-purple-500/20">
        <p className="text-xs text-gray-400">
          History kept for 3 days • Max 10 items
        </p>
      </div>
    </div>
  )
}
