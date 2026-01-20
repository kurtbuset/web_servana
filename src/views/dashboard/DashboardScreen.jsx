import { useState } from "react";
import TopNavbar from "../../../src/components/TopNavbar";
import Sidebar from "../../../src/components/Sidebar";
import { MessageSquare, Users, Clock, CheckCircle, TrendingUp, Activity, UserCheck } from "react-feather";
import { useUser } from "../../../src/context/UserContext";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../../hooks/useDashboard";

/**
 * DashboardScreen - Refactored dashboard view
 * 
 * Uses the new useDashboard hook for business logic while maintaining
 * the exact same UI/UX as the original Dashboard screen.
 * 
 * Features:
 * - Role-based statistics display (Admin vs Agent)
 * - Real-time activity feed
 * - Quick action buttons
 * - Responsive design with mobile sidebar
 */
export default function DashboardScreen() {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const { userData, isAdmin, isAgent, getRoleName } = useUser();
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
            className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{label}</p>
                    <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            <TrendingUp size={14} className="text-green-500" />
                            <span className="text-xs text-green-500 font-medium">{trend}</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon size={24} strokeWidth={1.5} className="text-white" />
                </div>
            </div>
        </div>
    );

    const RecentActivity = () => (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <Activity size={20} className="text-gray-400" />
            </div>
            <div className="space-y-4">
                {activity.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6237A0] to-[#7A4ED9] flex items-center justify-center text-white font-semibold text-sm">
                            {item.agent.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900">
                                <span className="font-medium">{item.agent}</span> {item.action}
                            </p>
                            <p className="text-xs text-gray-500">{item.time}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
                <button 
                    onClick={() => navigate('/chats')}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#6237A0] hover:bg-purple-50 transition-all text-left"
                >
                    <MessageSquare size={20} className="text-[#6237A0]" />
                    <span className="text-sm font-medium text-gray-700">View All Chats</span>
                </button>
                {isAdmin() && (
                    <button 
                        onClick={() => navigate('/manage-agents')}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#6237A0] hover:bg-purple-50 transition-all text-left"
                    >
                        <Users size={20} className="text-[#6237A0]" />
                        <span className="text-sm font-medium text-gray-700">Manage Agents</span>
                    </button>
                )}
                <button 
                    onClick={() => navigate('/queues')}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#6237A0] hover:bg-purple-50 transition-all text-left"
                >
                    <Clock size={20} className="text-[#6237A0]" />
                    <span className="text-sm font-medium text-gray-700">View Queue</span>
                </button>
            </div>
        </div>
    );

    // Admin sees all stats, Agent sees personal stats
    const renderStats = () => {
        if (isAdmin()) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        icon={MessageSquare}
                        label="Active Chats"
                        value={stats.activeChats}
                        trend="+12% from yesterday"
                        color="bg-gradient-to-br from-[#6237A0] to-[#7A4ED9]"
                        onClick={() => navigate('/chats')}
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
        } else if (isAgent()) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={MessageSquare}
                        label="My Active Chats"
                        value={stats.myActiveChats}
                        color="bg-gradient-to-br from-[#6237A0] to-[#7A4ED9]"
                        onClick={() => navigate('/chats')}
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
        return null;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#F7F5FB]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6237A0] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <>
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

                    <main className="flex-1 bg-[#F7F5FB] p-6 overflow-y-auto">
                        <div className="max-w-7xl mx-auto space-y-6">
                            {/* Header */}
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-[#2E1065] mb-2">Dashboard</h1>
                                <p className="text-gray-600">
                                    Welcome back, {userData?.profile?.prof_firstname || 'User'}! 
                                    <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                        {getRoleName()}
                                    </span>
                                </p>
                            </div>

                            {/* Stats Grid - Role-based */}
                            {renderStats()}

                            {/* Activity & Quick Actions */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
