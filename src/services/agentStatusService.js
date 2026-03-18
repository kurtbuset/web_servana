/**
 * Agent Status REST API Service
 * Handles agent status operations via REST API
 */
import api from "../api";

class AgentStatusService {
  /**
   * Get current agent status from REST API
   * @returns {Promise<string>} Agent status
   */
  async getAgentStatus() {
    try {
      const response = await api.get("/profile/agent-status");
      return response.data.agent_status;
    } catch (error) {
      console.error("❌ Error fetching agent status via REST:", error);
      throw error;
    }
  }

  /**
   * Update agent status via REST API
   * @param {string} agentStatus - New agent status
   * @returns {Promise<Object>} Response data
   */
  async updateAgentStatus(agentStatus) {
    try {
      const response = await api.put("/profile/agent-status", {
        agent_status: agentStatus,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error updating agent status via REST:", error);
      throw error;
    }
  }
}

export default new AgentStatusService();