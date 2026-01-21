import { useState, useEffect, useCallback } from "react";
import RoleService from "../services/role.service";
import { toast } from "react-toastify";

/**
 * useRoles Hook
 * Manages role CRUD operations with loading/error states
 */
export const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all roles
   */
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await RoleService.getRoles();
      setRoles(data);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
      setError(err.message || "Failed to load roles");
      toast.error("Failed to load roles. Please refresh the page.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new role
   */
  const createRole = useCallback(
    async (roleData) => {
      try {
        await RoleService.createRole(roleData);
        toast.success("Role added successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        // Refresh roles list
        await fetchRoles();
        return true;
      } catch (err) {
        console.error("Failed to create role:", err);
        const errorMessage = err.response?.data?.error || "Failed to save role";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }
    },
    [fetchRoles]
  );

  /**
   * Update an existing role
   */
  const updateRole = useCallback(
    async (roleId, roleData) => {
      try {
        await RoleService.updateRole(roleId, roleData);
        toast.success("Role updated successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        // Refresh roles list
        await fetchRoles();
        return true;
      } catch (err) {
        console.error("Failed to update role:", err);
        const errorMessage = err.response?.data?.error || "Failed to save role";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }
    },
    [fetchRoles]
  );

  /**
   * Toggle role active status
   */
  const toggleRoleActive = useCallback(
    async (roleId, currentActive, roleName, rolePermissions, updatedBy) => {
      try {
        await RoleService.updateRole(roleId, {
          name: roleName,
          active: !currentActive,
          permissions: rolePermissions,
          updated_by: updatedBy,
        });

        // Update local state immediately
        setRoles((prev) =>
          prev.map((r) =>
            r.role_id === roleId ? { ...r, active: !currentActive } : r
          )
        );

        toast.success(
          `Role ${!currentActive ? "activated" : "deactivated"} successfully`,
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
        return true;
      } catch (err) {
        console.error("Failed to toggle role active status:", err);
        const errorMessage =
          err.response?.data?.error || "Failed to update role status";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }
    },
    []
  );

  /**
   * Toggle a specific permission for a role
   */
  const togglePermission = useCallback(
    async (roleId, permission, currentPermissions, roleName, roleActive, updatedBy) => {
      const updatedPermissions = currentPermissions.includes(permission)
        ? currentPermissions.filter((p) => p !== permission)
        : [...currentPermissions, permission];

      try {
        await RoleService.updateRole(roleId, {
          name: roleName,
          active: roleActive,
          permissions: updatedPermissions,
          updated_by: updatedBy,
        });

        // Update local state immediately
        setRoles((prev) =>
          prev.map((r) =>
            r.role_id === roleId ? { ...r, permissions: updatedPermissions } : r
          )
        );

        toast.success("Permission updated successfully", {
          position: "top-right",
          autoClose: 2000,
        });
        return true;
      } catch (err) {
        console.error("Failed to update permission:", err);
        const errorMessage =
          err.response?.data?.error || "Failed to update permission";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }
    },
    []
  );

  // Fetch roles on mount
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    loading,
    error,
    fetchRoles,
    createRole,
    updateRole,
    toggleRoleActive,
    togglePermission,
  };
};

/**
 * useUserRoles Hook
 * Manages user role assignments with loading/error states
 */
export const useUserRoles = () => {
  const [users, setUsers] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch users and available roles
   */
  const fetchUsersAndRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, rolesData] = await Promise.all([
        RoleService.getUsersWithRoles(),
        RoleService.getAvailableRoles(),
      ]);
      setUsers(usersData);
      setAvailableRoles(rolesData);
    } catch (err) {
      console.error("Failed to fetch users and roles:", err);
      setError(err.message || "Failed to load accounts");
      toast.error("Failed to load accounts. Please refresh the page.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a user's role
   */
  const changeUserRole = useCallback(async (userId, newRoleId) => {
    try {
      await RoleService.updateUserRole(userId, newRoleId);

      // Update local state immediately
      setUsers((prev) =>
        prev.map((user) =>
          user.sys_user_id === userId ? { ...user, role_id: newRoleId } : user
        )
      );

      toast.success("User role updated successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      return true;
    } catch (err) {
      console.error("Failed to update user role:", err);
      const errorMessage = err.response?.data?.error || "Failed to update user";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }
  }, []);

  /**
   * Toggle user active status
   */
  const toggleUserActive = useCallback(async (userId, currentActive) => {
    try {
      await RoleService.toggleUserActive(userId, !currentActive);

      // Update local state immediately
      setUsers((prev) =>
        prev.map((user) =>
          user.sys_user_id === userId
            ? { ...user, sys_user_is_active: !currentActive }
            : user
        )
      );

      toast.success(
        `User ${!currentActive ? "activated" : "deactivated"} successfully`,
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
      return true;
    } catch (err) {
      console.error("Failed to toggle user active status:", err);
      const errorMessage = err.response?.data?.error || "Failed to update user";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchUsersAndRoles();
  }, [fetchUsersAndRoles]);

  return {
    users,
    availableRoles,
    loading,
    error,
    fetchUsersAndRoles,
    changeUserRole,
    toggleUserActive,
  };
};
