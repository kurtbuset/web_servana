import Layout from "../../components/Layout";
import { AnimatedBackground } from "../../components/ui";
import { MessageSquare, Users, Clock, CheckCircle, TrendingUp } from "react-feather";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDashboard } from "../../hooks/useDashboard";
import { useQueues } from "../../hooks/useQueues";
import { useAnalytics } from "../../hooks/useAnalytics";

// Import components
import DashboardHeader from "./components/DashboardHeader";
import QueuesList from "./components/QueuesList";
import ChartCard from "./components/ChartCard";
import QuickActions from "./components/QuickActions";
import StatCard from "./components/StatCard";
import PeriodSelector from "./components/PeriodSelector";

export default function DashboardScreen() {
    const { userData, hasPermission, getRoleName } = useUser();
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const { stats, loading: dashboardLoading } = useDashboard();
    const { allCustomers, loading: queuesLoading } = useQueues();
    
    // Analytics period state
    const [period, setPeriod] = useState('weekly');
    const { messageAnalytics, responseTimeAnalytics, dashboardStats, loading: analyticsLoading } = useAnalytics(period);

    // Transform queue data for display
    const queues = allCustomers.map(customer => ({
        client: customer.client_name || 'Unknown Client',
        message: customer.last_message || 'No message',
        department: customer.department || 'General',
        waitTime: customer.wait_time || 'Just now',
        timestamp: customer.created_at ? new Date(customer.created_at).toLocaleString() : 'Unknown',
        chat_group_id: customer.chat_group_id
    }));

    // Prepare chart data for ApexCharts
    const messagesChartData = {
        series: [{
            name: 'Messages',
            data: messageAnalytics?.values || [850, 920, 1258, 1100, 980, 750, 680]
        }],
        categories: messageAnalytics?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    };

    const responseTimeChartData = {
        series: [{
            name: 'Avg Response (min)',
            data: responseTimeAnalytics?.values || [3.5, 2.8, 3.2, 2.5, 3.0, 4.2, 3.8]
        }],
        categories: responseTimeAnalytics?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    };

    // Use real dashboard stats or fallback to useDashboard hook
    const displayStats = dashboardStats || stats;

    if (dashboardLoading || queuesLoading || analyticsLoading) {
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

                    {/* Pending Queues List */}
                    <QueuesList queues={queues} />

                    {/* Messages Chart with Period Selector */}
                    <ChartCard
                        key={`messages-${period}`}
                        className="dashboard-chart1"
                        title={`Messages This ${period === 'daily' ? 'Day' : period === 'weekly' ? 'Week' : period === 'monthly' ? 'Month' : 'Year'}`}
                        value={messageAnalytics?.total?.toLocaleString() || '6,538'}
                        trend={messageAnalytics?.trend || '↑ 12%'}
                        chartData={messagesChartData}
                        chartColor="#a78bfa"
                        isDark={isDark}
                        headerAction={<PeriodSelector period={period} onChange={setPeriod} />}
                    />

                    {/* Response Time Chart */}
                    <ChartCard
                        key={`response-${period}`}
                        className="dashboard-chart2"
                        title="Avg Response Time"
                        value={responseTimeAnalytics?.average ? `${responseTimeAnalytics.average} min` : '3.2 min'}
                        trend={responseTimeAnalytics?.trend || '↓ 15%'}
                        chartData={responseTimeChartData}
                        chartColor="#34d399"
                        isDark={isDark}
                    />

                    {/* Quick Actions */}
                    <QuickActions navigate={navigate} hasPermission={hasPermission} />

                    {/* Stat Card 1 */}
                    <div className="dashboard-stat1">
                        <StatCard
                            icon={MessageSquare}
                            label="Active Chats"
                            value={displayStats.activeChats}
                            trend="+12%"
                            color="bg-gradient-to-br from-[#6237A0] to-[#7A4ED9]"
                            onClick={() => navigate('/Chats')}
                        />
                    </div>

                    {/* Stat Card 2 */}
                    <div className="dashboard-stat2">
                        <StatCard
                            icon={Clock}
                            label="Pending"
                            value={displayStats.pendingChats}
                            color="bg-gradient-to-br from-orange-500 to-orange-600"
                            onClick={() => navigate('/queues')}
                        />
                    </div>

                    {/* Stat Cards 3-5 */}
                    <div className="dashboard-stats-group space-y-4">
                        <StatCard
                            icon={CheckCircle}
                            label="Resolved Today"
                            value={displayStats.resolvedToday}
                            trend="+8%"
                            color="bg-gradient-to-br from-green-500 to-green-600"
                        />
                        <StatCard
                            icon={Users}
                            label="Active Agents"
                            value={displayStats.activeAgents}
                            color="bg-gradient-to-br from-blue-500 to-blue-600"
                            onClick={() => navigate('/manage-agents')}
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Avg Response"
                            value={displayStats.avgResponseTime}
                            trend="-15%"
                            color="bg-gradient-to-br from-teal-500 to-teal-600"
                        />
                    </div>
                </div>
            </div>

            <style>{`
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    grid-template-rows: auto 1fr 1fr 1fr 1fr;
                    gap: 16px;
                    height: calc(100vh - 80px);
                }
                
                .dashboard-header { 
                    grid-area: 1 / 1 / 2 / 5;
                    min-height: 80px;
                }
                .dashboard-activity { 
                    grid-area: 2 / 1 / 6 / 3;
                    overflow: hidden;
                }
                .dashboard-chart1 { 
                    grid-area: 2 / 3 / 4 / 5;
                    min-height: 200px;
                }
                .dashboard-chart2 { 
                    grid-area: 4 / 3 / 5 / 5;
                    min-height: 150px;
                }
                .dashboard-actions { 
                    grid-area: 5 / 3 / 6 / 5;
                    min-height: 150px;
                }
                .dashboard-stat1 { 
                    grid-area: 1 / 5 / 2 / 6;
                    min-height: 80px;
                }
                .dashboard-stat2 { 
                    grid-area: 2 / 5 / 3 / 6;
                    min-height: 120px;
                }
                .dashboard-stats-group { 
                    grid-area: 3 / 5 / 6 / 6;
                    overflow-y: auto;
                }
            `}</style>
        </Layout>
    );
}
