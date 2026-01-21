import { useState, useEffect, useCallback } from "react";
import AutoReplyService from "../services/autoReply.service";
import { toast } from "react-toastify";

/**
 * useAutoReplies Hook
 * Manages auto-reply CRUD operations with loading/error states and duplicate detection
 */
export const useAutoReplies = () => {
  const [replies, setReplies] = useState([]);
  const [activeDepartments, setActiveDepartments] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all auto-replies
   */
  const fetchReplies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AutoReplyService.getAutoReplies();
      setReplies(data);
    } catch (err) {
      console.error("Failed to fetch auto replies:", err);
      setError(err.message || "Failed to fetch auto replies");
      toast.error("Failed to load auto-replies. Please refresh the page.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch departments
   */
  const fetchDepartments = useCallback(async () => {
    try {
      const [active, all] = await Promise.all([
        AutoReplyService.getActiveDepartments(),
        AutoReplyService.getAllDepartments(),
      ]);
      setActiveDepartments(active);
      setAllDepartments(all);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  }, []);

  /**
   * Create a new auto-reply
   */
  const createAutoReply = useCallback(
    async (message, deptId, createdBy) => {
      if (!message.trim()) {
        toast.error("Message cannot be empty", {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }

      try {
        await AutoReplyService.createAutoReply({
          message,
          dept_id: deptId,
          created_by: createdBy,
        });

        toast.success("Auto-reply added successfully", {
          position: "top-right",
          autoClose: 3000,
        });

        // Refresh replies list
        await fetchReplies();
        return true;
      } catch (err) {
        console.error("Failed to add reply:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to add auto-reply";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }
    },
    [fetchReplies]
  );

  /**
   * Update an existing auto-reply
   */
  const updateAutoReply = useCallback(
    async (autoReplyId, message, deptId, updatedBy) => {
      if (message !== undefined && !message.trim()) {
        toast.error("Message cannot be empty", {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }

      try {
        await AutoReplyService.updateAutoReply(autoReplyId, {
          message,
          dept_id: deptId,
          updated_by: updatedBy,
        });

        toast.success("Auto-reply updated successfully", {
          position: "top-right",
          autoClose: 3000,
        });

        // Refresh replies list
        await fetchReplies();
        return true;
      } catch (err) {
        console.error("Failed to save reply:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update auto-reply";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }
    },
    [fetchReplies]
  );

  /**
   * Toggle auto-reply active status
   */
  const toggleAutoReply = useCallback(
    async (autoReplyId, currentActive, updatedBy) => {
      try {
        await AutoReplyService.toggleAutoReply(
          autoReplyId,
          !currentActive,
          updatedBy
        );

        // Update local state immediately
        setReplies((prev) =>
          prev.map((r) =>
            r.auto_reply_id === autoReplyId
              ? { ...r, auto_reply_is_active: !currentActive }
              : r
          )
        );

        toast.success(
          `Auto-reply ${!currentActive ? "activated" : "deactivated"} successfully`,
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
        return true;
      } catch (err) {
        console.error("Failed to toggle status:", err);
        toast.error("Failed to update auto-reply status", {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }
    },
    []
  );

  /**
   * Update department for an auto-reply
   */
  const updateDepartment = useCallback(
    async (autoReplyId, newDeptId, updatedBy) => {
      try {
        await AutoReplyService.updateAutoReply(autoReplyId, {
          dept_id: newDeptId,
          updated_by: updatedBy,
        });

        // Update local state immediately
        setReplies((prev) =>
          prev.map((r) =>
            r.auto_reply_id === autoReplyId ? { ...r, dept_id: newDeptId } : r
          )
        );

        toast.success("Department updated successfully", {
          position: "top-right",
          autoClose: 2000,
        });
        return true;
      } catch (err) {
        console.error("Failed to update department:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update department";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }
    },
    []
  );

  // Fetch data on mount
  useEffect(() => {
    fetchReplies();
    fetchDepartments();
  }, [fetchReplies, fetchDepartments]);

  return {
    replies,
    activeDepartments,
    allDepartments,
    loading,
    error,
    fetchReplies,
    createAutoReply,
    updateAutoReply,
    toggleAutoReply,
    updateDepartment,
  };
};
