/**
 * Application Permissions Constants
 * 
 * Centralized permission definitions to ensure consistency across the application.
 * These should match the permission keys in the backend privilege system.
 */

export const PERMISSIONS = {
  // Message/Chat Management
  VIEW_MESSAGE: 'priv_can_view_message',
  MESSAGE: 'priv_can_message',
  END_CHAT: 'priv_can_end_chat',
  TRANSFER: 'priv_can_transfer',
  
  // Department Management
  MANAGE_DEPT: 'priv_can_manage_dept',
  ASSIGN_DEPT: 'priv_can_assign_dept',
  
  // Auto Reply Management
  MANAGE_AUTO_REPLY: 'priv_can_manage_auto_reply',
  
  // Account Management
  CREATE_ACCOUNT: 'priv_can_create_account',
  MANAGE_PROFILE: 'priv_can_manage_profile',
  
  // Role Management
  ASSIGN_ROLE: 'priv_can_assign_role',
  MANAGE_ROLE: 'priv_can_manage_role',
  
  // Canned Messages/Macros
  USE_CANNED_MESS: 'priv_can_use_canned_mess',
};

/**
 * Permission Groups for easier management
 */
export const PERMISSION_GROUPS = {
  COMMUNICATION: [
    PERMISSIONS.VIEW_MESSAGE,
  ],
  
  MANAGEMENT: [
    PERMISSIONS.MANAGE_DEPT,
    PERMISSIONS.MANAGE_AUTO_REPLY,
  ],
  
  USER_MANAGEMENT: [
    PERMISSIONS.CREATE_ACCOUNT,
    PERMISSIONS.ASSIGN_ROLE,
    PERMISSIONS.MANAGE_ROLE,
  ],
  
  AUTOMATION: [
    PERMISSIONS.USE_CANNED_MESS,
  ],
};

/**
 * Helper function to get all permissions as an array
 */
export const getAllPermissions = () => Object.values(PERMISSIONS);

/**
 * Helper function to check if a permission exists
 */
export const isValidPermission = (permission) => {
  return getAllPermissions().includes(permission);
};