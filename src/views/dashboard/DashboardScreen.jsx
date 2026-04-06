import Layout from "../../components/Layout";
import { AnimatedBackground } from "../../components/ui";
import { Users, CheckCircle, TrendingUp, Activity, Target } from "react-feather";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useQueues } from "../../hooks/useQueues";
import socket, { registerChatEvents } from "../../socket";

// Import components
import DashboardHeader from "./components/DashboardHeader";
import QueuesList from "./components/QueuesList";
import ChartCard from "./components/ChartCard";
import StatCard from "./components/StatCard";
import Calendar from "./components/Calendar";
import PeriodSelector from "../../components/shared/PeriodSelector";

export default function DashboardScreen() {
    const { userData, getRoleName } = useUser();
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const { queues, loading: queuesLoading, error: queuesError, refreshQueues } = useQueues();
    
    // Analytics period state
    const [period, setPeriod] = useState('weekly');
    const [selectedDate, setSelectedDate] = useState(() => {
        // Default to today's date
        return new Date().toISOString().split('T')[0];
    });
    const [selectedWeek, setSelectedWeek] = useState(() => {
        // Default to current week start (Monday)
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        const weekStart = new Date(today.setDate(diff));
        return weekStart.toISOString().split('T')[0];
    });
    const [selectedMonth, setSelectedMonth] = useState(() => {
        // Default to current month (YYYY-MM format)
        const today = new Date();
        return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    });
    const [selectedYear, setSelectedYear] = useState(() => {
        // Default to current year
        return new Date().getFullYear().toString();
    });
    
    // Pass appropriate date/week/month/year parameters based on period
    // const { messageAnalytics, responseTimeAnalytics, dashboardStats, enhancedResponseTime, loading: analyticsLoading, refreshAnalytics } = useAnalytics(period);
    
    // Static data for testing
    const analyticsLoading = false;
    const refreshAnalytics = () => console.log('Analytics refresh disabled - using static data');
    
    const messageAnalytics = {
        total: 1247,
        trend: '+12%',
        values: period === 'daily' ? [45, 52, 38, 61, 55, 48, 70, 65, 58, 72, 68, 75, 82, 78, 85, 90, 88, 95, 92, 88, 75, 65, 55, 48] :
                period === 'weekly' ? [156, 189, 234, 198, 212, 187, 271] :
                period === 'monthly' ? Array.from({length: 30}, (_, i) => Math.floor(Math.random() * 50) + 40) :
                [890, 920, 1050, 1100, 1180, 1150, 1200, 1247, 1300, 1280, 1320, 1350],
        labels: period === 'daily' ? Array.from({length: 24}, (_, i) => `${i.toString().padStart(2, '0')}:00`) :
                period === 'weekly' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
                period === 'monthly' ? Array.from({length: 30}, (_, i) => (i + 1).toString().padStart(2, '0')) :
                ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    };
    
    const responseTimeAnalytics = {
        average: 3.5,
        trend: '-8%',
        values: period === 'daily' ? [4.2, 3.8, 4.5, 3.2, 3.9, 4.1, 3.5, 3.7, 3.3, 3.8, 3.6, 3.4, 3.2, 3.5, 3.3, 3.1, 3.4, 3.2, 3.6, 3.8, 4.0, 4.2, 4.5, 4.3] :
                period === 'weekly' ? [4.2, 3.8, 3.5, 3.2, 3.6, 3.9, 3.7] :
                period === 'monthly' ? Array.from({length: 30}, (_, i) => Math.random() * 2 + 3) :
                [4.5, 4.3, 4.0, 3.8, 3.7, 3.6, 3.5, 3.5, 3.4, 3.3, 3.4, 3.5],
        labels: period === 'daily' ? Array.from({length: 24}, (_, i) => `${i.toString().padStart(2, '0')}:00`) :
                period === 'weekly' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
                period === 'monthly' ? Array.from({length: 30}, (_, i) => (i + 1).toString().padStart(2, '0')) :
                ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        formatted: {
            averageResponseTime: '3.5 min'
        }
    };
    
    const dashboardStats = {
        engagement: {
            totalTickets: 156,
            resolutionRate: 78,
            activeUsers: 12,
            totalTicketsGrowth: 8,
            resolutionRateGrowth: 5
        }
    };
    
    const enhancedResponseTime = {
        formatted: {
            overallART: '3.5 min'
        },
        trend: -8,
        chartData: {
            data: responseTimeAnalytics.values.map(v => v * 60),
            labels: responseTimeAnalytics.labels
        }
    };

    // Memoize period change callback to prevent PeriodSelector re-renders
    const handlePeriodChange = useCallback((newPeriod) => {
        setPeriod(newPeriod);
        // Reset to today when switching to daily
        if (newPeriod === 'daily') {
            setSelectedDate(new Date().toISOString().split('T')[0]);
        }
        // Reset to current week when switching to weekly
        if (newPeriod === 'weekly') {
            const today = new Date();
            const day = today.getDay();
            const diff = today.getDate() - day + (day === 0 ? -6 : 1);
            const weekStart = new Date(today.setDate(diff));
            setSelectedWeek(weekStart.toISOString().split('T')[0]);
        }
        // Reset to current month when switching to monthly
        if (newPeriod === 'monthly') {
            const today = new Date();
            setSelectedMonth(`${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`);
        }
        // Reset to current year when switching to yearly
        if (newPeriod === 'yearly') {
            setSelectedYear(new Date().getFullYear().toString());
        }
    }, []);

    // Handle date change for daily analytics
    const handleDateChange = useCallback((newDate) => {
        setSelectedDate(newDate);
    }, []);

    // Handle week change for weekly analytics
    const handleWeekChange = useCallback((newWeek) => {
        setSelectedWeek(newWeek);
    }, []);

    // Handle month change for monthly analytics
    const handleMonthChange = useCallback((newMonth) => {
        setSelectedMonth(newMonth);
    }, []);

    // Handle year change for yearly analytics
    const handleYearChange = useCallback((newYear) => {
        setSelectedYear(newYear);
    }, []);

    // Memoize chart data to prevent unnecessary re-renders
    const messagesChartData = useMemo(() => {
        // For daily view, show hourly data (24 hours)
        if (period === 'daily') {
            return {
                series: [{
                    name: 'Messages',
                    data: messageAnalytics?.values?.length > 0 ? 
                          messageAnalytics.values.map(val => Math.round(val)) : 
                          Array(24).fill(0) // 24 hours of data
                }],
                categories: messageAnalytics?.labels?.length > 0 ? 
                           messageAnalytics.labels : 
                           Array.from({length: 24}, (_, i) => `${i.toString().padStart(2, '0')}:00`)
            };
        }
        
        // For weekly view, show individual days (7 days)
        if (period === 'weekly') {
            return {
                series: [{
                    name: 'Messages',
                    data: messageAnalytics?.values?.length > 0 ? 
                          messageAnalytics.values.map(val => Math.round(val)) : 
                          [0, 0, 0, 0, 0, 0, 0] // 7 days of data
                }],
                categories: messageAnalytics?.labels?.length > 0 ? 
                           messageAnalytics.labels : 
                           ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            };
        }
        
        // For monthly view, show individual days (30/31 days)
        if (period === 'monthly') {
            return {
                series: [{
                    name: 'Messages',
                    data: messageAnalytics?.values?.length > 0 ? 
                          messageAnalytics.values.map(val => Math.round(val)) : 
                          Array(30).fill(0) // 30 days of data
                }],
                categories: messageAnalytics?.labels?.length > 0 ? 
                           messageAnalytics.labels : 
                           Array.from({length: 30}, (_, i) => (i + 1).toString().padStart(2, '0'))
            };
        }
        
        // For yearly view, show individual months (12 months)
        if (period === 'yearly') {
            return {
                series: [{
                    name: 'Messages',
                    data: messageAnalytics?.values?.length > 0 ? 
                          messageAnalytics.values.map(val => Math.round(val)) : 
                          Array(12).fill(0) // 12 months of data
                }],
                categories: messageAnalytics?.labels?.length > 0 ? 
                           messageAnalytics.labels : 
                           ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            };
        }
        
        // Default fallback
        return {
            series: [{
                name: 'Messages',
                data: messageAnalytics?.values?.length > 0 ? 
                      messageAnalytics.values.map(val => Math.round(val)) : 
                      [0, 0, 0, 0, 0, 0, 0]
            }],
            categories: messageAnalytics?.labels?.length > 0 ? 
                       messageAnalytics.labels : 
                       ['Week 1', 'Week 2', 'Week 3', 'Week 4']
        };
    }, [messageAnalytics?.values, messageAnalytics?.labels, period]);

    const responseTimeChartData = useMemo(() => {
        // For daily view, show hourly data (24 hours)
        if (period === 'daily') {
            return {
                series: [{
                    name: 'Avg Response (min)',
                    data: enhancedResponseTime?.chartData?.data?.length > 0 ? 
                          enhancedResponseTime.chartData.data.map(val => Math.round((val / 60) * 100) / 100) : 
                          responseTimeAnalytics?.values?.length > 0 ? 
                          responseTimeAnalytics.values.map(val => Math.round(val * 100) / 100) : 
                          Array(24).fill(0) // 24 hours of data
                }],
                categories: enhancedResponseTime?.chartData?.labels?.length > 0 ? 
                           enhancedResponseTime.chartData.labels :
                           responseTimeAnalytics?.labels?.length > 0 ? 
                           responseTimeAnalytics.labels : 
                           Array.from({length: 24}, (_, i) => `${i.toString().padStart(2, '0')}:00`)
            };
        }
        
        // For weekly view, show individual days (7 days)
        if (period === 'weekly') {
            return {
                series: [{
                    name: 'Avg Response (min)',
                    data: enhancedResponseTime?.chartData?.data?.length > 0 ? 
                          enhancedResponseTime.chartData.data.map(val => Math.round((val / 60) * 100) / 100) : 
                          responseTimeAnalytics?.values?.length > 0 ? 
                          responseTimeAnalytics.values.map(val => Math.round(val * 100) / 100) : 
                          [0, 0, 0, 0, 0, 0, 0] // 7 days of data
                }],
                categories: enhancedResponseTime?.chartData?.labels?.length > 0 ? 
                           enhancedResponseTime.chartData.labels :
                           responseTimeAnalytics?.labels?.length > 0 ? 
                           responseTimeAnalytics.labels : 
                           ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            };
        }
        
        // For monthly view, show individual days (30/31 days)
        if (period === 'monthly') {
            return {
                series: [{
                    name: 'Avg Response (min)',
                    data: enhancedResponseTime?.chartData?.data?.length > 0 ? 
                          enhancedResponseTime.chartData.data.map(val => Math.round((val / 60) * 100) / 100) : 
                          responseTimeAnalytics?.values?.length > 0 ? 
                          responseTimeAnalytics.values.map(val => Math.round(val * 100) / 100) : 
                          Array(30).fill(0) // 30 days of data
                }],
                categories: enhancedResponseTime?.chartData?.labels?.length > 0 ? 
                           enhancedResponseTime.chartData.labels :
                           responseTimeAnalytics?.labels?.length > 0 ? 
                           responseTimeAnalytics.labels : 
                           Array.from({length: 30}, (_, i) => (i + 1).toString().padStart(2, '0'))
            };
        }
        
        // For yearly view, show individual months (12 months)
        if (period === 'yearly') {
            return {
                series: [{
                    name: 'Avg Response (min)',
                    data: enhancedResponseTime?.chartData?.data?.length > 0 ? 
                          enhancedResponseTime.chartData.data.map(val => Math.round((val / 60) * 100) / 100) : 
                          responseTimeAnalytics?.values?.length > 0 ? 
                          responseTimeAnalytics.values.map(val => Math.round(val * 100) / 100) : 
                          Array(12).fill(0) // 12 months of data
                }],
                categories: enhancedResponseTime?.chartData?.labels?.length > 0 ? 
                           enhancedResponseTime.chartData.labels :
                           responseTimeAnalytics?.labels?.length > 0 ? 
                           responseTimeAnalytics.labels : 
                           ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            };
        }
        
        // Default fallback
        return {
            series: [{
                name: 'Avg Response (min)',
                data: enhancedResponseTime?.chartData?.data?.length > 0 ? 
                      enhancedResponseTime.chartData.data.map(val => Math.round((val / 60) * 100) / 100) : 
                      responseTimeAnalytics?.values?.length > 0 ? 
                      responseTimeAnalytics.values.map(val => Math.round(val * 100) / 100) : 
                      [0, 0, 0, 0, 0, 0, 0]
            }],
            categories: enhancedResponseTime?.chartData?.labels?.length > 0 ? 
                       enhancedResponseTime.chartData.labels :
                       responseTimeAnalytics?.labels?.length > 0 ? 
                       responseTimeAnalytics.labels : 
                       ['Week 1', 'Week 2', 'Week 3', 'Week 4']
        };
    }, [enhancedResponseTime?.chartData, responseTimeAnalytics?.values, responseTimeAnalytics?.labels, period]);

    // Memoize display stats to prevent recalculation
    const displayStats = useMemo(() => {
        if (dashboardStats) {
            // Use real dashboard stats from API
            const totalTickets = dashboardStats.engagement?.totalTickets || 0;
            const resolutionRate = dashboardStats.engagement?.resolutionRate || 0;
            const resolvedCount = Math.round((resolutionRate * totalTickets) / 100);
            const pendingCount = Math.max(0, totalTickets - resolvedCount);
            
            return {
                activeChats: totalTickets,
                pendingChats: pendingCount,
                resolvedToday: resolvedCount,
                activeAgents: dashboardStats.engagement?.activeUsers || 0,
                avgResponseTime: responseTimeAnalytics?.formatted?.averageResponseTime || enhancedResponseTime?.formatted?.overallART || '0 min'
            };
        } else {
            // Default fallback values - use real zeros instead of fake data
            return {
                activeChats: 0,
                pendingChats: 0,
                resolvedToday: 0,
                activeAgents: 0,
                avgResponseTime: '0 min'
            };
        }
    }, [dashboardStats, responseTimeAnalytics, enhancedResponseTime]);

    // Memoize calculated values to prevent re-renders
    const activeSessions = useMemo(() => 
        (displayStats?.activeChats || 0) + (queues?.length || 0), 
        [displayStats?.activeChats, queues?.length]
    );

    const performancePercentage = useMemo(() => {
        const resolved = displayStats?.resolvedToday || 0;
        const pending = displayStats?.pendingChats || 0;
        const total = resolved + pending;
        if (total === 0) return 0;
        
        // Use Math.round to avoid floating-point precision issues
        return Math.round((resolved / total) * 100);
    }, [displayStats?.resolvedToday, displayStats?.pendingChats]);

    // Calculate real trend values
    const activeTrend = useMemo(() => {
        const growth = dashboardStats?.engagement?.totalTicketsGrowth || 0;
        return growth > 0 ? `+${growth}%` : `${growth}%`;
    }, [dashboardStats?.engagement?.totalTicketsGrowth]);

    const performanceTrend = useMemo(() => {
        const growth = dashboardStats?.engagement?.resolutionRateGrowth || 0;
        return growth > 0 ? `+${growth}%` : `${growth}%`;
    }, [dashboardStats?.engagement?.resolutionRateGrowth]);

    // Memoize navigation callbacks
    const navigateToChats = useCallback(() => navigate('/Chats'), [navigate]);
    const navigateToAnalytics = useCallback(() => navigate('/analytics'), [navigate]);
    const navigateToManageAgents = useCallback(() => navigate('/manage-agents'), [navigate]);

    // Memoize period selector to prevent re-renders
    const periodSelector = useMemo(() => 
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
        />, 
        [period, handlePeriodChange, selectedDate, handleDateChange, selectedWeek, handleWeekChange, selectedMonth, handleMonthChange, selectedYear, handleYearChange]
    );

    // Debug logging for queues
    if (queuesError) {
        console.error('Queue loading error:', queuesError);
    }

    // Don't show loading screen for period changes, only for initial load
    const isInitialLoad = !messageAnalytics && !responseTimeAnalytics && !dashboardStats;
    
    if ((queuesLoading || (analyticsLoading && isInitialLoad)) && isInitialLoad) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6237A0] mx-auto mb-4"></div>
                        <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="h-full overflow-hidden relative">
                {/* Animated Background */}
                <AnimatedBackground isDark={isDark}/>
                
                {/* Dashboard Grid Layout */}
                <div className="dashboard-grid h-full p-4 relative z-10">
                    {/* Header */}
                    <div className="dashboard-header">
                        <DashboardHeader userData={userData} getRoleName={getRoleName} />
                    </div>

                    {/* Split Activity Area: Pending Queues + Department Rankings */}
                    <div className="dashboard-activity">
                        <div className="grid grid-cols-2 gap-4 h-full">
                            {/* Left Half: Pending Queues */}
                            <QueuesList queues={queues} />
                        </div>
                    </div>

                    {/* Right Side Panel: Calendar + Quick Actions */}
                    <div className="dashboard-right-panel">
                        <div className="space-y-4 h-full">
                            {/* Calendar Component */}
                            <Calendar className="flex-1" />
                        </div>
                    </div>

                    {/* Messages Chart with Period Selector */}
                    <ChartCard
                        className="dashboard-chart1"
                        value={messageAnalytics?.total?.toLocaleString() || '0'}
                        trend={messageAnalytics?.trend || '0%'}
                        chartData={messagesChartData}
                        chartColor="#a78bfa"
                        isDark={isDark}
                        loading={analyticsLoading}
                        headerAction={periodSelector}
                    />

                    {/* Response Time Chart */}
                    <ChartCard
                        className="dashboard-chart2"
                        title="Avg Response Time"
                        value={
                            enhancedResponseTime?.formatted?.overallART || 
                            responseTimeAnalytics?.formatted?.averageResponseTime || 
                            (responseTimeAnalytics?.average ? `${responseTimeAnalytics.average} min` : '0 min')
                        }
                        trend={
                            enhancedResponseTime?.trend ? `${enhancedResponseTime.trend > 0 ? '+' : ''}${enhancedResponseTime.trend}%` :
                            responseTimeAnalytics?.trend || '0%'
                        }
                        chartData={responseTimeChartData}
                        chartColor="#34d399"
                        isDark={isDark}
                        loading={analyticsLoading}
                    />

                    {/* Stat Card 1: Active Sessions */}
                    <div className="dashboard-stat1">
                        <StatCard
                            icon={Activity}
                            label="Active Sessions"
                            value={activeSessions.toString()}
                            subLabel={`${Math.round(displayStats?.activeChats || 0)} Active • ${Math.round(queues?.length || 0)} Queued`}
                            trend={activeTrend}
                            color="bg-gradient-to-br from-[#6237A0] to-[#7A4ED9]"
                            onClick={navigateToChats}
                        />
                    </div>

                    {/* Stat Card 2: Performance Today */}
                    <div className="dashboard-stat2">
                        <StatCard
                            icon={Target}
                            label="Performance Today"
                            value={`${performancePercentage}%`}
                            subLabel={`${Math.round(displayStats?.resolvedToday || 0)} Resolved • ${Math.round(displayStats?.pendingChats || 0)} Pending`}
                            trend={performanceTrend}
                            color="bg-gradient-to-br from-green-500 to-green-600"
                            onClick={navigateToAnalytics}
                        />
                    </div>

                    {/* Stat Cards 3-5 */}
                    <div className="dashboard-stats-group space-y-4">
                        <StatCard
                            icon={CheckCircle}
                            label="Resolved Today"
                            value={displayStats?.resolvedToday}
                            trend="+8%"
                            color="bg-gradient-to-br from-green-500 to-green-600"
                        />
                        <StatCard
                            icon={Users}
                            label="Active Agents"
                            value={displayStats?.activeAgents}
                            color="bg-gradient-to-br from-blue-500 to-blue-600"
                            onClick={navigateToManageAgents}
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Avg Response"
                            value={displayStats?.avgResponseTime}
                            trend="-15%"
                            color="bg-gradient-to-br from-teal-500 to-teal-600"
                        />
                    </div>
                </div>
            </div>

            <style>{`
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    grid-template-rows: auto 1fr 1fr 1fr;
                    gap: 16px;
                    height: calc(100vh - 80px);
                }
                
                .dashboard-header { 
                    grid-area: 1 / 1 / 2 / 6;
                    min-height: 80px;
                }
                .dashboard-activity { 
                    grid-area: 2 / 1 / 5 / 3;
                    overflow: hidden;
                }
                .dashboard-chart1 { 
                    grid-area: 2 / 3 / 4 / 6;
                    min-height: 200px;
                }
                .dashboard-chart2 { 
                    grid-area: 4 / 3 / 5 / 6;
                    min-height: 150px;
                }
                .dashboard-right-panel { 
                    grid-area: 2 / 6 / 5 / 8;
                    overflow: hidden;
                }
                .dashboard-stat1 { 
                    grid-area: 1 / 6 / 2 / 7;
                    min-height: 80px;
                }
                .dashboard-stat2 { 
                    grid-area: 1 / 7 / 2 / 8;
                    min-height: 80px;
                }
                .dashboard-stats-group { 
                    display: none;
                }
            `}</style>
        </Layout>
    );
}
