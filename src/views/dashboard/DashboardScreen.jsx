import Layout from "../../components/Layout";

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