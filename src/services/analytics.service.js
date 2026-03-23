import api from "../api";

/**
 * Analytics Service
 * Handles all analytics-related API calls
 * Now includes both legacy and enhanced analytics
 */
class AnalyticsService {
  /**
   * Get message analytics for dashboard
   * @param {string} period - 'daily', 'weekly', 'monthly', 'yearly'
   * @param {boolean} agentOnly - Whether to show only current agent's data
   * @param {Object} dateParams - Optional date parameters for daily analytics
   * @returns {Promise} Analytics data
   */
  async getMessageAnalytics(period = 'weekly', agentOnly = false, dateParams = {}) {
    try {
      const params = new URLSearchParams({
        period,
        agentOnly: agentOnly.toString(),
        ...dateParams
      });
      
      const response = await api.get(`/analytics/messages?${params}`);
      console.log('Message analytics response:', response.data);
      return response.data.data; // Backend returns { success: true, data: {...} }
    } catch (error) {
      console.error("Error fetching message analytics:", error);
      throw error;
    }
  }

  /**
   * Get response time analytics (legacy - first response only)
   * @param {string} period - 'daily', 'weekly', 'monthly', 'yearly'
   * @param {Object} dateParams - Optional date parameters for daily analytics
   * @returns {Promise} Response time data
   */
  async getResponseTimeAnalytics(period = 'weekly', dateParams = {}) {
    try {
      const params = new URLSearchParams({
        period,
        ...dateParams
      });
      
      const response = await api.get(`/analytics/response-time?${params}`);
      console.log('Response time analytics response:', response.data);
      return response.data.data; // Backend returns { success: true, data: {...} }
    } catch (error) {
      console.error("Error fetching response time analytics:", error);
      throw error;
    }
  }

  /**
   * Get enhanced response time analytics using ART formula
   * @param {string} period - 'daily', 'weekly', 'monthly', 'yearly'
   * @param {Object} dateParams - Optional date parameters for daily analytics
   * @returns {Promise} Enhanced response time data
   */
  async getEnhancedResponseTimeAnalytics(period = 'weekly', dateParams = {}) {
    try {
      const params = new URLSearchParams({
        period,
        ...dateParams
      });
      
      const response = await api.get(`/analytics/enhanced-response-time?${params}`);
      console.log('Enhanced response time analytics response:', response.data);
      return response.data.data; // Backend returns { success: true, data: {...} }
    } catch (error) {
      console.error("Error fetching enhanced response time analytics:", error);
      throw error;
    }
  }

  /**
   * Get agent performance analytics
   * @param {number} sysUserId - Optional specific sys_user_id
   * @param {string} period - 'daily', 'weekly', 'monthly', 'yearly'
   * @param {Object} dateParams - Optional date parameters for daily analytics
   * @returns {Promise} Agent performance data
   */
  async getAgentPerformanceAnalytics(sysUserId = null, period = 'weekly', dateParams = {}) {
    try {
      const params = new URLSearchParams({ 
        period,
        ...dateParams
      });
      if (sysUserId) params.append('sysUserId', sysUserId);
      
      const response = await api.get(`/analytics/agent-performance?${params}`);
      console.log('Agent performance analytics response:', response.data);
      return response.data.data; // Backend returns { success: true, data: {...} }
    } catch (error) {
      console.error("Error fetching agent performance analytics:", error);
      throw error;
    }
  }

  /**
   * Get dashboard statistics
   * @param {Object} dateParams - Optional date parameters for daily analytics
   * @returns {Promise} Dashboard stats
   */
  async getDashboardStats(dateParams = {}) {
    try {
      const params = new URLSearchParams(dateParams);
      const queryString = params.toString() ? `?${params}` : '';
      
      const response = await api.get(`/analytics/dashboard-stats${queryString}`);
      console.log('Dashboard stats response:', response.data);
      return response.data.data; // Backend returns { success: true, data: {...} }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  }

  /**
   * Get customer satisfaction analytics
   * @param {string} period - 'daily', 'weekly', 'monthly', 'yearly'
   * @param {boolean} agentOnly - Whether to show only current agent's data
   * @param {Object} dateParams - Optional date parameters for daily analytics
   * @returns {Promise} Customer satisfaction data
   */
  async getCustomerSatisfactionAnalytics(period = 'weekly', agentOnly = false, dateParams = {}) {
    try {
      const params = new URLSearchParams({
        period,
        agentOnly: agentOnly.toString(),
        ...dateParams
      });
      
      const response = await api.get(`/analytics/customer-satisfaction?${params}`);
      console.log('Customer satisfaction analytics response:', response.data);
      return response.data.data; // Backend returns { success: true, data: {...} }
    } catch (error) {
      console.error("Error fetching customer satisfaction analytics:", error);
      throw error;
    }
  }

  /**
   * Get top conversations (frequent clients) for current agent
   * @param {string} period - 'daily', 'weekly', 'monthly', 'yearly'
   * @param {number} limit - Number of top clients to return
   * @param {Object} dateParams - Optional date parameters for daily analytics
   * @returns {Promise} Top conversations data
   */
  async getTopConversations(period = 'weekly', limit = 5, dateParams = {}) {
    try {
      const params = new URLSearchParams({
        period,
        limit: limit.toString(),
        ...dateParams
      });
      
      const response = await api.get(`/analytics/top-conversations?${params}`);
      console.log('Top conversations response:', response.data);
      return response.data.data; // Backend returns { success: true, data: {...} }
    } catch (error) {
      console.error("Error fetching top conversations:", error);
      throw error;
    }
  }

  /**
   * Get department rankings based on ratings
   * @param {number} departmentId - Department ID
   * @param {string} period - 'daily', 'weekly', 'monthly', 'yearly'
   * @param {number} limit - Number of top agents to return
   * @returns {Promise} Department rankings data
   */
  async getDepartmentRankings(departmentId, period = 'weekly', limit = 5) {
    try {
      const response = await api.get(`/analytics/department-rankings?departmentId=${departmentId}&period=${period}&limit=${limit}`);
      console.log('Department rankings response:', response.data);
      return response.data.data; // Backend returns { success: true, data: {...} }
    } catch (error) {
      console.error("Error fetching department rankings:", error);
      throw error;
    }
  }

  /**
   * Recalculate response times for existing data (admin function)
   * @returns {Promise} Recalculation result
   */
  async recalculateResponseTimes() {
    try {
      const response = await api.post('/analytics/recalculate-response-times');
      console.log('Recalculate response times response:', response.data);
      return response.data; // Backend returns { success: true, message: "..." }
    } catch (error) {
      console.error("Error recalculating response times:", error);
      throw error;
    }
  }
}

export default new AnalyticsService();
