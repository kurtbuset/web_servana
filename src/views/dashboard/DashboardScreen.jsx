import { useState } from "react";
import Layout from "../../components/Layout";
import { MessageSquare, Users, Clock, CheckCircle, TrendingUp, Activity, UserCheck } from "react-feather";
import { useUser } from "../../../src/context/UserContext";
import { useTheme } from "../../../src/context/ThemeContext";
import { PERMISSIONS } from "../../constants/permissions";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../../hooks/useDashboard";
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

/**
 * DashboardScreen - Refactored dashboard view
 * 
 * Uses the new useDashboard hook for business logic while maintaining
 * the exact same UI/UX as the original Dashboard screen.
 * 
 * Features:
 * - Permission-based statistics display and actions
 * - Real-time activity feed
 * - Quick action buttons
 * - Responsive design with mobile sidebar
 * - Enhanced visual design with gradients and animations
 */
export default function DashboardScreen() {
    const [openDropdown, setOpenDropdown] = useState(null);
    const { userData, hasPermission, getRoleName } = useUser();
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const { stats, activity, loading } = useDashboard();

    const toggleSidebar = () => {
        setMobileSidebarOpen((prev) => !prev);
    };

    const toggleDropdown = (name) => {
        setOpenDropdown((prev) => (prev === name ? null : name));
    };

    // Analytics data
    const messagesData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Messages',
            data: [850, 920, 1258, 1100, 980, 750, 680],
            borderColor: '#a78bfa',
            backgroundColor: 'rgba(167, 139, 250, 0.1)',
            fill: true,
            tension: 0.4,
        }]
    };

    const responseTimeData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Avg Response (min)',
            data: [3.5, 2.8, 3.2, 2.5, 3.0, 4.2, 3.8],
            borderColor: '#34d399',
            backgroundColor: 'rgba(52, 211, 153, 0.1)',
            fill: true,
            tension: 0.4,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: isDark ? '#3a3a3a' : '#ffffff',
                titleColor: isDark ? '#f5f5f5' : '#1a1a1a',
                bodyColor: isDark ? '#d1d1d1' : '#6b7280',
                borderColor: isDark ? '#4a4a4a' : '#e5e7eb',
                borderWidth: 1,
                padding: 6,
                bodyFont: { size: 10 },
                titleFont: { size: 10, weight: 'bold' }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
                ticks: { color: isDark ? '#d1d1d1' : '#6b7280', font: { size: 9 } }
            },
            x: {
                grid: { display: false },
                ticks: { color: isDark ? '#d1d1d1' : '#6b7280', font: { size: 9 } }
            }
        }
    };

    const StatCard = ({ icon: Icon, label, value, trend, color, onClick }) => (
        <div 
            className={`rounded-lg p-2.5 sm:p-3 shadow-sm border hover:shadow-lg transition-all duration-300 relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
            style={{ 
                backgroundColor: 'var(--card-bg)', 
                borderColor: 'var(--border-color)'
            }}
            onClick={onClick}
        >
            <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                    <p className="text-[10px] mb-0.5 font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                    <h3 className="text-lg sm:text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{value}</h3>
                    {trend && (
                        <div className="flex items-center gap-0.5 mt-1">
                            <TrendingUp size={10} className="text-green-500" />
                            <span className="text-[9px] text-green-500 font-medium">{trend}</span>
                        </div>
                    )}
                </div>
                <div className={`p-1.5 sm:p-2 rounded-lg ${color} shadow-lg`}>
                    <Icon size={14} strokeWidth={1.5} className="text-white sm:w-4 sm:h-4" />
                </div>
            </div>
        </div>
    );

    const RecentActivity = () => (
        <div className="rounded-xl p-4 sm:p-5 md:p-6 shadow-sm border hover:shadow-md transition-shadow" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between mb-4 sm:mb-5">
                <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Activity size={18} className="text-[#6237A0] sm:w-5 sm:h-5" />
                    Recent Activity
                </h2>
                <span className="text-xs hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>Live</span>
            </div>
            <div className="space-y-3 sm:space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                {activity.map((item, idx) => (
                    <div 
                        key={idx} 
                        className="flex items-start sm:items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b last:border-0 last:pb-0 -mx-2 px-2 rounded-lg transition-colors"
                        style={{ borderColor: 'var(--border-color)' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(245, 243, 255, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#6237A0] to-[#7A4ED9] flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0 shadow-md">
                            {item.agent.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-primary)' }}>
                                <span className="font-medium">{item.agent}</span> {item.action}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.time}</p>
                        </div>
                        <span className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                            item.status === 'resolved' ? 'bg-green-100 text-green-700' :
                            item.status === 'active' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                        }`}>
                            {item.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    const QuickActions = () => (
        <div className="rounded-xl p-4 sm:p-5 md:p-6 shadow-sm border hover:shadow-md transition-shadow" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <div className="w-1 h-5 bg-gradient-to-b from-[#6237A0] to-[#7A4ED9] rounded-full"></div>
                Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
                <button 
                    onClick={() => navigate('/Chats')}
                    className="flex items-center gap-3 p-3 sm:p-3.5 rounded-lg border-2 transition-all text-left group"
                    style={{ borderColor: 'var(--border-color)' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#6237A0';
                        e.currentTarget.style.background = isDark ? 'rgba(139, 92, 246, 0.1)' : 'linear-gradient(to right, rgba(245, 243, 255, 1), transparent)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-[#6237A0] transition-colors">
                        <MessageSquare size={18} className="text-[#6237A0] group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium group-hover:text-[#6237A0] transition-colors" style={{ color: 'var(--text-primary)' }}>View All Chats</span>
                </button>
                {hasPermission(PERMISSIONS.CREATE_ACCOUNT) && (
                    <button 
                        onClick={() => navigate('/manage-agents')}
                        className="flex items-center gap-3 p-3 sm:p-3.5 rounded-lg border-2 transition-all text-left group"
                        style={{ borderColor: 'var(--border-color)' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#6237A0';
                            e.currentTarget.style.background = isDark ? 'rgba(139, 92, 246, 0.1)' : 'linear-gradient(to right, rgba(245, 243, 255, 1), transparent)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-[#6237A0] transition-colors">
                            <Users size={18} className="text-[#6237A0] group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium group-hover:text-[#6237A0] transition-colors" style={{ color: 'var(--text-primary)' }}>Manage Agents</span>
                    </button>
                )}
                <button 
                    onClick={() => navigate('/queues')}
                    className="flex items-center gap-3 p-3 sm:p-3.5 rounded-lg border-2 transition-all text-left group"
                    style={{ borderColor: 'var(--border-color)' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#6237A0';
                        e.currentTarget.style.background = isDark ? 'rgba(139, 92, 246, 0.1)' : 'linear-gradient(to right, rgba(245, 243, 255, 1), transparent)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-[#6237A0] transition-colors">
                        <Clock size={18} className="text-[#6237A0] group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium group-hover:text-[#6237A0] transition-colors" style={{ color: 'var(--text-primary)' }}>View Queue</span>
                </button>
            </div>
        </div>
    );

    // Show different stats based on permissions
    const renderStats = () => {
        // If user has management permissions, show admin-level stats
        if (hasPermission(PERMISSIONS.MANAGE_ROLE) || hasPermission(PERMISSIONS.CREATE_ACCOUNT)) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                    <StatCard
                        icon={MessageSquare}
                        label="Active Chats"
                        value={stats.activeChats}
                        trend="+12% from yesterday"
                        color="bg-gradient-to-br from-[#6237A0] to-[#7A4ED9]"
                        onClick={() => navigate('/Chats')}
                    />
                    <StatCard
                        icon={Clock}
                        label="Pending Chats"
                        value={stats.pendingChats}
                        color="bg-gradient-to-br from-orange-500 to-orange-600"
                        onClick={() => navigate('/queues')}
                    />
                    <StatCard
                        icon={CheckCircle}
                        label="Resolved Today"
                        value={stats.resolvedToday}
                        trend="+8% from yesterday"
                        color="bg-gradient-to-br from-green-500 to-green-600"
                    />
                    <StatCard
                        icon={Users}
                        label="Active Agents"
                        value={stats.activeAgents}
                        color="bg-gradient-to-br from-blue-500 to-blue-600"
                        onClick={() => navigate('/manage-agents')}
                    />
                    <StatCard
                        icon={MessageSquare}
                        label="Total Chats"
                        value={stats.totalChats}
                        color="bg-gradient-to-br from-purple-500 to-purple-600"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Avg Response Time"
                        value={stats.avgResponseTime}
                        trend="-15% faster"
                        color="bg-gradient-to-br from-teal-500 to-teal-600"
                    />
                </div>
            );
        } else if (hasPermission(PERMISSIONS.VIEW_MESSAGE)) {
            // Agent-level stats for users with chat permissions
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                    <StatCard
                        icon={MessageSquare}
                        label="My Active Chats"
                        value={stats.myActiveChats}
                        color="bg-gradient-to-br from-[#6237A0] to-[#7A4ED9]"
                        onClick={() => navigate('/Chats')}
                    />
                    <StatCard
                        icon={CheckCircle}
                        label="Resolved Today"
                        value={stats.myResolvedToday}
                        trend="+3 from yesterday"
                        color="bg-gradient-to-br from-green-500 to-green-600"
                    />
                    <StatCard
                        icon={Clock}
                        label="Pending in Queue"
                        value={stats.pendingChats}
                        color="bg-gradient-to-br from-orange-500 to-orange-600"
                        onClick={() => navigate('/queues')}
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Avg Response Time"
                        value={stats.avgResponseTime}
                        color="bg-gradient-to-br from-teal-500 to-teal-600"
                    />
                </div>
            );
        }
        // Default minimal stats for users with no specific permissions
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <StatCard
                    icon={Activity}
                    label="Welcome"
                    value="Dashboard"
                    color="bg-gradient-to-br from-gray-500 to-gray-600"
                />
            </div>
        );
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-full" style={{ backgroundColor: 'var(--bg-secondary)' }}>
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
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: ${isDark ? '#2d2d2d' : '#f1f1f1'};
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #6237A0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #7A4ED9;
                }
            `}</style>
            <main className="flex-1 p-2 sm:p-3 overflow-y-auto h-full" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="max-w-7xl mx-auto space-y-2 sm:space-y-3">
                            {/* Header with enhanced design */}
                            <div className="mb-2 rounded-lg p-2.5 sm:p-3 border shadow-sm" style={{ backgroundColor: isDark ? 'rgba(45, 45, 45, 0.6)' : 'rgba(255, 255, 255, 0.6)', borderColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)' }}>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div>
                                        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#C4B5FD] bg-clip-text text-transparent mb-1">
                                            Dashboard
                                        </h1>
                                        <p className="text-xs sm:text-sm flex flex-wrap items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                                            Welcome back, <span className="font-semibold text-[#A78BFA]">{userData?.profile?.prof_firstname || 'User'}</span>! 
                                            <span className="px-2 py-0.5 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 rounded-full text-[10px] font-medium border border-purple-200">
                                                {getRoleName()}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Live</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid - Role-based */}
                            {renderStats()}

                            {/* Analytics Charts - Compact */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                                <div 
                                    className="rounded-lg shadow-sm p-2"
                                    style={{ 
                                        backgroundColor: 'var(--card-bg)',
                                        border: `1px solid var(--border-color)`
                                    }}
                                >
                                    <div className="flex justify-between items-center mb-1.5">
                                        <div>
                                            <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Messages This Week</p>
                                            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>6,538</h3>
                                        </div>
                                        <span className="text-green-600 text-[10px]">↑ 12%</span>
                                    </div>
                                    <div className="h-20">
                                        <Line data={messagesData} options={chartOptions} />
                                    </div>
                                </div>

                                <div 
                                    className="rounded-lg shadow-sm p-2"
                                    style={{ 
                                        backgroundColor: 'var(--card-bg)',
                                        border: `1px solid var(--border-color)`
                                    }}
                                >
                                    <div className="flex justify-between items-center mb-1.5">
                                        <div>
                                            <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Avg Response Time</p>
                                            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>3.2 min</h3>
                                        </div>
                                        <span className="text-green-600 text-[10px]">↓ 15%</span>
                                    </div>
                                    <div className="h-20">
                                        <Line data={responseTimeData} options={chartOptions} />
                                    </div>
                                </div>
                            </div>

                            {/* Activity & Quick Actions - More Compact */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                                <div className="lg:col-span-2">
                                    <div className="rounded-lg p-2.5 shadow-sm border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                                        <div className="flex items-center justify-between mb-2">
                                            <h2 className="text-xs font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                                                <Activity size={14} className="text-[#6237A0]" />
                                                Recent Activity
                                            </h2>
                                            <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Live</span>
                                        </div>
                                        <div className="space-y-2 max-h-[180px] overflow-y-auto custom-scrollbar">
                                            {activity.slice(0, 4).map((item, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="flex items-center gap-2 pb-2 border-b last:border-0 last:pb-0"
                                                    style={{ borderColor: 'var(--border-color)' }}
                                                >
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6237A0] to-[#7A4ED9] flex items-center justify-center text-white font-semibold text-[9px] flex-shrink-0">
                                                        {item.agent.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[10px]" style={{ color: 'var(--text-primary)' }}>
                                                            <span className="font-medium">{item.agent}</span> {item.action}
                                                        </p>
                                                        <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{item.time}</p>
                                                    </div>
                                                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium flex-shrink-0 ${
                                                        item.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                                        item.status === 'active' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-purple-100 text-purple-700'
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="rounded-lg p-2.5 shadow-sm border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                                        <h2 className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                                            <div className="w-0.5 h-4 bg-gradient-to-b from-[#6237A0] to-[#7A4ED9] rounded-full"></div>
                                            Quick Actions
                                        </h2>
                                        <div className="grid grid-cols-1 gap-1.5">
                                            <button 
                                                onClick={() => navigate('/Chats')}
                                                className="flex items-center gap-2 p-2 rounded-lg border transition-all text-left group"
                                                style={{ borderColor: 'var(--border-color)' }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderColor = '#6237A0';
                                                    e.currentTarget.style.background = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(245, 243, 255, 0.5)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                                    e.currentTarget.style.background = 'transparent';
                                                }}
                                            >
                                                <div className="p-1.5 rounded-lg bg-purple-100 group-hover:bg-[#6237A0] transition-colors">
                                                    <MessageSquare size={14} className="text-[#6237A0] group-hover:text-white transition-colors" />
                                                </div>
                                                <span className="text-[10px] font-medium group-hover:text-[#6237A0] transition-colors" style={{ color: 'var(--text-primary)' }}>View All Chats</span>
                                            </button>
                                            {hasPermission(PERMISSIONS.CREATE_ACCOUNT) && (
                                                <button 
                                                    onClick={() => navigate('/manage-agents')}
                                                    className="flex items-center gap-2 p-2 rounded-lg border transition-all text-left group"
                                                    style={{ borderColor: 'var(--border-color)' }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.borderColor = '#6237A0';
                                                        e.currentTarget.style.background = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(245, 243, 255, 0.5)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                                        e.currentTarget.style.background = 'transparent';
                                                    }}
                                                >
                                                    <div className="p-1.5 rounded-lg bg-purple-100 group-hover:bg-[#6237A0] transition-colors">
                                                        <Users size={14} className="text-[#6237A0] group-hover:text-white transition-colors" />
                                                    </div>
                                                    <span className="text-[10px] font-medium group-hover:text-[#6237A0] transition-colors" style={{ color: 'var(--text-primary)' }}>Manage Agents</span>
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => navigate('/queues')}
                                                className="flex items-center gap-2 p-2 rounded-lg border transition-all text-left group"
                                                style={{ borderColor: 'var(--border-color)' }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderColor = '#6237A0';
                                                    e.currentTarget.style.background = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(245, 243, 255, 0.5)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                                    e.currentTarget.style.background = 'transparent';
                                                }}
                                            >
                                                <div className="p-1.5 rounded-lg bg-purple-100 group-hover:bg-[#6237A0] transition-colors">
                                                    <Clock size={14} className="text-[#6237A0] group-hover:text-white transition-colors" />
                                                </div>
                                                <span className="text-[10px] font-medium group-hover:text-[#6237A0] transition-colors" style={{ color: 'var(--text-primary)' }}>View Queue</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </Layout>
    );
}
