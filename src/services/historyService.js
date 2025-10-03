import { supabase } from '../lib/supabase'

export const historyService = {
  // Create new chat session
  async createChatSession(userId, title = 'New Chat') {
    const { data, error } = await supabase
      .from('test_history')
      .insert([
        {
          user_id: userId,
          story: title,
          framework: 'playwright',
          manual_tests: [],
          automation_skeletons: '',
          exports: {},
          is_chat_session: true,
        },
      ])
      .select()

    if (error) throw error
    return data[0]
  },

  // Update chat session
  async updateChatSession(sessionId, userId, testData) {
    const { data, error } = await supabase
      .from('test_history')
      .update({
        story: testData.story || 'Chat Session',
        framework: testData.framework,
        manual_tests: testData.manualTests,
        automation_skeletons: testData.automationSkeletons,
        exports: testData.exports,
      })
      .eq('id', sessionId)
      .eq('user_id', userId)
      .select()

    if (error) throw error
    return data[0]
  },

  // Save test generation to history
  async saveToHistory(userId, testData) {
    const { data, error } = await supabase
      .from('test_history')
      .insert([
        {
          user_id: userId,
          story: testData.story,
          framework: testData.framework,
          manual_tests: testData.manualTests,
          automation_skeletons: testData.automationSkeletons,
          exports: testData.exports,
          is_chat_session: testData.isChatSession || false,
        },
      ])
      .select()

    if (error) throw error

    // Clean up old records (keep max 20)
    await this.cleanupHistory(userId)

    return data[0]
  },

  // Get user's history
  async getHistory(userId) {
    const { data, error } = await supabase
      .from('test_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error
    return data
  },

  // Get single history item
  async getHistoryItem(userId, itemId) {
    const { data, error } = await supabase
      .from('test_history')
      .select('*')
      .eq('id', itemId)
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  },

  // Delete history item
  async deleteHistoryItem(userId, itemId) {
    const { error } = await supabase
      .from('test_history')
      .delete()
      .eq('id', itemId)
      .eq('user_id', userId)

    if (error) throw error
  },

  // Clean up old history (keep max 20 recent)
  async cleanupHistory(userId) {
    // Get all records for user
    const { data: allRecords } = await supabase
      .from('test_history')
      .select('id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (allRecords && allRecords.length > 20) {
      // Delete records beyond the 20 most recent
      const toDelete = allRecords.slice(20).map((r) => r.id)

      await supabase.from('test_history').delete().in('id', toDelete)
    }
  },

  // Delete all user history
  async deleteAllHistory(userId) {
    const { error } = await supabase
      .from('test_history')
      .delete()
      .eq('user_id', userId)

    if (error) throw error
  },
}
