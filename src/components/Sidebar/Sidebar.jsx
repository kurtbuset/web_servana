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
import { useState, useEffect, useCallback, memo, useMemo, useRef } from "react";
import socket from "../../socket";
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



const NavItem = memo(({ to, Icon, label, isActive, badgeCount, isCollapsed, isDark, onBlockedClick }) => {
  const handleClick = useCallback((e) => {
    // Store current scroll position before navigation
    const sidebar = e.currentTarget.closest('.sidebar-scroll-container');
    if (sidebar) {
      const scrollTop = sidebar.scrollTop;
      // Store in sessionStorage to persist across renders
      sessionStorage.setItem('sidebarScrollPosition', scrollTop.toString());
    }
    
    if (onBlockedClick && onBlockedClick()) {
      e.preventDefault();
      return;
    }
    
    // Prevent focus
    e.currentTarget.blur();
  }, [onBlockedClick]);

  const handleMouseEnter = useCallback((e) => {
    if (!isActive) {
      e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(98, 55, 160, 0.05)';
    }
  }, [isActive, isDark]);

  const handleMouseLeave = useCallback((e) => {
    if (!isActive) {
      e.currentTarget.style.backgroundColor = 'transparent';
    }
  }, [isActive]);

  return (
    <div className="relative group">
      {isActive && (
        <div
          className="absolute inset-0 rounded-md bg-gradient-to-r from-[#6237A0] to-[#7C4DFF] z-0"
        />
      )}
      <Link
        to={to}
        onClick={handleClick}
        tabIndex={-1}
        className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-3 py-1.5 rounded-md z-10 transition-all duration-200 ${
          isActive 
            ? "text-white shadow-lg" 
            : ""
        }`}
        style={!isActive ? { color: 'var(--text-primary)' } : {}}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.to === nextProps.to &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.badgeCount === nextProps.badgeCount &&
    prevProps.isCollapsed === nextProps.isCollapsed &&
    prevProps.isDark === nextProps.isDark &&
    prevProps.label === nextProps.label
  );
});

NavItem.displayName = 'NavItem';

const SectionHeader = memo(({ title, isCollapsed }) => {
  if (isCollapsed) return <div className="h-px mx-2 my-1.5" style={{ backgroundColor: 'var(--border-color)' }} />;
  
  return (
    <div className="px-3 py-1 mb-0.5">
      <h3 className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
        {title}
      </h3>
    </div>
  );
});

SectionHeader.displayName = 'SectionHeader';



const Sidebar = memo(({ isMobile, isOpen }) => {
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

  // Ref to track sidebar scroll position
  const sidebarScrollRef = useRef(null);

  // Restore scroll position on mount and after navigation
  useEffect(() => {
    const restoreScrollPosition = () => {
      const savedPosition = sessionStorage.getItem('sidebarScrollPosition');
      if (sidebarScrollRef.current && savedPosition) {
        const position = parseInt(savedPosition, 10);
        // Use multiple methods to ensure scroll position is restored
        sidebarScrollRef.current.scrollTop = position;
        
        requestAnimationFrame(() => {
          if (sidebarScrollRef.current) {
            sidebarScrollRef.current.scrollTop = position;
          }
        });
        
        // Fallback with slight delay
        setTimeout(() => {
          if (sidebarScrollRef.current) {
            sidebarScrollRef.current.scrollTop = position;
          }
        }, 100);
      }
    };

    restoreScrollPosition();
  }, [location.pathname]);

  // Save scroll position periodically
  useEffect(() => {
    const sidebar = sidebarScrollRef.current;
    if (!sidebar) return;

    const handleScroll = () => {
      sessionStorage.setItem('sidebarScrollPosition', sidebar.scrollTop.toString());
    };

    sidebar.addEventListener('scroll', handleScroll, { passive: true });
    return () => sidebar.removeEventListener('scroll', handleScroll);
  }, []);

  // Save collapse state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed);
  }, [isCollapsed]);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const handleCollapseMouseEnter = useCallback((e) => {
    e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(98, 55, 160, 0.05)';
  }, [isDark]);

  const handleCollapseMouseLeave = useCallback((e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  }, []);

  const isActivePath = useCallback((to, extraPaths = []) =>
    location.pathname.toLowerCase() === to.toLowerCase() ||
    extraPaths.map((p) => p.toLowerCase()).includes(location.pathname.toLowerCase()),
    [location.pathname]
  );

  

  if (isMobile && !isOpen) return null;

  // Filter navigation sections based on permissions - memoize to prevent recalculation
  const visibleNavSections = useMemo(() => {
    return navSections.map(section => ({
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
  }, [hasPermission]);

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
        borderRight: `1px solid var(--border-color)`,
        scrollBehavior: 'auto'
      }}
    >
      <div 
        ref={sidebarScrollRef}
        className="sidebar-scroll-container flex-1 overflow-y-auto p-3" 
        style={{ scrollBehavior: 'auto', overflowAnchor: 'none' }}
      >
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
            onClick={toggleCollapse}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-3 py-1.5 rounded-md transition-all`}
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={handleCollapseMouseEnter}
            onMouseLeave={handleCollapseMouseLeave}
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
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
