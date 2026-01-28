import {
  Layers,
  MessageSquare,
  Users,
  UserCheck,
  ChevronDown,
  Activity,
  Shield,
  MessageCircle,
  Zap,
  Key,
  FileText,
  Headphones,
  Cpu,
  ChevronsLeft,
  ChevronsRight
} from "react-feather";
import { HiOfficeBuilding } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../../src/context/UserContext";
import { useState, useEffect } from "react";
import socket from "../../socket";
import { ROUTES } from "../../constants/routes";

const navSections = [
  {
    title: "Overview",
    items: [
      { 
        to: ROUTES.DASHBOARD, 
        icon: Activity, 
        label: "Dashboard"
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
        permission: "priv_can_view_message", 
        showBadge: true, 
        badgeKey: "pendingChats"
      },
      { 
        to: ROUTES.CHATS, 
        icon: MessageSquare, 
        label: "Active Chats", 
        permission: "priv_can_view_message", 
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
        permission: "priv_can_manage_dept"
      },
      { 
        to: ROUTES.AUTO_REPLIES, 
        icon: Cpu, 
        label: "Auto-Replies", 
        permission: "priv_can_manage_auto_reply"
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
        permission: "priv_can_create_account"
      },
      { 
        to: ROUTES.CHANGE_ROLE, 
        icon: UserCheck, 
        label: "Change Roles", 
        permission: "priv_can_assign_role"
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
        permission: "priv_can_use_canned_mess"
      },
      { 
        to: ROUTES.MACROS_CLIENTS, 
        icon: FileText, 
        label: "Client Macros", 
        permission: "priv_can_use_canned_mess"
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
        permission: "priv_can_create_account"
      },
      { 
        to: ROUTES.ROLES, 
        icon: Key, 
        label: "Roles & Permissions", 
        permission: "priv_can_manage_role"
      }
    ]
  }
];



const NavItem = ({ to, Icon, label, isActive, badgeCount, isCollapsed }) => (
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
      className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-3 py-1.5 rounded-md z-10 transition-all duration-200 ${
        isActive 
          ? "text-white shadow-lg" 
          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
      }`}
      title={isCollapsed ? label : ''}
    >
      <div className={`p-0.5 rounded ${isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
        <Icon size={13} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'text-white' : 'text-gray-600'} />
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

const SectionHeader = ({ title, isCollapsed }) => {
  if (isCollapsed) return <div className="h-px bg-gray-200 mx-2 my-1.5" />;
  
  return (
    <div className="px-3 py-1 mb-0.5">
      <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
        {title}
      </h3>
    </div>
  );
};



const Sidebar = ({ isMobile, isOpen, toggleDropdown, openDropdown }) => {
  const location = useLocation();
  const { userData, hasPermission } = useUser();
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

  // Fetch initial chat counts and set up WebSocket listeners
  useEffect(() => {
    // const fetchCounts = async () => {
    //   try {
    //     // TODO: Replace with actual API endpoint
    //     const res = await api.get("/chat/counts");
    //     setCounts({
    //       pendingChats: res.data.pendingChats || 0,
    //       activeChats: res.data.activeChats || 0
    //     });
    //   } catch (error) {
    //     console.error("Failed to fetch chat counts:", error);
    //     // Fallback to simulated data for development
    //     setCounts({
    //       pendingChats: 8,
    //       activeChats: 23
    //     });
    //   }
    // };

    if (userData) {
      // Connect socket if not already connected
      if (!socket.connected) {
        socket.connect();
      }

      // Fetch initial counts
      // fetchCounts();

      // Listen for real-time count updates
      socket.on("chatCountsUpdate", (data) => {
        setCounts({
          pendingChats: data.pendingChats || 0,
          activeChats: data.activeChats || 0
        });
      });

      // Listen for new chat in queue
      socket.on("newChatInQueue", () => {
        setCounts(prev => ({
          ...prev,
          pendingChats: prev.pendingChats + 1
        }));
      });

      // Listen for chat accepted (moved from queue to active)
      socket.on("chatAccepted", () => {
        setCounts(prev => ({
          pendingChats: Math.max(0, prev.pendingChats - 1),
          activeChats: prev.activeChats + 1
        }));
      });

      // Listen for chat closed/resolved
      socket.on("chatClosed", () => {
        setCounts(prev => ({
          ...prev,
          activeChats: Math.max(0, prev.activeChats - 1)
        }));
      });

      // Listen for message read/seen event
      socket.on("messagesSeen", (data) => {
        // When user views a chat, decrease unread count
        // This assumes the backend sends which chat was viewed
        if (data.chatGroupId) {
          // Optionally refresh counts or handle specific chat
          // fetchCounts();
        }
      });

      // Cleanup on unmount
      return () => {
        socket.off("chatCountsUpdate");
        socket.off("newChatInQueue");
        socket.off("chatAccepted");
        socket.off("chatClosed");
        socket.off("messagesSeen");
      };
    }
  }, [userData]);

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
      } ${isCollapsed ? 'w-20' : 'w-56'} bg-white text-black flex-col shadow-lg border-r border-gray-200 transition-all duration-300`}
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
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Collapse Toggle Button at Bottom - Desktop Only */}
      {!isMobile && (
        <div className="border-t border-gray-200 p-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronsRight size={15} className="text-gray-600" />
            ) : (
              <>
                <ChevronsLeft size={15} className="text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Collapse</span>
              </>
            )}
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
