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
  Cpu
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

const dropdownSections = [
  {
    id: "user-management",
    icon: Users,
    label: "User Management",
    items: [
      { 
        to: ROUTES.MANAGE_AGENTS, 
        label: "Manage Agents", 
        icon: Headphones,
        permission: "priv_can_create_account"
      },
      { 
        to: ROUTES.CHANGE_ROLE, 
        label: "Change Roles", 
        icon: UserCheck,
        permission: "priv_can_assign_role"
      }
    ]
  },
  {
    id: "automation",
    icon: Zap,
    label: "Automation Tools",
    items: [
      { 
        to: ROUTES.MACROS_AGENTS, 
        label: "Agent Macros", 
        icon: MessageCircle,
        permission: "priv_can_use_canned_mess"
      },
      { 
        to: ROUTES.MACROS_CLIENTS, 
        label: "Client Macros", 
        icon: FileText,
        permission: "priv_can_use_canned_mess"
      }
    ]
  }
];

const NavItem = ({ to, Icon, label, isActive, badgeCount }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
  >
    <div className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
      <Icon size={14} strokeWidth={1.5} className="text-gray-600 dark:text-gray-400" />
    </div>
    <div className="flex-1 min-w-0">
      <div className={`font-medium text-xs ${isActive ? 'text-[#6237A0] dark:text-purple-400' : ''}`}>
        {label}
      </div>
    </div>
    {badgeCount !== undefined && badgeCount > 0 && (
      <span className="px-2 py-1 rounded-full text-xs font-bold bg-[#6237A0] dark:bg-purple-600 text-white shadow-sm">
        {badgeCount > 99 ? '99+' : badgeCount}
      </span>
    )}
  </Link>
);

const SectionHeader = ({ title }) => (
  <div className="px-4 py-2 mb-1">
    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      {title}
    </h3>
  </div>
);

const DropdownItem = ({ icon: Icon, label, items, id, isOpen, toggleDropdown, hasPermission }) => {
  const location = useLocation();
  
  // Filter items based on permissions only
  const visibleItems = items.filter(item => {
    // If no permission specified, item is always visible
    if (!item.permission) return true;
    // Check permission
    return hasPermission(item.permission);
  });

  // Don't render if no visible items
  if (visibleItems.length === 0) return null;

  const activeItem = visibleItems.find((item) => location.pathname === item.to);
  const isActive = !!activeItem;

  const handleDropdownToggle = () => {
    toggleDropdown(isOpen ? null : id);
  };

  return (
    <div className="relative">
      <button
        onClick={handleDropdownToggle}
        className="flex items-center gap-3 px-4 py-2 w-full rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <div className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
          <Icon size={14} strokeWidth={1.5} className="text-gray-600 dark:text-gray-400" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className={`font-medium text-xs ${isActive ? 'text-[#6237A0] dark:text-purple-400' : ''}`}>
            {activeItem?.label || label}
          </div>
        </div>
        <ChevronDown 
          size={12} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-gray-400 dark:text-gray-500`} 
        />
      </button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl z-50 overflow-hidden"
          >
            <div className="p-2">
              {visibleItems.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  onClick={() => toggleDropdown(null)} // Close dropdown when item is clicked
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs text-gray-900 dark:text-gray-100">{label}</div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

  // Filter dropdown items based on permissions
  const visibleDropdownItems = dropdownSections.filter(item => {
    // Check if dropdown has any visible items
    const visibleItems = item.items.filter(subItem => {
      if (!subItem.permission) return true;
      return hasPermission(subItem.permission);
    });
    
    // Only show dropdown if it has visible items
    return visibleItems.length > 0;
  });

  return (
    <aside
      className={`${
        isMobile
          ? "absolute top-16 left-0 z-40 h-[calc(100vh-4rem)]"
          : "hidden md:flex"
      } w-72 bg-white dark:bg-gray-800 text-black dark:text-white flex-col shadow-lg dark:shadow-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto transition-colors duration-200`}
    >
      <div className="p-4">
        <nav className="space-y-4">
          {/* Navigation Sections */}
          {visibleNavSections.map((section) => (
            <div key={section.title}>
              <SectionHeader title={section.title} />
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    Icon={item.icon}
                    label={item.label}
                    isActive={isActivePath(item.to)}
                    badgeCount={item.showBadge ? counts[item.badgeKey] : undefined}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Dropdown Sections */}
          {visibleDropdownItems.length > 0 && (
            <div>
              <SectionHeader title="Advanced Tools" />
              <div className="space-y-1">
                {visibleDropdownItems.map((item) => (
                  <DropdownItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    id={item.id}
                    items={item.items}
                    isOpen={openDropdown === item.id}
                    toggleDropdown={toggleDropdown}
                    hasPermission={hasPermission}
                  />
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;