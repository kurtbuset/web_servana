import { useState, useEffect } from 'react';
import RoleService from '../services/role.service';

/**
 * Custom hook to fetch role ID by role name
 * @param {string} roleName - The name of the role (e.g., "Agent", "Client")
 * @returns {Object} { roleId, loading, error }
 */
export const useRoleId = (roleName) => {
  const [roleId, setRoleId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoleId = async () => {
      if (!roleName) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const id = await RoleService.getRoleIdByName(roleName);
        setRoleId(id);
      } catch (err) {
        console.error(`Error fetching role ID for "${roleName}":`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleId();
  }, [roleName]);

  return { roleId, loading, error };
};

export default useRoleId;