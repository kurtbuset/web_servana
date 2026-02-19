/**
 * Application Routes
 * Centralized route path definitions
 */

// Public routes
export const ROUTES = {
  // Authentication
  LOGIN: '/',
  
  // Dashboard
  DASHBOARD: '/Dashboard',
  
  // Chat
  CHATS: '/Chats',
  QUEUES: '/Queues',
  
  // Management
  DEPARTMENTS: '/department',
  MANAGE_AGENTS: '/manage-agents',
  MANAGE_ADMIN: '/manage-admin',
  
  // Roles
  ROLES: '/roles',
  CHANGE_ROLE: '/change-role',
  
  // Auto-replies and Macros
  AUTO_REPLIES: '/auto-replies',
  MACROS_AGENTS: '/macros-agents',
  MACROS_CLIENTS: '/macros-clients',
  
  // Legacy routes (being phased out - use dynamic macro endpoints instead)
  AGENTS: '/agents',
  CLIENTS: '/clients',
  
  // New dynamic macro routes
  MACRO_AGENT: '/macros/agent',
  MACRO_CLIENT: '/macros/client',
  
  // Profile
  PROFILE: '/profile',
};

export default ROUTES;
