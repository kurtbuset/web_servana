import api from "../api";

/**
 * RoleService
 * Handles all role-related API operations
 */
class RoleService {
  /**
   * Get all roles with permissions
   * @returns {Promise<Array>} Array of roles with permissions
   */
  static async getRoles() {
    const response = await api.get("/roles");
    return response.data;
  }

  /**
   * Get role ID by role name
   * @param {string} roleName - Role name (e.g., "Agent", "Client")
   * @returns {Promise<number>} Role ID
   */
  static async getRoleIdByName(roleName) {
    const roles = await this.getRoles();
    const role = roles.find(r => r.name === roleName);
    if (!role) {
      throw new Error(`Role "${roleName}" not found`);
    }
    return role.role_id;
  }

  /**
   * Create a new role
   * @param {Object} roleData - Role data
   * @param {string} roleData.name - Role name
   * @param {Array<string>} roleData.permissions - Array of permission labels
   * @param {number} roleData.created_by - User ID creating the role
   * @returns {Promise<Object>} Created role data
   */
  static async createRole(roleData) {
    const response = await api.post("/roles", {
      name: roleData.name,
      permissions: roleData.permissions || [],
      created_by: roleData.created_by,
      active: true,
    });
    return response.data;
  }

  /**
   * Update an existing role
   * @param {number} roleId - Role ID
   * @param {Object} roleData - Updated role data
   * @param {string} roleData.name - Role name
   * @param {boolean} roleData.active - Active status
   * @param {Array<string>} roleData.permissions - Array of permission labels
   * @param {number} roleData.updated_by - User ID updating the role
   * @returns {Promise<Object>} Updated role data
   */
  static async updateRole(roleId, roleData) {
    const response = await api.put(`/roles/${roleId}`, {
      name: roleData.name,
      active: roleData.active,
      permissions: roleData.permissions,
      updated_by: roleData.updated_by,
    });
    return response.data;
  }

  /**
   * Get all users with their roles (for role assignment)
   * @returns {Promise<Array>} Array of users with role information
   */
  static async getUsersWithRoles() {
    const response = await api.get("/change-role");
    return response.data;
  }

  /**
   * Get all available roles (for role assignment dropdown)
   * @returns {Promise<Array>} Array of roles
   */
  static async getAvailableRoles() {
    const response = await api.get("/change-role/roles");
    return response.data;
  }

  /**
   * Update a user's role
   * @param {number} userId - User ID
   * @param {number} roleId - New role ID
   * @returns {Promise<Object>} Updated user data
   */
  static async updateUserRole(userId, roleId) {
    const response = await api.put(`/change-role/${userId}`, {
      role_id: roleId,
    });
    return response.data;
  }

  /**
   * Toggle user active status
   * @param {number} userId - User ID
   * @param {boolean} isActive - New active status
   * @returns {Promise<Object>} Updated user data
   */
  static async toggleUserActive(userId, isActive) {
    const response = await api.put(`/change-role/${userId}`, {
      sys_user_is_active: isActive,
    });
    return response.data;
  }

  /**
   * Get all members for a specific role
   * @param {number} roleId - Role ID
   * @returns {Promise<Object>} Object containing role members data
   */
  static async getRoleMembers(roleId) {
    console.log(`Making API call to /roles/${roleId}/members`);
    try {
      const response = await api.get(`/roles/${roleId}/members`);
      console.log(`API response for role ${roleId}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`API error for role ${roleId}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Update member permission for a specific user in a role
   * @param {number} roleId - Role ID
   * @param {number} userId - User ID
   * @param {string} permission - Permission name (e.g., 'priv_can_view_message')
   * @param {boolean} value - Permission value
   * @returns {Promise<Object>} Updated permission data
   */
  static async updateMemberPermission(roleId, userId, permission, value) {
    const response = await api.put(`/roles/${roleId}/members/${userId}/permissions`, {
      permission: permission,
      value: value,
    });
    return response.data;
  }
}

export default RoleService;
