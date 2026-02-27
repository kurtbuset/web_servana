import { useState, useEffect, useCallback } from 'react';
import analyticsService from '../services/analytics.service';

export const useAnalytics = (period = 'weekly') => {
  const [messageAnalytics, setMessageAnalytics] = useState(null);
  const [responseTimeAnalytics, setResponseTimeAnalytics] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching analytics for period:', period);

      const [messages, responseTime, stats] = await Promise.all([
        analyticsService.getMessageAnalytics(period),
        analyticsService.getResponseTimeAnalytics(period),
        analyticsService.getDashboardStats()
      ]);

      console.log('Received message analytics:', messages);
      console.log('Received response time analytics:', responseTime);
      console.log('Received dashboard stats:', stats);

      setMessageAnalytics(messages);
      setResponseTimeAnalytics(responseTime);
      setDashboardStats(stats);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const refetch = () => {
    fetchAnalytics();
  };

  return {
    messageAnalytics,
    responseTimeAnalytics,
    dashboardStats,
    loading,
    error,
    refetch
  };
};
