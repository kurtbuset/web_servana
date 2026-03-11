import api from "../api";

/**
 * Analytics Service
 * Handles all analytics-related API calls
 */
class AnalyticsService {
  /**
   * Get message analytics for dashboard
   * @param {string} period - 'daily', 'weekly', 'monthly', 'yearly'
   * @returns {Promise} Analytics data
   */
  async getMessageAnalytics(period = 'weekly') {
    try {
      const response = await api.get(`/analytics/messages?period=${period}`);
      console.log('Message analytics response:', response.data);
      return response.data.data; // Backend returns { success: true, data: {...} }
    } catch (error) {
      console.error("Error fetching message analytics:", error);
      throw error;
    }
  }

  /**
   * Get response time analytics
   * @param {string} period - 'daily', 'weekly', 'monthly', 'yearly'
   * @returns {Promise} Response time data
   */
  async getResponseTimeAnalytics(period = 'weekly') {
    try {
      const response = await api.get(`/analytics/response-time?period=${period}`);
      console.log('Response time analytics response:', response.data);
      return response.data.data; // Backend returns { success: true, data: {...} }
    } catch (error) {
      console.error("Error fetching response time analytics:", error);
      throw error;
    }
  }

  /**
   * Get dashboard statistics
   * @returns {Promise} Dashboard stats
   */
  async getDashboardStats() {
    try {
      const response = await api.get('/analytics/dashboard-stats');
      console.log('Dashboard stats response:', response.data);
      return response.data.data; // Backend returns { success: true, data: {...} }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  }
}

export default new AnalyticsService();
