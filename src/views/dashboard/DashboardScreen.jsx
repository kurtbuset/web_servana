import { useState } from "react";
import TopNavbar from "../../../src/components/TopNavbar";
import Sidebar from "../../../src/components/Sidebar";
import { MessageSquare, Users, Clock, CheckCircle, TrendingUp, Activity, UserCheck } from "react-feather";
import { useUser } from "../../../src/context/UserContext";
import { useTheme } from "../../../src/context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../../hooks/useDashboard";

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
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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

    const StatCard = ({ icon: Icon, label, value, trend, color, onClick }) => (
        <div 
            className={`rounded-xl p-4 sm:p-5 md:p-6 shadow-sm border hover:shadow-lg transition-all duration-300 relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
            style={{ 
                backgroundColor: 'var(--card-bg)', 
                borderColor: 'var(--border-color)'
            }}
            onClick={onClick}
        >
            <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                    <p className="text-xs sm:text-sm mb-1 font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                    <h3 className="text-2xl sm:text-3xl lg:text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{value}</h3>
                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            <TrendingUp size={12} className="text-green-500" />
                            <span className="text-xs text-green-500 font-medium">{trend}</span>
                        </div>
                    )}
                </div>
                <div className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl ${color} shadow-lg`}>
                    <Icon size={20} strokeWidth={1.5} className="text-white sm:w-6 sm:h-6" />
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
                {hasPermission("priv_can_create_account") && (
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
        if (hasPermission("priv_can_manage_role") || hasPermission("priv_can_create_account")) {
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
        } else if (hasPermission("priv_can_view_message")) {
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
            <div className="flex items-center justify-center h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6237A0] mx-auto mb-4"></div>
                    <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <>
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
            <div className="flex flex-col h-screen overflow-hidden">
                <TopNavbar toggleSidebar={toggleSidebar} />

                <div className="flex flex-1 overflow-hidden">
                    <Sidebar
                        isMobile={true}
                        isOpen={mobileSidebarOpen}
                        toggleDropdown={toggleDropdown}
                        openDropdown={openDropdown}
                        onClose={() => setMobileSidebarOpen(false)}
                    />

                    <Sidebar
                        isMobile={false}
                        toggleDropdown={toggleDropdown}
                        openDropdown={openDropdown}
                    />

                    <main className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6 overflow-y-auto" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">
                            {/* Header with enhanced design */}
                            <div className="mb-4 sm:mb-6 rounded-xl p-4 sm:p-5 md:p-6 border shadow-sm" style={{ backgroundColor: isDark ? 'rgba(45, 45, 45, 0.6)' : 'rgba(255, 255, 255, 0.6)', borderColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)' }}>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#C4B5FD] bg-clip-text text-transparent mb-2">
                                            Dashboard
                                        </h1>
                                        <p className="text-sm sm:text-base flex flex-wrap items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                                            Welcome back, <span className="font-semibold text-[#A78BFA]">{userData?.profile?.prof_firstname || 'User'}</span>! 
                                            <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                                                {getRoleName()}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Live</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid - Role-based */}
                            {renderStats()}

                            {/* Activity & Quick Actions */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                                <div className="lg:col-span-2">
                                    <RecentActivity />
                                </div>
                                <div>
                                    <QuickActions />
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
