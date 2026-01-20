import {
  Layers,
  MessageSquare,
  Grid,
  Users,
  Repeat,
  List,
  UserCheck,
  Command,
  ChevronDown,
  ChevronUp,
  Activity
} from "react-feather";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../../src/context/UserContext";
import { useState, useEffect } from "react";
import socket from "../../socket";
import { ROUTES } from "../../constants/routes";

const navItems = [
  { to: ROUTES.DASHBOARD, icon: Activity, label: "Dashboard" }, // Always accessible - landing page
  { to: ROUTES.QUEUES, icon: Layers, label: "Queues", permission: "priv_can_view_message", showBadge: true, badgeKey: "pendingChats" },
  { to: ROUTES.CHATS, icon: MessageSquare, label: "Chats", permission: "priv_can_view_message", showBadge: true, badgeKey: "activeChats" },
  { to: ROUTES.DEPARTMENTS, icon: Grid, label: "Department", permission: "priv_can_manage_dept" },
  { to: ROUTES.AUTO_REPLIES, icon: Repeat, label: "Auto-Replies", permission: "priv_can_manage_auto_reply" },
  { to: ROUTES.MANAGE_ADMIN, icon: UserCheck, label: "Manage Admin", permission: "priv_can_create_account" },
  { to: ROUTES.ROLES, icon: Command, label: "Roles", permission: "priv_can_manage_role" },
];

const dropdownItems = [
  {
    id: "users",
    icon: Users,
    items: [
      { to: ROUTES.MANAGE_AGENTS, label: "Manage Agents", permission: "priv_can_create_account" },
      { to: ROUTES.CHANGE_ROLE, label: "Change Roles", permission: "priv_can_assign_role" },
    ],
  },
  {
    id: "macros",
    icon: List,
    items: [
      { to: ROUTES.MACROS_AGENTS, label: "Macros Agents", permission: "priv_can_use_canned_mess" },
      { to: ROUTES.MACROS_CLIENTS, label: "Macros Clients", permission: "priv_can_use_canned_mess" },
    ],
  },
];

const NavItem = ({ to, Icon, label, isActive, badgeCount }) => (
  <div className="relative" key={to}>
    {isActive && (
      <motion.div
        layoutId="activeHighlight"
        className="absolute inset-0 rounded-lg bg-[#6237A0] z-0"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
    <Link
      to={to}
      className={`relative flex items-center gap-3 px-3 py-2 rounded-lg z-10 ${
        isActive ? "text-white" : "text-black hover:text-gray-700"
      }`}
    >
      <Icon size={18} strokeWidth={1} />
      <span className="w-full text-left">{label}</span>
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${
          isActive 
            ? "bg-white text-[#6237A0]" 
            : "bg-[#6237A0] text-white"
        }`}>
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      )}
    </Link>
  </div>
);

const DropdownItem = ({ icon: Icon, items, id, isOpen, toggleDropdown, hasPermission }) => {
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
    if (!(isOpen && isActive)) {
      toggleDropdown(id);
    }
  };

  return (
    <div className="relative">
      {isActive && (
        <motion.div
          layoutId="activeHighlight"
          className="absolute inset-0 rounded-lg bg-[#6237A0] z-0"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <button
        onClick={handleDropdownToggle}
        className={`relative flex items-center gap-3 px-3 py-2 w-full rounded-lg z-10 ${
          isActive ? "text-white" : "text-black hover:text-gray-700"
        }`}
      >
        <Icon size={18} strokeWidth={1} />
        <span className="w-full text-left">
          {activeItem?.label || id.charAt(0).toUpperCase() + id.slice(1)}
        </span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg border border-gray-100 rounded-lg z-50 text-sm text-gray-700"
          >
            {visibleItems.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                {label}
              </Link>
            ))}
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

  // Filter navigation items based on permissions only
  const visibleNavItems = navItems.filter(item => {
    // If no permission specified, item is always visible (like Dashboard)
    if (!item.permission) {
      return true;
    }
    
    // Check permission
    return hasPermission(item.permission);
  });

  // Filter dropdown items based on permissions
  const visibleDropdownItems = dropdownItems.filter(item => {
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
      } w-64 bg-white text-black flex-col p-6 shadow-md overflow-y-auto`}
    >
      <nav className="flex flex-col gap-6 mt-4 relative">
        {visibleNavItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            Icon={item.icon}
            label={item.label}
            isActive={isActivePath(item.to)}
            badgeCount={item.showBadge ? counts[item.badgeKey] : undefined}
          />
        ))}

        {visibleDropdownItems.map((item) => (
          <DropdownItem
            key={item.id}
            icon={item.icon}
            id={item.id}
            items={item.items}
            isOpen={openDropdown === item.id}
            toggleDropdown={toggleDropdown}
            hasPermission={hasPermission}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
