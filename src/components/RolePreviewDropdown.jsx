// src/components/RolePreviewDropdown.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, ChevronRight } from "react-feather";
import { useRolePreview } from "../context/RolePreviewContext";
import { useTheme } from "../context/ThemeContext";
import { ROUTES } from "../constants/routes";
import toast from "../utils/toast";

export default function RolePreviewDropdown({ role, onClose }) {
  const [showMenu, setShowMenu] = useState(false);
  const { startPreview } = useRolePreview();
  const { isDark } = useTheme();
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleViewAsRole = async () => {
    try {
      // Save current path to return to later
      sessionStorage.setItem('previewReturnPath', location.pathname);
      
      // Start preview mode
      await startPreview(role.role_id, role.name);
      
      toast.success(`Now previewing as ${role.name}`);
      setShowMenu(false);
      if (onClose) onClose();
      
      // Navigate to dashboard after preview mode is activated
      setTimeout(() => {
        navigate(ROUTES.DASHBOARD);
      }, 100);
    } catch (error) {
      toast.error("Failed to start preview mode");
    }
  };

  const handleCopyRoleId = () => {
    navigator.clipboard.writeText(role.role_id.toString());
    toast.success("Role ID copied to clipboard");
    setShowMenu(false);
    if (onClose) onClose();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-1.5 rounded hover:bg-opacity-10 transition-colors"
        style={{
          backgroundColor: showMenu ? (isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)') : 'transparent',
        }}
        title="Role options"
      >
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--text-secondary)' }}></div>
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--text-secondary)' }}></div>
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--text-secondary)' }}></div>
        </div>
      </button>

      {showMenu && (
        <div
          className="absolute right-0 mt-1 w-56 rounded-lg shadow-xl border z-50 overflow-hidden"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
          }}
        >
          <button
            onClick={handleViewAsRole}
            className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-opacity-5 transition-colors text-left"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div className="flex items-center gap-3">
              <Eye size={16} style={{ color: '#8B5CF6' }} />
              <span className="text-sm font-medium">View Server As Role</span>
            </div>
            <ChevronRight size={14} style={{ color: 'var(--text-secondary)' }} />
          </button>

          <div className="h-px" style={{ backgroundColor: 'var(--border-color)' }}></div>

          <button
            onClick={handleCopyRoleId}
            className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-opacity-5 transition-colors text-left"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div className="flex items-center justify-center w-4 h-4 rounded" style={{ backgroundColor: 'var(--text-secondary)' }}>
              <span className="text-xs font-bold" style={{ color: 'var(--card-bg)' }}>ID</span>
            </div>
            <span className="text-sm">Copy Role ID</span>
          </button>
        </div>
      )}
    </div>
  );
}
