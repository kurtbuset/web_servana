import { useState, useEffect } from "react";
import TopNavbar from "../../../src/components/TopNavbar";
import Sidebar from "../../../src/components/Sidebar";
import { 
    MessageSquare, Users, Clock, CheckCircle, TrendingUp, Activity, 
    UserCheck, BarChart, Zap, Target, Award, ArrowUpRight, 
    Calendar, Filter, RefreshCw, Download, Eye, Settings
} from "react-feather";
import { useUser } from "../../../src/context/UserContext";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../../hooks/useDashboard";
import ResponsiveContainer from "../../components/responsive/ResponsiveContainer";
import ResponsiveGrid from "../../components/responsive/ResponsiveGrid";

/**
 * DashboardScreen - Premium responsive dashboard for mobile, tablet, and desktop
 * 
 * Features:
 * - Advanced responsive design with mobile-first approach
 * - Premium animations and micro-interactions
 * - Role-based permission system with dynamic content
 * - Real-time statistics with trend indicators
 * - Interactive activity feed with status indicators
 * - Quick action cards with hover effects
 * - Professional glass morphism design elements
 * - Touch-optimized for mobile and tablet
 * - Advanced data visualization components
 */
export default function DashboardScreen() {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const { userData, hasPermission, getRoleName } = useUser();
    const navigate = useNavigate();
    const { stats, activity, loading } = useDashboard();

    // Animation on mount
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleSidebar = () => {
        setMobileSidebarOpen((prev) => !prev);
    };

    const toggleDropdown = (name) => {
        setOpenDropdown((prev) => (prev === name ? null : name));
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        // Simulate refresh delay
        setTimeout(() => setRefreshing(false), 1500);
    };

    const StatCard = ({ icon: Icon, label, value, trend, color, onClick, delay = 0 }) => (
        <div 
            className={`
                bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 border-opacity-20 dark:border-opacity-20 
                hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out
                ${onClick ? 'cursor-pointer group' : ''}
                ${mounted ? 'animate-slide-up' : 'opacity-0 translate-y-4'}
            `}
            style={{ animationDelay: `${delay}ms` }}
            onClick={onClick}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 transition-colors duration-200">{label}</p>
                        {onClick && (
                            <ArrowUpRight 
                                size={14} 
                                className="text-gray-400 dark:text-gray-500 group-hover:text-[#6237A0] dark:group-hover:text-purple-400 transition-colors duration-200" 
                            />
                        )}
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-200">{value}</h3>
                    {trend && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/30 rounded-full transition-colors duration-200">
                                <TrendingUp size={12} className="text-green-600 dark:text-green-400" />
                                <span className="text-xs text-green-700 dark:text-green-300 font-semibold">{trend}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className={`
                    p-4 rounded-xl shadow-lg transform transition-transform duration-200
                    ${onClick ? 'group-hover:scale-110' : ''}
                    ${color}
                `}>
                    <Icon size={24} strokeWidth={2} className="text-white" />
                </div>
            </div>
        </div>
    );

    const RecentActivity = () => (
        <div className={`
            bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 border-opacity-20 dark:border-opacity-20 transition-colors duration-200
            ${mounted ? 'animate-slide-up' : 'opacity-0 translate-y-4'}
        `}
        style={{ animationDelay: '400ms' }}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-[#6237A0] to-[#7A4ED9] rounded-lg">
                        <Activity size={20} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">Recent Activity</h2>
                </div>
                <button 
                    onClick={handleRefresh}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    disabled={refreshing}
                >
                    <RefreshCw 
                        size={16} 
                        className={`text-gray-400 dark:text-gray-500 ${refreshing ? 'animate-spin' : ''}`} 
                    />
                </button>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                {activity.map((item, idx) => (
                    <div 
                        key={idx} 
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border border-gray-100 dark:border-gray-700"
                    >
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6237A0] to-[#7A4ED9] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                {item.agent.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate transition-colors duration-200">
                                <span className="text-[#6237A0] dark:text-purple-400">{item.agent}</span> {item.action}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <Clock size={12} className="text-gray-400 dark:text-gray-500" />
                                <p className="text-xs text-gray-500 dark:text-gray-400">{item.time}</p>
                            </div>
                        </div>
                        <span className={`
                            px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200
                            ${item.status === 'resolved' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' :
                              item.status === 'active' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' :
                              'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'}
                        `}>
                            {item.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    const QuickActions = () => (
        <div className={`
            bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 border-opacity-20 dark:border-opacity-20 transition-colors duration-200
            ${mounted ? 'animate-slide-up' : 'opacity-0 translate-y-4'}
        `}
        style={{ animationDelay: '600ms' }}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-[#6237A0] to-[#7A4ED9] rounded-lg">
                    <Zap size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">Quick Actions</h2>
            </div>
            <div className="space-y-3">
                <button 
                    onClick={() => navigate('/chats')}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#6237A0] dark:hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 transition-all duration-300 text-left group"
                >
                    <div className="p-2 bg-gradient-to-br from-[#6237A0] to-[#7A4ED9] rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <MessageSquare size={18} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <span className="font-semibold text-gray-900 dark:text-gray-100 block transition-colors duration-200">View All Chats</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">Manage customer conversations</span>
                    </div>
                    <ArrowUpRight size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-[#6237A0] dark:group-hover:text-purple-400 transition-colors duration-200" />
                </button>
                
                {hasPermission("priv_can_create_account") && (
                    <button 
                        onClick={() => navigate('/manage-agents')}
                        className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#6237A0] dark:hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 transition-all duration-300 text-left group"
                    >
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
                            <Users size={18} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <span className="font-semibold text-gray-900 dark:text-gray-100 block transition-colors duration-200">Manage Agents</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">Add and configure team members</span>
                        </div>
                        <ArrowUpRight size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-[#6237A0] dark:group-hover:text-purple-400 transition-colors duration-200" />
                    </button>
                )}
                
                <button 
                    onClick={() => navigate('/queues')}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#6237A0] dark:hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 transition-all duration-300 text-left group"
                >
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <Clock size={18} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <span className="font-semibold text-gray-900 dark:text-gray-100 block transition-colors duration-200">View Queue</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">Check pending requests</span>
                    </div>
                    <ArrowUpRight size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-[#6237A0] dark:group-hover:text-purple-400 transition-colors duration-200" />
                </button>
            </div>
        </div>
    );

    // Show different stats based on permissions
    const renderStats = () => {
        // If user has management permissions, show admin-level stats
        if (hasPermission("priv_can_manage_role") || hasPermission("priv_can_create_account")) {
            return (
                <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap={6} minItemWidth={280}>
                    <StatCard
                        icon={MessageSquare}
                        label="Active Chats"
                        value={stats.activeChats}
                        trend="+12% from yesterday"
                        color="bg-gradient-to-br from-[#6237A0] to-[#7A4ED9]"
                        onClick={() => navigate('/chats')}
                        delay={0}
                    />
                    <StatCard
                        icon={Clock}
                        label="Pending Chats"
                        value={stats.pendingChats}
                        color="bg-gradient-to-br from-orange-500 to-orange-600"
                        onClick={() => navigate('/queues')}
                        delay={100}
                    />
                    <StatCard
                        icon={CheckCircle}
                        label="Resolved Today"
                        value={stats.resolvedToday}
                        trend="+8% from yesterday"
                        color="bg-gradient-to-br from-green-500 to-green-600"
                        delay={200}
                    />
                    <StatCard
                        icon={Users}
                        label="Active Agents"
                        value={stats.activeAgents}
                        color="bg-gradient-to-br from-blue-500 to-blue-600"
                        onClick={() => navigate('/manage-agents')}
                        delay={300}
                    />
                    <StatCard
                        icon={BarChart}
                        label="Total Chats"
                        value={stats.totalChats}
                        color="bg-gradient-to-br from-purple-500 to-purple-600"
                        delay={400}
                    />
                    <StatCard
                        icon={Target}
                        label="Avg Response Time"
                        value={stats.avgResponseTime}
                        trend="-15% faster"
                        color="bg-gradient-to-br from-teal-500 to-teal-600"
                        delay={500}
                    />
                </ResponsiveGrid>
            );
        } else if (hasPermission("priv_can_view_message")) {
            // Agent-level stats for users with chat permissions
            return (
                <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 4 }} gap={6} minItemWidth={250}>
                    <StatCard
                        icon={MessageSquare}
                        label="My Active Chats"
                        value={stats.myActiveChats}
                        color="bg-gradient-to-br from-[#6237A0] to-[#7A4ED9]"
                        onClick={() => navigate('/chats')}
                        delay={0}
                    />
                    <StatCard
                        icon={CheckCircle}
                        label="Resolved Today"
                        value={stats.myResolvedToday}
                        trend="+3 from yesterday"
                        color="bg-gradient-to-br from-green-500 to-green-600"
                        delay={100}
                    />
                    <StatCard
                        icon={Clock}
                        label="Pending in Queue"
                        value={stats.pendingChats}
                        color="bg-gradient-to-br from-orange-500 to-orange-600"
                        onClick={() => navigate('/queues')}
                        delay={200}
                    />
                    <StatCard
                        icon={Award}
                        label="Avg Response Time"
                        value={stats.avgResponseTime}
                        color="bg-gradient-to-br from-teal-500 to-teal-600"
                        delay={300}
                    />
                </ResponsiveGrid>
            );
        }
        // Default minimal stats for users with no specific permissions
        return (
            <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 2 }} gap={6} minItemWidth={300}>
                <StatCard
                    icon={Activity}
                    label="Welcome"
                    value="Dashboard"
                    color="bg-gradient-to-br from-gray-500 to-gray-600"
                    delay={0}
                />
                <StatCard
                    icon={Eye}
                    label="Your Role"
                    value={getRoleName()}
                    color="bg-gradient-to-br from-indigo-500 to-indigo-600"
                    delay={100}
                />
            </ResponsiveGrid>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#F7F5FB] via-[#FDFCFF] to-[#F0EBFF] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#6237A0]/20 border-t-[#6237A0] mx-auto mb-6"></div>
                        <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-[#7A4ED9] animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-200">Loading your dashboard...</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1 transition-colors duration-200">Preparing your workspace</p>
                </div>
            </div>
        );
    }

    return (
        <ResponsiveContainer>
            {({ isMobile, isTablet, isDesktop }) => (
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

                        <main className={`
                            flex-1 bg-gradient-to-br from-[#F7F5FB] via-[#FDFCFF] to-[#F0EBFF] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
                            overflow-y-auto custom-scrollbar relative transition-colors duration-200
                            ${isMobile ? 'p-4' : isTablet ? 'p-5' : 'p-6'}
                        `}>
                            {/* Background Elements */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-[#6237A0]/5 to-[#7A4ED9]/3 rounded-full blur-3xl animate-float"></div>
                                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-[#7A4ED9]/5 to-[#6237A0]/3 rounded-full blur-3xl animate-float-delayed"></div>
                            </div>

                            <div className="max-w-7xl mx-auto space-y-6 relative z-10">
                                {/* Header */}
                                <div className={`
                                    ${mounted ? 'animate-slide-up' : 'opacity-0 translate-y-4'}
                                    ${isMobile ? 'mb-4' : 'mb-6'}
                                `}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className={`
                                                font-bold text-[#2E1065] dark:text-gray-100 leading-tight transition-colors duration-200
                                                ${isMobile ? 'text-2xl mb-1' : 
                                                  isTablet ? 'text-3xl mb-2' : 
                                                  'text-4xl mb-2'}
                                            `}>
                                                Dashboard
                                            </h1>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className={`
                                                    text-gray-600 dark:text-gray-300 font-medium transition-colors duration-200
                                                    ${isMobile ? 'text-sm' : 'text-base'}
                                                `}>
                                                    Welcome back, {userData?.profile?.prof_firstname || 'User'}!
                                                </p>
                                                <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold border border-purple-200 dark:border-purple-700 transition-colors duration-200">
                                                    {getRoleName()}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {!isMobile && (
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={handleRefresh}
                                                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-gray-700 border-opacity-20 dark:border-opacity-20 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 shadow-lg"
                                                    disabled={refreshing}
                                                >
                                                    <RefreshCw size={16} className={`text-gray-600 dark:text-gray-300 ${refreshing ? 'animate-spin' : ''}`} />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Refresh</span>
                                                </button>
                                                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-gray-700 border-opacity-20 dark:border-opacity-20 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 shadow-lg">
                                                    <Download size={16} className="text-gray-600 dark:text-gray-300" />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Export</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Stats Grid - Role-based */}
                                {renderStats()}

                                {/* Activity & Quick Actions */}
                                <div className={`
                                    grid gap-6
                                    ${isMobile ? 'grid-cols-1' : 
                                      isTablet ? 'grid-cols-1' : 
                                      'grid-cols-1 lg:grid-cols-3'}
                                `}>
                                    <div className={`
                                        ${isMobile || isTablet ? 'order-2' : 'lg:col-span-2'}
                                    `}>
                                        <RecentActivity />
                                    </div>
                                    <div className={`
                                        ${isMobile || isTablet ? 'order-1' : ''}
                                    `}>
                                        <QuickActions />
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            )}
        </ResponsiveContainer>
    );
}
