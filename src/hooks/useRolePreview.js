// src/hooks/useRolePreview.js
import { useRolePreviewStore } from "../stores";

/**
 * Backward-compatible hook for RolePreviewContext
 * Provides the same API as the old useRolePreview() hook
 */
export const useRolePreview = () => {
  const previewMode = useRolePreviewStore((state) => state.previewMode);
  const previewRole = useRolePreviewStore((state) => state.previewRole);
  const previewPermissions = useRolePreviewStore(
    (state) => state.previewPermissions,
  );
  const loading = useRolePreviewStore((state) => state.loading);
  const startPreview = useRolePreviewStore((state) => state.startPreview);
  const exitPreview = useRolePreviewStore((state) => state.exitPreview);
  const hasPreviewPermission = useRolePreviewStore(
    (state) => state.hasPreviewPermission,
  );

  return {
    previewMode,
    previewRole,
    previewPermissions,
    loading,
    startPreview,
    exitPreview,
    hasPreviewPermission,
  };
};
