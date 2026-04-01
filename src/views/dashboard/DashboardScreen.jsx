import Layout from "../../components/Layout";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import { useState, useEffect } from "react";
import { useAnalytics } from "../../hooks/useAnalytics";
import { useQueues } from "../../hooks/useQueues";

// Import new dashboard components
import ProfileStrip from "./components/ProfileStrip";
import PendingQueuesCard from "./components/PendingQueuesCard";
import StatsCard from "./components/StatsCard";
import ChattingCard from "./components/ChattingCard";
import CalendarCard from "./components/CalendarCard";
import QuickActionsCard from "./components/QuickActionsCard";

// Import styles
import "./components/DashboardStyles.css";

export default function DashboardScreen() {
    useQueues();
    
    // Analytics period state
    const [period] = useState('weekly');
    const [selectedDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });
    const [selectedWeek] = useState(() => {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        const weekStart = new Date(today.setDate(diff));
        return weekStart.toISOString().split('T')[0];
    });
    const [selectedMonth] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    });
    const [selectedYear] = useState(() => {
        return new Date().getFullYear().toString();
    });
    
    const analyticsDate = period === 'daily' ? selectedDate : null;
    const analyticsWeek = period === 'weekly' ? selectedWeek : null;
    const analyticsMonth = period === 'monthly' ? selectedMonth : null;
    const analyticsYear = period === 'yearly' ? selectedYear : null;
    useAnalytics(period, analyticsDate, analyticsWeek, analyticsMonth, analyticsYear);

    const { loading: queuesLoading } = useQueues();

    if (queuesLoading) {
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
            <div className="dashboard-container h-full overflow-hidden relative" style={{ 
                background: 'var(--bg)',
                backgroundImage: `
                    radial-gradient(ellipse 55% 35% at 80% 0%, rgba(139,92,246,.1) 0%, transparent 65%),
                    radial-gradient(ellipse 40% 28% at 5% 100%, rgba(8,145,178,.07) 0%, transparent 60%)
                `,
                color: 'var(--text)',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                padding: '16px 20px 16px 20px', /* Reduced top and bottom padding */
                overflow: 'hidden',
                boxSizing: 'border-box'
            }}>
                {/* Profile Strip */}
                <ProfileStrip />

                {/* Masonry Grid */}
                <div className="msnry">
                    {/* Pending Queues */}
                    <div className="card-queues-wrap">
                        <PendingQueuesCard />
                    </div>

                    {/* Message Count */}
                   

                    {/* Statistics (Chatting & Queued) */}
                    <div className="card-rating-wrap">
                        <StatsCard />
                    </div>

                    {/* Chatting */}
                    <div className="card-chat-wrap">
                        <ChattingCard />
                    </div>

                    {/* Calendar */}
                    <div className="card-cal-wrap">
                        <CalendarCard />
                    </div>

                    {/* Quick Actions */}
                    <div className="card-actions-wrap">
                        <QuickActionsCard />
                    </div>
                </div>
            </div>
        </Layout>
    );
}