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

// Get users with detailed info (including ban status, email, etc.)
export const getUsersDetailed = async (searchQuery = '', filterStatus = 'all') => {
  try {
    // Get user profiles (emails)
    let profileQuery = supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply search filter
    if (searchQuery) {
      profileQuery = profileQuery.or(`email.ilike.%${searchQuery}%,user_id.ilike.%${searchQuery}%`)
    }

    const { data: profiles, error: profileError } = await profileQuery

    if (profileError) throw profileError

    // Get test history for each user
    const { data: history } = await supabase
      .from('test_history')
      .select('user_id, created_at')
      .order('created_at', { ascending: false })

    // Get banned users
    const { data: bannedUsers } = await supabase
      .from('banned_users')
      .select('user_id, reason, banned_at')

    // Get sessions for active users
    const { data: sessions } = await supabase
      .from('user_sessions')
      .select('user_id, last_active')
      .order('last_active', { ascending: false })

    const bannedUserIds = new Set(bannedUsers?.map(u => u.user_id) || [])

    // Build user stats
    const userStats = {}

    // Add profile data
    profiles?.forEach(profile => {
      userStats[profile.user_id] = {
        id: profile.user_id,
        email: profile.email,
        createdAt: profile.created_at,
        lastSignIn: profile.last_sign_in,
        provider: profile.provider,
        testCount: 0,
        sessionCount: 0,
        lastActive: profile.last_sign_in,
        isBanned: bannedUserIds.has(profile.user_id),
        banReason: bannedUsers?.find(u => u.user_id === profile.user_id)?.reason,
        bannedAt: bannedUsers?.find(u => u.user_id === profile.user_id)?.banned_at
      }
    })

    // Add test counts
    history?.forEach(item => {
      if (userStats[item.user_id]) {
        userStats[item.user_id].testCount++
        if (!userStats[item.user_id].lastActive || new Date(item.created_at) > new Date(userStats[item.user_id].lastActive)) {
          userStats[item.user_id].lastActive = item.created_at
        }
      }
    })

    // Add session counts
    sessions?.forEach(session => {
      if (userStats[session.user_id]) {
        userStats[session.user_id].sessionCount++
      }
    })

    let users = Object.values(userStats)

    // Apply status filter
    if (filterStatus === 'active') {
      users = users.filter(u => !u.isBanned)
    } else if (filterStatus === 'banned') {
      users = users.filter(u => u.isBanned)
    }

    return users
  } catch (error) {
    console.error('Error fetching detailed users:', error)
    return []
  }
}

// Get test history grouped by user
export const getTestHistoryGroupedByUser = async () => {
  try {
    const { data, error } = await supabase
      .from('test_history')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Group by user_id
    const grouped = {}
    data.forEach(item => {
      if (!grouped[item.user_id]) {
        grouped[item.user_id] = []
      }
      grouped[item.user_id].push(item)
    })

    return grouped
  } catch (error) {
    console.error('Error fetching grouped test history:', error)
    return {}
  }
}

// Get sessions grouped by user
export const getSessionsGroupedByUser = async () => {
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .order('last_active', { ascending: false })

    if (error) throw error

    // Group by user_id
    const grouped = {}
    data.forEach(session => {
      if (!grouped[session.user_id]) {
        grouped[session.user_id] = []
      }
      grouped[session.user_id].push(session)
    })

    return grouped
  } catch (error) {
    console.error('Error fetching grouped sessions:', error)
    return {}
  }
}

// Log admin activity
const logAdminActivity = async (action, targetUserId, details = {}) => {
  try {
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    await supabase.from('admin_activity_log').insert({
      admin_id: currentUser.id,
      action,
      target_user_id: targetUserId,
      details
    })
  } catch (error) {
    console.error('Error logging admin activity:', error)
  }
}

// Get admin activity logs
export const getAdminActivityLogs = async (limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('admin_activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching activity logs:', error)
    return []
  }
}

// Ban/Disable user
export const banUser = async (userId, reason) => {
  try {
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('banned_users')
      .insert({
        user_id: userId,
        reason: reason || 'No reason provided',
        banned_by: currentUser.id
      })

    if (error) throw error

    // Log activity
    await logAdminActivity('BAN_USER', userId, { reason })

    return { success: true }
  } catch (error) {
    console.error('Error banning user:', error)
    return { success: false, error: error.message }
  }
}

// Unban/Enable user
export const unbanUser = async (userId) => {
  try {
    const { error } = await supabase
      .from('banned_users')
      .delete()
      .eq('user_id', userId)

    if (error) throw error

    // Log activity
    await logAdminActivity('UNBAN_USER', userId)

    return { success: true }
  } catch (error) {
    console.error('Error unbanning user:', error)
    return { success: false, error: error.message }
  }
}

// Send password reset email (using Supabase auth)
export const sendPasswordReset = async (userId) => {
  try {
    // Log the password reset action
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    await supabase
      .from('admin_password_resets')
      .insert({
        user_id: userId,
        reset_by: currentUser.id
      })

    // Log activity
    await logAdminActivity('PASSWORD_RESET', userId)

    return {
      success: true,
      message: 'Password reset recorded. User will need to use "Forgot Password" on login page.'
    }
  } catch (error) {
    console.error('Error sending password reset:', error)
    return { success: false, error: error.message }
  }
}

// Delete all user data
export const deleteUserData = async (userId) => {
  try {
    // Delete test history
    await supabase.from('test_history').delete().eq('user_id', userId)

    // Delete sessions
    await supabase.from('user_sessions').delete().eq('user_id', userId)

    // Delete banned record if exists
    await supabase.from('banned_users').delete().eq('user_id', userId)

    // Log activity
    await logAdminActivity('DELETE_USER_DATA', userId, {
      deleted: ['test_history', 'user_sessions', 'banned_users']
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting user data:', error)
    return { success: false, error: error.message }
  }
}
