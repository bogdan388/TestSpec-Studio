import { supabase } from '../lib/supabase'

// Get device information from user agent
const getDeviceInfo = () => {
  const ua = navigator.userAgent
  let device = 'Unknown Device'
  let browser = 'Unknown Browser'
  let os = 'Unknown OS'

  // Detect OS
  if (ua.includes('Windows')) os = '🖥️ Windows'
  else if (ua.includes('Mac')) os = '💻 Mac'
  else if (ua.includes('Linux')) os = '🐧 Linux'
  else if (ua.includes('Android')) os = '📱 Android'
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = '📱 iOS'

  // Detect Browser
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome'
  else if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'
  else if (ua.includes('Edg')) browser = 'Edge'
  else if (ua.includes('Opera')) browser = 'Opera'

  device = `${os} · ${browser}`
  return device
}

// Create or update session on login
export const trackSession = async (userId, sessionToken) => {
  try {
    const deviceInfo = getDeviceInfo()

    // Check if session already exists
    const { data: existingSession } = await supabase
      .from('user_sessions')
      .select('id')
      .eq('session_token', sessionToken)
      .single()

    if (existingSession) {
      // Update existing session
      await supabase
        .from('user_sessions')
        .update({ last_active: new Date().toISOString() })
        .eq('id', existingSession.id)
    } else {
      // Create new session
      await supabase
        .from('user_sessions')
        .insert({
          user_id: userId,
          session_token: sessionToken,
          device_info: deviceInfo,
          last_active: new Date().toISOString()
        })
    }
  } catch (error) {
    console.error('Error tracking session:', error)
  }
}

// Get all user sessions
export const getUserSessions = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('last_active', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return []
  }
}

// Delete a specific session
export const deleteSession = async (sessionId) => {
  try {
    const { error } = await supabase
      .from('user_sessions')
      .delete()
      .eq('id', sessionId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting session:', error)
    return false
  }
}

// Update session activity
export const updateSessionActivity = async (sessionToken) => {
  try {
    await supabase
      .from('user_sessions')
      .update({ last_active: new Date().toISOString() })
      .eq('session_token', sessionToken)
  } catch (error) {
    console.error('Error updating session activity:', error)
  }
}

// Delete all sessions for user (sign out from all devices)
export const deleteAllUserSessions = async (userId) => {
  try {
    const { error } = await supabase
      .from('user_sessions')
      .delete()
      .eq('user_id', userId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting all sessions:', error)
    return false
  }
}
