import { useState, useEffect, useCallback, useMemo } from 'react';
import analyticsService from '../services/analytics.service';
import { useUser } from '../context/UserContext';

/**
 * Unified Analytics Hook
 * Provides both legacy and enhanced analytics in one hook
 * Includes ART (Average Response Time) formula and agent performance
 * Automatically shows individual agent data for agents, system-wide data for admins
 * Supports specific date selection for daily analytics, week selection for weekly analytics,
 * month selection for monthly analytics, and year selection for yearly analytics
 */
export const useAnalytics = (period = 'weekly', selectedDate = null, selectedWeek = null, selectedMonth = null, selectedYear = null) => {
  const { userData, getRoleName } = useUser();
  
  // Legacy analytics state
  const [messageAnalytics, setMessageAnalytics] = useState(null);
  const [responseTimeAnalytics, setResponseTimeAnalytics] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [customerSatisfaction, setCustomerSatisfaction] = useState(null);
  const [topConversations, setTopConversations] = useState(null);
  
  // Enhanced analytics state
  const [enhancedResponseTime, setEnhancedResponseTime] = useState(null);
  const [agentPerformance, setAgentPerformance] = useState([]);
  
  // Common state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine if current user is an agent (should see individual analytics)
  const isAgent = useCallback(() => {
    const roleName = getRoleName();
    return roleName === 'Agent';
  }, [getRoleName]);

  // Memoize agent status to prevent unnecessary re-renders
  const agentOnly = useMemo(() => isAgent(), [isAgent]);

  // Fetch all analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching analytics for period:', period, 'selectedDate:', selectedDate, 'selectedWeek:', selectedWeek, 'selectedMonth:', selectedMonth, 'selectedYear:', selectedYear);
      console.log('Agent-only mode:', agentOnly, 'Role:', getRoleName());

      // Prepare date parameters for daily, weekly, monthly, and yearly analytics
      const dateParams = {};
      if (period === 'daily' && selectedDate) {
        dateParams.date = selectedDate;
      } else if (period === 'weekly' && selectedWeek) {
        dateParams.week = selectedWeek;
      } else if (period === 'monthly' && selectedMonth) {
        dateParams.month = selectedMonth;
      } else if (period === 'yearly' && selectedYear) {
        dateParams.year = selectedYear;
      }

      // Fetch legacy analytics (always available)
      const [messages, responseTime, stats, satisfaction] = await Promise.all([
        analyticsService.getMessageAnalytics(period, agentOnly, dateParams),
        analyticsService.getResponseTimeAnalytics(period, dateParams),
        analyticsService.getDashboardStats(dateParams),
        analyticsService.getCustomerSatisfactionAnalytics(period, agentOnly, dateParams)
      ]);

      console.log('Received message analytics:', messages);
      console.log('Received response time analytics:', responseTime);
      console.log('Received dashboard stats:', stats);
      console.log('Received customer satisfaction:', satisfaction);

      setMessageAnalytics(messages);
      setResponseTimeAnalytics(responseTime);
      setDashboardStats(stats);
      setCustomerSatisfaction(satisfaction);

      // Fetch top conversations only for agents
      if (agentOnly) {
        try {
          const topConv = await analyticsService.getTopConversations(period, 5, dateParams);
          console.log('Received top conversations:', topConv);
          setTopConversations(topConv);
        } catch (topConvError) {
          console.log('Top conversations not available:', topConvError.message);
          setTopConversations(null);
        }
      } else {
        setTopConversations(null);
      }

      // Try to fetch enhanced analytics (may not be available if migration not run)
      try {
        const [enhancedRT, agentPerf] = await Promise.all([
          analyticsService.getEnhancedResponseTimeAnalytics(period, dateParams),
          analyticsService.getAgentPerformanceAnalytics(null, period, dateParams)
        ]);

        console.log('Received enhanced response time analytics:', enhancedRT);
        console.log('Received agent performance analytics:', agentPerf);

        setEnhancedResponseTime(enhancedRT);
        setAgentPerformance(agentPerf);
      } catch (enhancedError) {
        console.log('Enhanced analytics not available (migration may not be run):', enhancedError.message);
        // Don't set error - enhanced features are optional
        setEnhancedResponseTime(null);
        setAgentPerformance([]);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, [period, selectedDate, selectedWeek, selectedMonth, selectedYear, agentOnly, getRoleName]);

  // Fetch specific enhanced analytics
  const fetchEnhancedResponseTime = useCallback(async (selectedPeriod = period) => {
    try {
      const data = await analyticsService.getEnhancedResponseTimeAnalytics(selectedPeriod);
      setEnhancedResponseTime(data);
      return data;
    } catch (error) {
      console.error('Error fetching enhanced response time:', error);
      return null;
    }
  }, [period]);

  const fetchAgentPerformance = useCallback(async (sysUserId = null, selectedPeriod = period) => {
    try {
      const data = await analyticsService.getAgentPerformanceAnalytics(sysUserId, selectedPeriod);
      setAgentPerformance(data);
      return data;
    } catch (error) {
      console.error('Error fetching agent performance:', error);
      return [];
    }
  }, [period]);

  // Recalculate response times (admin function)
  const recalculateResponseTimes = useCallback(async () => {
    try {
      setLoading(true);
      const result = await analyticsService.recalculateResponseTimes();
      
      // Refresh all data after recalculation
      await fetchAnalytics();
      
      return result.message || 'Response times recalculated successfully';
    } catch (error) {
      console.error('Error recalculating response times:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchAnalytics]);

  // Helper functions
  const getResponseTimeInsights = useCallback(() => {
    if (!enhancedResponseTime) return null;

    const { overallART, totalResponses, trend } = enhancedResponseTime;
    
    return {
      overallART,
      totalResponses,
      trend,
      performance: overallART < 30 ? 'Excellent' : 
                  overallART < 60 ? 'Good' : 
                  overallART < 120 ? 'Fair' : 'Needs Improvement',
      formatted: enhancedResponseTime.formatted?.overallART || `${overallART}s`
    };
  }, [enhancedResponseTime]);

  const getTopPerformingAgents = useCallback((limit = 5) => {
    return agentPerformance
      .sort((a, b) => a.avg_response_time_seconds - b.avg_response_time_seconds)
      .slice(0, limit);
  }, [agentPerformance]);

  const getAgentsByPerformance = useCallback(() => {
    const excellent = agentPerformance.filter(a => a.performance_rating === 'Excellent');
    const good = agentPerformance.filter(a => a.performance_rating === 'Good');
    const fair = agentPerformance.filter(a => a.performance_rating === 'Fair');
    const needsImprovement = agentPerformance.filter(a => a.performance_rating === 'Needs Improvement');

    return { excellent, good, fair, needsImprovement };
  }, [agentPerformance]);

  // Smart response time data selection
  const getResponseTimeData = useCallback(() => {
    // Prefer enhanced data if available, fallback to legacy
    if (enhancedResponseTime) {
      return {
        type: 'enhanced',
        data: enhancedResponseTime,
        insights: getResponseTimeInsights(),
        formula: 'ART = Total Response Time / Total Responses'
      };
    } else if (responseTimeAnalytics) {
      return {
        type: 'legacy',
        data: responseTimeAnalytics,
        insights: null,
        formula: 'First Response Time Only'
      };
    }
    return null;
  }, [enhancedResponseTime, responseTimeAnalytics, getResponseTimeInsights]);

  // Format time helper
  const formatTime = useCallback((seconds) => {
    if (!seconds || seconds === 0) return '0s';
    
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.round(seconds % 60);
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  }, []);

  // Initialize data on mount and period change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAnalytics();
    }, 100); // 100ms debounce

    return () => clearTimeout(timeoutId);
  }, [fetchAnalytics]);

  const refetch = useCallback(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Refresh function for external use
  const refreshAnalytics = useCallback(() => {
    console.log('🔄 Refreshing analytics due to external trigger');
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    // Legacy analytics (backward compatibility)
    messageAnalytics,
    responseTimeAnalytics,
    dashboardStats,
    customerSatisfaction,
    topConversations,
    
    // Enhanced analytics (new features)
    enhancedResponseTime,
    agentPerformance,
    
    // State
    loading,
    error,
    
    // Actions
    refetch,
    refreshAnalytics,
    fetchEnhancedResponseTime,
    fetchAgentPerformance,
    recalculateResponseTimes,
    
    // Helper functions
    getResponseTimeData,
    getResponseTimeInsights,
    getTopPerformingAgents,
    getAgentsByPerformance,
    formatTime,
    
    // Status flags
    hasEnhancedData: !!enhancedResponseTime,
    hasLegacyData: !!responseTimeAnalytics,
    hasAgentData: agentPerformance.length > 0,
  };
};