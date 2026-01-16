import api from '../api';

/**
 * DashboardService handles all dashboard-related API calls
 * 
 * Backend endpoints:
 * - GET /dashboard/stats - Get dashboard statistics
 * - GET /dashboard/activity - Get recent activity
 * 
 * Note: Currently using simulated data. Backend endpoints to be implemented.
 */
export class DashboardService {
  /**
   * Get dashboard statistics
   * Returns stats for admin (all chats) or agent (personal stats)
   * @returns {Promise<Object>} Dashboard statistics
   */
  static async getStats() {
    // TODO: Replace with actual API call when backend endpoint is ready
    // const response = await api.get('/dashboard/stats');
    // return response.data;
    
    // Simulated data for now
    return {
      totalChats: 156,
      activeChats: 23,
      pendingChats: 8,
      resolvedToday: 45,
      activeAgents: 12,
      avgResponseTime: "2.5m",
      myActiveChats: 5,
      myResolvedToday: 12
    };
  }

  /**
   * Get recent activity feed
   * @returns {Promise<Array>} Array of recent activities
   */
  static async getRecentActivity() {
    // TODO: Replace with actual API call when backend endpoint is ready
    // const response = await api.get('/dashboard/activity');
    // return response.data;
    
    // Simulated data for now
    return [
      { agent: "John Doe", action: "resolved a chat", time: "2 min ago", status: "resolved" },
      { agent: "Sarah Smith", action: "started a new chat", time: "5 min ago", status: "active" },
      { agent: "Mike Johnson", action: "transferred a chat", time: "12 min ago", status: "transferred" },
      { agent: "Emma Wilson", action: "resolved a chat", time: "18 min ago", status: "resolved" },
    ];
  }
}
