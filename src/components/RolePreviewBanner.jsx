// src/components/RolePreviewBanner.jsx
import { Eye, X } from "react-feather";
import { useNavigate } from "react-router-dom";
import { useRolePreview } from "../context/RolePreviewContext";
import { useTheme } from "../context/ThemeContext";
import { ROUTES } from "../constants/routes";

export default function RolePreviewBanner() {
  const { previewMode, previewRole, exitPreview } = useRolePreview();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  if (!previewMode || !previewRole) {
    return null;
  }

  const handleExitPreview = () => {
    exitPreview();
    
    // Get the return path from session storage, default to roles page
    const returnPath = sessionStorage.getItem('previewReturnPath') || ROUTES.ROLES;
    sessionStorage.removeItem('previewReturnPath');
    
    // Navigate back after a short delay
    setTimeout(() => {
      navigate(returnPath);
    }, 100);
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 px-4 py-2.5 flex items-center justify-center gap-3 shadow-lg border-b-2"
      style={{
        backgroundColor: isDark ? '#1a1625' : '#f3e8ff',
        borderColor: '#8B5CF6',
        zIndex: 9999,
      }}
    >
      <div className="flex items-center gap-2">
        <Eye size={18} style={{ color: '#8B5CF6' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          Preview Mode: Viewing as
        </span>
        <span
          className="px-2 py-0.5 rounded text-sm font-semibold"
          style={{
            backgroundColor: '#8B5CF6',
            color: 'white',
          }}
        >
          {previewRole.name}
        </span>
      </div>
      
      <button
        onClick={handleExitPreview}
        className="ml-2 px-3 py-1 rounded text-sm font-medium flex items-center gap-1.5 transition-all hover:scale-105"
        style={{
          backgroundColor: isDark ? '#2d2438' : '#e9d5ff',
          color: '#8B5CF6',
        }}
      >
        <X size={14} />
        Exit Preview
      </button>
    </div>
  );
}
