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

// Route groups for role-based access
export const ROUTE_GROUPS = {
  ADMIN: [
    ROUTES.DASHBOARD,
    ROUTES.DEPARTMENTS,
    ROUTES.MANAGE_AGENTS,
    ROUTES.MANAGE_ADMIN,
    ROUTES.ROLES,
    ROUTES.CHANGE_ROLE,
    ROUTES.AUTO_REPLIES,
    ROUTES.MACROS_AGENTS,
    ROUTES.MACROS_CLIENTS,
    ROUTES.CHATS,
    ROUTES.QUEUES,
    ROUTES.PROFILE,
  ],
  AGENT: [
    ROUTES.DASHBOARD,
    ROUTES.CHATS,
    ROUTES.QUEUES,
    ROUTES.MACROS_AGENTS,
    ROUTES.PROFILE,
  ],
  CLIENT: [
    ROUTES.DASHBOARD,
    ROUTES.CHATS,
    ROUTES.MACROS_CLIENTS,
    ROUTES.PROFILE,
  ],
};

// Route metadata
export const ROUTE_META = {
  [ROUTES.LOGIN]: {
    title: 'Login',
    requiresAuth: false,
    roles: [],
  },
  [ROUTES.DASHBOARD]: {
    title: 'Dashboard',
    requiresAuth: true,
    roles: ['Admin', 'Agent', 'Client'],
  },
  [ROUTES.CHATS]: {
    title: 'Chats',
    requiresAuth: true,
    roles: ['Admin', 'Agent', 'Client'],
  },
  [ROUTES.QUEUES]: {
    title: 'Queues',
    requiresAuth: true,
    roles: ['Admin', 'Agent'],
  },
  [ROUTES.DEPARTMENTS]: {
    title: 'Departments',
    requiresAuth: true,
    roles: ['Admin'],
  },
  [ROUTES.MANAGE_AGENTS]: {
    title: 'Manage Agents',
    requiresAuth: true,
    roles: ['Admin'],
  },
  [ROUTES.MANAGE_ADMIN]: {
    title: 'Manage Admin',
    requiresAuth: true,
    roles: ['Admin'],
  },
  [ROUTES.ROLES]: {
    title: 'Roles',
    requiresAuth: true,
    roles: ['Admin'],
  },
  [ROUTES.CHANGE_ROLE]: {
    title: 'Change Role',
    requiresAuth: true,
    roles: ['Admin'],
  },
  [ROUTES.AUTO_REPLIES]: {
    title: 'Auto Replies',
    requiresAuth: true,
    roles: ['Admin'],
  },
  [ROUTES.MACROS_AGENTS]: {
    title: 'Agent Macros',
    requiresAuth: true,
    roles: ['Admin', 'Agent'],
  },
  [ROUTES.MACROS_CLIENTS]: {
    title: 'Client Macros',
    requiresAuth: true,
    roles: ['Admin', 'Client'],
  },
  [ROUTES.PROFILE]: {
    title: 'Profile',
    requiresAuth: true,
    roles: ['Admin', 'Agent', 'Client'],
  },
};

/**
 * Check if user has access to route
 * @param {string} route - Route path
 * @param {string} userRole - User's role name
 * @returns {boolean} True if user has access
 */
export const hasRouteAccess = (route, userRole) => {
  const meta = ROUTE_META[route];
  if (!meta) return false;
  if (!meta.requiresAuth) return true;
  return meta.roles.includes(userRole);
};

/**
 * Get routes accessible by role
 * @param {string} roleName - Role name
 * @returns {Array} Array of accessible routes
 */
export const getRoutesByRole = (roleName) => {
  return Object.keys(ROUTE_META).filter((route) => 
    hasRouteAccess(route, roleName)
  );
};

export default ROUTES;
