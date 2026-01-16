import {
  Layers,
  User,
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
import { useUser } from "../context/UserContext";
import { useState, useEffect } from "react";
import api from "../src/api";
import socket from "../src/socket";

const navItems = [
  { to: "/dashboard", icon: Activity, label: "Dashboard", roles: [1, 3] }, // Admin & Agent
  { to: "/queues", icon: Layers, label: "Queues", roles: [1, 3], showBadge: true, badgeKey: "pendingChats" }, // Admin & Agent
  { to: "/chats", icon: MessageSquare, label: "Chats", roles: [1, 3], showBadge: true, badgeKey: "activeChats" }, // Admin & Agent
  { to: "/department", icon: Grid, label: "Department", roles: [1], permission: "priv_can_manage_dept" }, // Admin only
  { to: "/auto-replies", icon: Repeat, label: "Auto-Replies", roles: [1], permission: "priv_can_manage_auto_reply" }, // Admin only
  { to: "/manage-admin", icon: UserCheck, label: "Manage Admin", roles: [1], permission: "priv_can_create_account" }, // Admin only
  { to: "/roles", icon: Command, label: "Roles", roles: [1], permission: "priv_can_manage_role" }, // Admin only
];

const dropdownItems = [
  {
    id: "users",
    icon: Users,
    roles: [1], // Admin only
    items: [
      { to: "/manage-agents", label: "Manage Agents", permission: "priv_can_create_account" },
      { to: "/change-role", label: "Change Roles", permission: "priv_can_assign_role" },
    ],
  },
  {
    id: "macros",
    icon: List,
    roles: [1, 3], // Admin & Agent
    items: [
      { to: "/macros-agents", label: "Macros Agents", roles: [1, 3] },
      { to: "/macros-clients", label: "Macros Clients", roles: [1] }, // Admin only
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

const DropdownItem = ({ icon: Icon, items, id, isOpen, toggleDropdown, userRoleId, hasPermission }) => {
  const location = useLocation();
  
  // Filter items based on role and permissions
  const visibleItems = items.filter(item => {
    // Check role access
    if (item.roles && !item.roles.includes(userRoleId)) return false;
    // Check permission if specified
    if (item.permission && !hasPermission(item.permission)) return false;
    return true;
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
    const fetchCounts = async () => {
      try {
        // TODO: Replace with actual API endpoint
        const res = await api.get("/chat/counts");
        setCounts({
          pendingChats: res.data.pendingChats || 0,
          activeChats: res.data.activeChats || 0
        });
      } catch (error) {
        console.error("Failed to fetch chat counts:", error);
        // Fallback to simulated data for development
        setCounts({
          pendingChats: 8,
          activeChats: 23
        });
      }
    };

    if (userData) {
      // Connect socket if not already connected
      if (!socket.connected) {
        socket.connect();
      }

      // Fetch initial counts
      fetchCounts();

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
          fetchCounts();
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

  const userRoleId = userData?.role_id;

  // Filter navigation items based on role and permissions
  const visibleNavItems = navItems.filter(item => {
    // Check role access
    if (item.roles && !item.roles.includes(userRoleId)) {
      return false;
    }
    
    // Check permission if specified
    if (item.permission && !hasPermission(item.permission)) {
      return false;
    }
    
    return true;
  });

  // Filter dropdown items based on role
  const visibleDropdownItems = dropdownItems.filter(item => {
    if (item.roles && !item.roles.includes(userRoleId)) return false;
    return true;
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
            userRoleId={userRoleId}
            hasPermission={hasPermission}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;