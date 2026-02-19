import { useState, useCallback, useEffect } from 'react';
import { DashboardService } from '../services/dashboard.service';
import toast from '../utils/toast';

/**
 * useDashboard hook manages dashboard data and state
 * 
 * Features:
 * - Fetch dashboard statistics
 * - Fetch recent activity
 * - Loading and error state management
 * - Auto-fetch on mount
 * 
 * @returns {Object} Dashboard state and actions
 */
export const useDashboard = () => {
  const [stats, setStats] = useState({
    totalChats: 0,
    activeChats: 0,
    pendingChats: 0,
    resolvedToday: 0,
    activeAgents: 0,
    avgResponseTime: "0m",
    myActiveChats: 0,
    myResolvedToday: 0
  });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch dashboard statistics
   * @returns {Promise<Object>} Dashboard stats
   */
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DashboardService.getStats();
      setStats(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch dashboard stats';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch recent activity
   * @returns {Promise<Array>} Recent activity list
   */
  const fetchActivity = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DashboardService.getRecentActivity();
      setActivity(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch recent activity';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch all dashboard data
   * Fetches both stats and activity
   */
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, activityData] = await Promise.all([
        DashboardService.getStats(),
        DashboardService.getRecentActivity()
      ]);
      setStats(statsData);
      setActivity(activityData);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch dashboard data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    activity,
    loading,
    error,
    fetchStats,
    fetchActivity,
    fetchDashboardData
  };
};
