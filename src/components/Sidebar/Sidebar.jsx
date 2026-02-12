import {
  Layers,
  MessageSquare,
  UserCheck,
  Activity,
  Shield,
  MessageCircle,
  Key,
  FileText,
  Headphones,
  Cpu,
  ChevronsLeft,
  ChevronsRight,
  BarChart2
} from "react-feather";
import { HiOfficeBuilding } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../../../src/context/UserContext";
import { useTheme } from "../../../src/context/ThemeContext";
import { useUnsavedChanges } from "../../../src/context/UnsavedChangesContext";
import { useState, useEffect } from "react";
import { ROUTES } from "../../constants/routes";
import { PERMISSIONS } from "../../constants/permissions";

const navSections = [
  {
    title: "Overview",
    items: [
      { 
        to: ROUTES.DASHBOARD, 
        icon: Activity, 
        label: "Dashboard"
      },
      { 
        to: "/analytics", 
        icon: BarChart2, 
        label: "Analytics"
      }
    ]
  },
  {
    title: "Communication",
    items: [
      { 
        to: ROUTES.QUEUES, 
        icon: Layers, 
        label: "Queues", 
        permission: PERMISSIONS.VIEW_MESSAGE, 
        showBadge: true, 
        badgeKey: "pendingChats"
      },
      { 
        to: ROUTES.CHATS, 
        icon: MessageSquare, 
        label: "Active Chats", 
        permission: PERMISSIONS.VIEW_MESSAGE, 
        showBadge: true, 
        badgeKey: "activeChats"
      }
    ]
  },
  {
    title: "Management",
    items: [
      { 
        to: ROUTES.DEPARTMENTS, 
        icon: HiOfficeBuilding, 
        label: "Departments", 
        permission: PERMISSIONS.MANAGE_DEPT
      },
      { 
        to: ROUTES.AUTO_REPLIES, 
        icon: Cpu, 
        label: "Auto-Replies", 
        permission: PERMISSIONS.MANAGE_AUTO_REPLY
      }
    ]
  },
  {
    title: "User Management",
    items: [
      { 
        to: ROUTES.MANAGE_AGENTS, 
        icon: Headphones, 
        label: "Manage Agents", 
        permission: PERMISSIONS.CREATE_ACCOUNT
      },
      { 
        to: ROUTES.CHANGE_ROLE, 
        icon: UserCheck, 
        label: "Change Roles", 
        permission: PERMISSIONS.ASSIGN_ROLE
      }
    ]
  },
  {
    title: "Automation Tools",
    items: [
      { 
        to: ROUTES.MACROS_AGENTS, 
        icon: MessageCircle, 
        label: "Agent Macros", 
        permission: PERMISSIONS.USE_CANNED_MESS
      },
      { 
        to: ROUTES.MACROS_CLIENTS, 
        icon: FileText, 
        label: "Client Macros", 
        permission: PERMISSIONS.USE_CANNED_MESS
      }
    ]
  },
  {
    title: "Administration",
    items: [
      { 
        to: ROUTES.MANAGE_ADMIN, 
        icon: Shield, 
        label: "Admin Users", 
        permission: PERMISSIONS.CREATE_ACCOUNT
      },
      { 
        to: ROUTES.ROLES, 
        icon: Key, 
        label: "Roles & Permissions", 
        permission: PERMISSIONS.MANAGE_ROLE
      }
    ]
  }
];



