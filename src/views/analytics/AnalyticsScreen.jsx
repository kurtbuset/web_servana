import { useState, useMemo, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import Layout from '../../components/Layout';
import ScreenContainer from '../../components/ScreenContainer';
import { LoadingState } from '../../components/ui';
import { useAnalytics } from '../../hooks/useAnalytics';
import socket, { registerChatEvents } from '../../socket-simple';
import { useTheme } from '../../context/ThemeContext';
import { PeriodSelector } from '../../components/shared';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsScreen = () => {
  // Period state management (same as Dashboard)
  const [period, setPeriod] = useState('weekly');
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(today.setDate(diff));
    return weekStart.toISOString().split('T')[0];
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    return new Date().getFullYear().toString();
  });
  
  // Pass appropriate date parameters based on period
  const analyticsDate = period === 'daily' ? selectedDate : null;
  const analyticsWeek = period === 'weekly' ? selectedWeek : null;
  const analyticsMonth = period === 'monthly' ? selectedMonth : null;
  const analyticsYear = period === 'yearly' ? selectedYear : null;
  
  // Use real analytics data
  const {
    messageAnalytics,
    agentPerformance,
    dashboardStats,
    customerSatisfaction,
    topConversations,
    loading,
    error,
    refetch,
    refreshAnalytics,
    getResponseTimeData,
    getTopPerformingAgents,
    formatTime,
    hasEnhancedData
  } = useAnalytics(period, analyticsDate, analyticsWeek, analyticsMonth, analyticsYear);

  // Memoized period change callback
  const handlePeriodChange = useCallback((newPeriod) => {
    setPeriod(newPeriod);
    // Reset to current values when switching periods
    if (newPeriod === 'daily') {
      setSelectedDate(new Date().toISOString().split('T')[0]);
    } else if (newPeriod === 'weekly') {
      const today = new Date();
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      const weekStart = new Date(today.setDate(diff));
      setSelectedWeek(weekStart.toISOString().split('T')[0]);
    } else if (newPeriod === 'monthly') {
      const today = new Date();
      setSelectedMonth(`${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`);
    } else if (newPeriod === 'yearly') {
      setSelectedYear(new Date().getFullYear().toString());
    }
  }, []);

  // Date change handlers
  const handleDateChange = useCallback((newDate) => {
    setSelectedDate(newDate);
  }, []);

  const handleWeekChange = useCallback((newWeek) => {
    setSelectedWeek(newWeek);
  }, []);

  const handleMonthChange = useCallback((newMonth) => {
    setSelectedMonth(newMonth);
  }, []);

  const handleYearChange = useCallback((newYear) => {
    setSelectedYear(newYear);
  }, []);

  const { isDark } = useTheme();

  // Socket event listeners for real-time analytics updates
  useEffect(() => {
    console.log('🔌 Setting up analytics socket listeners');
    
    const handleChatResolved = (data) => {
      console.log('📈 Analytics: Chat resolved, refreshing data', data);
      // Add a small delay to ensure backend has processed the resolution
      setTimeout(() => {
        refreshAnalytics();
      }, 500);
    };

    const handleCustomerListUpdate = (updateData) => {
      console.log('📈 Analytics: Customer list updated', updateData);
      // Check if it's a chat resolution event
      if (updateData.type === 'chat_resolved') {
        console.log('📈 Analytics: Chat resolved via customer list update');
        setTimeout(() => {
          refreshAnalytics();
        }, 500);
      }
    };

    // Only register listeners if socket is available and connected
    if (socket && socket.connected) {
      console.log('✅ Socket is connected, registering analytics listeners');
      
      // Register socket event listeners
      const cleanup = registerChatEvents(socket, {
        onChatResolved: handleChatResolved,
        onCustomerListUpdate: handleCustomerListUpdate,
      });

      return () => {
        console.log('🔌 Cleaning up analytics socket listeners');
        cleanup();
      };
    } else {
      console.warn('⚠️ Socket not available or not connected, analytics real-time updates disabled');
    }
  }, [refreshAnalytics]);

  // Memoized chart data with proper period handling
  const messagesData = useMemo(() => {
    if (!messageAnalytics?.chartData) {
      // Default data based on period
      const getDefaultLabels = () => {
        switch (period) {
          case 'daily':
            return Array.from({length: 24}, (_, i) => `${i.toString().padStart(2, '0')}:00`);
          case 'weekly':
            return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          case 'monthly':
            // Get the actual number of days in the selected month
            const [year, month] = selectedMonth.split('-').map(Number);
            const daysInMonth = new Date(year, month, 0).getDate();
            return Array.from({length: daysInMonth}, (_, i) => (i + 1).toString().padStart(2, '0'));
          case 'yearly':
            return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          default:
            return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        }
      };
      
      const labels = getDefaultLabels();
      return {
        labels,
        datasets: [{
          label: 'Messages',
          data: labels.map(() => 0),
          borderColor: '#a78bfa',
          backgroundColor: 'rgba(167, 139, 250, 0.08)',
          fill: true,
          tension: 0.4,
          borderWidth: 1.5,
          pointRadius: 2,
          pointHoverRadius: 4,
        }]
      };
    }

    return {
      labels: messageAnalytics.chartData.labels,
      datasets: [
        {
          label: 'Total Messages',
          data: messageAnalytics.chartData.data.map(val => Math.round(val)),
          borderColor: '#a78bfa',
          backgroundColor: 'rgba(167, 139, 250, 0.08)',
          fill: true,
          tension: 0.4,
          borderWidth: 1.5,
          pointRadius: 2,
          pointHoverRadius: 4,
        }
      ]
    };
  }, [messageAnalytics, period]);

  const responseTimeData = useMemo(() => {
    const rtData = getResponseTimeData();
    if (!rtData?.data?.chartData) {
      // Default data based on period
      const getDefaultLabels = () => {
        switch (period) {
          case 'daily':
            return Array.from({length: 24}, (_, i) => `${i.toString().padStart(2, '0')}:00`);
          case 'weekly':
            return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          case 'monthly':
            // Get the actual number of days in the selected month
            const [year, month] = selectedMonth.split('-').map(Number);
            const daysInMonth = new Date(year, month, 0).getDate();
            return Array.from({length: daysInMonth}, (_, i) => (i + 1).toString().padStart(2, '0'));
          case 'yearly':
            return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          default:
            return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        }
      };
      
      const labels = getDefaultLabels();
      return {
        labels,
        datasets: [{
          label: 'Response Time (min)',
          data: labels.map(() => 0),
          borderColor: '#34d399',
          backgroundColor: 'rgba(52, 211, 153, 0.08)',
          fill: true,
          tension: 0.4,
          borderWidth: 1.5,
          pointRadius: 2,
          pointHoverRadius: 4,
        }]
      };
    }

    return {
      labels: rtData.data.chartData.labels,
      datasets: [{
        label: hasEnhancedData ? 'Avg Response Time (ART)' : 'First Response Time',
        data: rtData.data.chartData.data.map(val => Math.round(val * 100) / 100),
        borderColor: '#34d399',
        backgroundColor: 'rgba(52, 211, 153, 0.08)',
        fill: true,
        tension: 0.4,
        borderWidth: 1.5,
        pointRadius: 2,
        pointHoverRadius: 4,
      }]
    };
  }, [getResponseTimeData, hasEnhancedData, period]);

  const satisfactionData = useMemo(() => {
    if (!customerSatisfaction?.values) {
      // Default data based on period
      const getDefaultLabels = () => {
        switch (period) {
          case 'daily':
            return Array.from({length: 24}, (_, i) => `${i.toString().padStart(2, '0')}:00`);
          case 'weekly':
            return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          case 'monthly':
            // Get the actual number of days in the selected month
            const [year, month] = selectedMonth.split('-').map(Number);
            const daysInMonth = new Date(year, month, 0).getDate();
            return Array.from({length: daysInMonth}, (_, i) => (i + 1).toString().padStart(2, '0'));
          case 'yearly':
            return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          default:
            return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        }
      };
      
      const labels = getDefaultLabels();
      return {
        labels,
        datasets: [{
          label: 'Satisfaction Score',
          data: labels.map(() => 4.2), // Default satisfaction score
          borderColor: '#fbbf24',
          backgroundColor: 'rgba(251, 191, 36, 0.08)',
          fill: true,
          tension: 0.4,
          borderWidth: 1.5,
          pointRadius: 2,
          pointHoverRadius: 4,
        }]
      };
    }

    return {
      labels: customerSatisfaction.labels,
      datasets: [{
        label: 'Satisfaction Score',
        data: customerSatisfaction.values.map(val => Math.round(val * 10) / 10),
        borderColor: '#fbbf24',
        backgroundColor: 'rgba(251, 191, 36, 0.08)',
        fill: true,
        tension: 0.4,
        borderWidth: 1.5,
        pointRadius: 2,
        pointHoverRadius: 4,
      }]
    };
  }, [customerSatisfaction, period]);

  // Get top performing agents or top conversations based on data availability
  const topAgents = useMemo(() => {
    // If we have top conversations data (agent view), use that
    if (topConversations?.topClients) {
      return topConversations.topClients.map((client, idx) => ({
        name: client.clientName,
        messages: client.totalMessages,
        responseTime: `${client.chatGroups} chats`,
        color: ['bg-yellow-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'][idx] || 'bg-gray-400'
      }));
    }
    
    // Otherwise use agent performance data (admin view)
    const agents = getTopPerformingAgents(4);
    return agents.map((agent, idx) => ({
      name: `${agent.agent_firstname} ${agent.agent_lastname}`,
      messages: agent.total_chats || 0,
      responseTime: formatTime(agent.avg_response_time_seconds),
      color: ['bg-yellow-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'][idx] || 'bg-gray-400'
    }));
  }, [topConversations, getTopPerformingAgents, formatTime]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: isDark ? '#d1d5db' : '#6b7280', // Theme-aware legend text
          font: { size: 10 },
          padding: 8,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: isDark ? '#374151' : '#ffffff', // Theme-aware tooltip background
        titleColor: isDark ? '#f9fafb' : '#111827', // Theme-aware tooltip title
        bodyColor: isDark ? '#d1d5db' : '#6b7280', // Theme-aware tooltip body
        borderColor: isDark ? '#4b5563' : '#e5e7eb', // Theme-aware tooltip border
        borderWidth: 1,
        padding: 8,
        bodyFont: { size: 11 },
        titleFont: { size: 11, weight: 'bold' }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)', // Match Dashboard grid opacity
          drawBorder: false,
        },
        ticks: {
          color: isDark ? '#d1d5db' : '#6b7280', // Theme-aware y-axis labels
          font: { size: 10 }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? '#d1d5db' : '#6b7280', // Theme-aware x-axis labels
          font: { size: 10 }
        }
      }
    }
  }), [isDark]);

  // Show loading state
  if (loading) {
    return (
      <Layout>
        <ScreenContainer>
          <div className="flex items-center justify-center h-full">
            <LoadingState message="Loading analytics..." />
          </div>
        </ScreenContainer>
      </Layout>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout>
        <ScreenContainer>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-500 mb-4">Error loading analytics: {error}</p>
              <button 
                onClick={refetch}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
              >
                Retry
              </button>
            </div>
          </div>
        </ScreenContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <ScreenContainer>
        <div className="p-3 sm:p-4 flex flex-col h-full overflow-hidden">
          {/* Header with Period Selector */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Analytics</h1>
            
            {/* Period Selector */}
            <PeriodSelector
              period={period}
              onPeriodChange={handlePeriodChange}
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              selectedWeek={selectedWeek}
              onWeekChange={handleWeekChange}
              selectedMonth={selectedMonth}
              onMonthChange={handleMonthChange}
              selectedYear={selectedYear}
              onYearChange={handleYearChange}
              showLabels={false}
              size="small"
            />
          </div>

          {/* Content Container */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Total Overview Card */}
            <div 
              className="rounded-lg shadow-sm p-4"
              style={{ 
                backgroundColor: 'var(--card-bg)',
                border: `1px solid var(--border-color)`
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Total overview</h2>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Your average daily activity over the last 7 days are <span className="font-semibold">{dashboardStats?.overview?.activityPercentage || 0}%</span>
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-violet-500 rounded"></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Messages</span>
                  <span className="ml-auto font-semibold" style={{ color: 'var(--text-primary)' }}>65%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded"></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Top conversations</span>
                  <span className="ml-auto font-semibold" style={{ color: 'var(--text-primary)' }}>35%</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Messages Card */}
              <div 
                className="rounded-lg shadow-sm p-4"
                style={{ 
                  backgroundColor: 'var(--card-bg)',
                  border: `1px solid var(--border-color)`
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Messages</p>
                    <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {messageAnalytics?.totalMessages?.toLocaleString() || '0'}
                    </h3>
                  </div>
                </div>
                <div className="h-32">
                  <Line data={messagesData} options={chartOptions} />
                </div>
              </div>

              {/* Top Conversations Card */}
              <div 
                className="rounded-lg shadow-sm p-4"
                style={{ 
                  backgroundColor: 'var(--card-bg)',
                  border: `1px solid var(--border-color)`
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                      {topConversations ? 'Top conversations' : 'Top conversations'}
                    </p>
                    <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {topConversations ? topConversations.totalUniqueClients : (agentPerformance?.length || 0)}
                    </h3>
                  </div>
                </div>
                <div className="space-y-2">
                  {topAgents.length > 0 ? topAgents.map((agent, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${agent.color} rounded-full flex items-center justify-center text-white font-semibold text-xs`}>
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{agent.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {topConversations ? `Messages: ${agent.messages} | ${agent.responseTime}` : `Chats: ${agent.messages} | RT: ${agent.responseTime}`}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {topConversations ? 'No client conversations available' : 'No agent data available'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            {/* Response Time */}
            <div 
              className="rounded-lg shadow-sm p-2.5"
              style={{ 
                backgroundColor: 'var(--card-bg)',
                border: `1px solid var(--border-color)`
              }}
            >
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {hasEnhancedData ? 'Average Response Time (ART)' : 'First Response Time'}
                  </p>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    {(() => {
                      const rtData = getResponseTimeData();
                      if (rtData?.insights?.formatted) {
                        return rtData.insights.formatted;
                      } else if (rtData?.data?.averageResponseTime) {
                        return formatTime(rtData.data.averageResponseTime);
                      }
                      return '0s';
                    })()}
                  </h3>
                </div>
              </div>
              <div className="h-32">
                <Line data={responseTimeData} options={chartOptions} />
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div 
              className="rounded-lg shadow-sm p-2.5"
              style={{ 
                backgroundColor: 'var(--card-bg)',
                border: `1px solid var(--border-color)`
              }}
            >
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-secondary)' }}>Customer Satisfaction</p>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    {customerSatisfaction?.formatted?.averageRating || '5.0/5.0'}
                  </h3>
                </div>
              </div>
              <div className="h-32">
                <Line data={satisfactionData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div 
            className="rounded-lg shadow-sm p-2.5"
            style={{ 
              backgroundColor: 'var(--card-bg)',
              border: `1px solid var(--border-color)`
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Engagement metrics</h2>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <div className="text-xl font-bold text-violet-600 mb-0.5">
                  {dashboardStats?.engagement?.activeUsers || 0}%
                </div>
                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Active Users</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600 mb-0.5">
                  {dashboardStats?.engagement?.avgSessionTime || '0h'}
                </div>
                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Avg Session Time</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600 mb-0.5">
                  {dashboardStats?.engagement?.resolutionRate || 0}%
                </div>
                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Resolution Rate</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-600 mb-0.5">
                  {dashboardStats?.engagement?.totalTickets?.toLocaleString() || '0'}
                </div>
                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Total Chats</p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </ScreenContainer>
    </Layout>
  );
};

export default AnalyticsScreen;
