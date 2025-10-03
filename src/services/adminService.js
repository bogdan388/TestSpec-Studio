import { supabase } from '../lib/supabase'

// Check if current user is admin
export const checkIsAdmin = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data, error } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (error) return false
    return data ? true : false
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

// Check if current user is super admin
export const checkIsSuperAdmin = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data, error } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'super_admin')
      .single()

    if (error) return false
    return data ? true : false
  } catch (error) {
    console.error('Error checking super admin status:', error)
    return false
  }
}

// Get all users (from test_history to get unique users)
export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('test_history')
      .select('user_id')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Get unique user IDs and count
    const uniqueUsers = [...new Set(data.map(item => item.user_id))]
    return uniqueUsers.map((id, index) => ({
      id,
      email: `User ${index + 1}`,
      created_at: new Date().toISOString()
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

// Get all test history
export const getAllTestHistory = async () => {
  try {
    const { data, error } = await supabase
      .from('test_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching test history:', error)
    return []
  }
}

// Get all sessions
export const getAllSessions = async () => {
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .order('last_active', { ascending: false })
      .limit(100)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return []
  }
}

// Get statistics
export const getAdminStats = async () => {
  try {
    // Get user count
    const { count: userCount } = await supabase
      .from('test_history')
      .select('user_id', { count: 'exact', head: true })

    // Get total test generations
    const { count: testCount } = await supabase
      .from('test_history')
      .select('*', { count: 'exact', head: true })

    // Get active sessions count
    const { count: sessionCount } = await supabase
      .from('user_sessions')
      .select('*', { count: 'exact', head: true })

    return {
      totalUsers: userCount || 0,
      totalTests: testCount || 0,
      activeSessions: sessionCount || 0
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return {
      totalUsers: 0,
      totalTests: 0,
      activeSessions: 0
    }
  }
}

// Delete user (super admin only)
export const deleteUser = async (userId) => {
  try {
    const { error } = await supabase.auth.admin.deleteUser(userId)
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting user:', error)
    return false
  }
}