const NavItem = ({ to, Icon, label, isActive, badgeCount, isCollapsed, isDark, onBlockedClick }) => {
  const handleClick = (e) => {
    if (onBlockedClick && onBlockedClick()) {
      e.preventDefault();
    }
  };

  return (
    <div className="relative group" key={to}>
      {isActive && (
        <motion.div
          layoutId="activeHighlight"
          className="absolute inset-0 rounded-md bg-gradient-to-r from-[#6237A0] to-[#7C4DFF] z-0"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <Link
        to={to}
        onClick={handleClick}
        className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-3 py-1.5 rounded-md z-10 transition-all duration-200 ${
          isActive 
            ? "text-white shadow-lg" 
            : ""
        }`}
        style={!isActive ? { color: 'var(--text-primary)' } : {}}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(98, 55, 160, 0.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
        title={isCollapsed ? label : ''}
      >
        <div 
          className={`p-0.5 rounded ${isActive ? 'bg-white/20' : ''}`}
          style={!isActive ? { backgroundColor: 'var(--bg-tertiary)' } : {}}
        >
          <Icon 
            size={13} 
            strokeWidth={isActive ? 2 : 1.5} 
            className={isActive ? 'text-white' : ''}
            style={!isActive ? { color: 'var(--text-secondary)' } : {}}
          />
        </div>
        {!isCollapsed && (
          <>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-xs">{label}</div>
            </div>
            {badgeCount !== undefined && badgeCount > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                isActive 
                  ? "bg-white text-[#6237A0]" 
                  : "bg-[#6237A0] text-white"
              } shadow-sm`}>
                {badgeCount > 99 ? '99+' : badgeCount}
              </span>
            )}
          </>
        )}
        {isCollapsed && badgeCount !== undefined && badgeCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
            {badgeCount > 9 ? '9+' : badgeCount}
          </span>
        )}
      </Link>
    </div>
  );
};

const SectionHeader = ({ title, isCollapsed }) => {
  if (isCollapsed) return <div className="h-px mx-2 my-1.5" style={{ backgroundColor: 'var(--border-color)' }} />;
  
  return (
    <div className="px-3 py-1 mb-0.5">
      <h3 className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
        {title}
      </h3>
    </div>
  );
};



const Sidebar = ({ isMobile, isOpen }) => {
  const location = useLocation();
  const { userData, hasPermission } = useUser();
  const { isDark } = useTheme();
  const { blockNavigation } = useUnsavedChanges();
  const [counts, setCounts] = useState({
    pendingChats: 0,
    activeChats: 0
  });
  
  // Persist collapse state in localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  // Save collapse state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed);
  }, [isCollapsed]);

  const isActivePath = (to, extraPaths = []) =>
    location.pathname.toLowerCase() === to.toLowerCase() ||
    extraPaths.map((p) => p.toLowerCase()).includes(location.pathname.toLowerCase());

  

  if (isMobile && !isOpen) return null;

  // Filter navigation sections based on permissions
  const visibleNavSections = navSections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      // If no permission specified, item is always visible (like Dashboard)
      if (!item.permission) {
        return true;
      }
      
      // Check permission
      return hasPermission(item.permission);
    })
  })).filter(section => section.items.length > 0); // Only show sections with visible items

  return (
    <aside
      className={`${
        isMobile
          ? "absolute top-16 left-0 z-40 h-[calc(100vh-4rem)]"
          : "hidden md:flex"
      } ${isCollapsed ? 'w-20' : 'w-56'} flex-col shadow-lg transition-all duration-300`}
      style={{ 
        backgroundColor: 'var(--card-bg)', 
        color: 'var(--text-primary)',
        borderRight: `1px solid var(--border-color)`
      }}
    >
      <div className="flex-1 overflow-y-auto p-3">
        <nav className="space-y-3">
          {/* Navigation Sections */}
          {visibleNavSections.map((section) => (
            <div key={section.title}>
              <SectionHeader title={section.title} isCollapsed={isCollapsed} />
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    Icon={item.icon}
                    label={item.label}
                    isActive={isActivePath(item.to)}
                    badgeCount={item.showBadge ? counts[item.badgeKey] : undefined}
                    isCollapsed={isCollapsed}
                    isDark={isDark}
                    onBlockedClick={blockNavigation}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Collapse Toggle Button at Bottom - Desktop Only */}
      {!isMobile && (
        <div className="p-2" style={{ borderTop: `1px solid var(--border-color)` }}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-3 py-1.5 rounded-md transition-all`}
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(98, 55, 160, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronsRight size={15} />
            ) : (
              <>
                <ChevronsLeft size={15} />
                <span className="text-xs font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
