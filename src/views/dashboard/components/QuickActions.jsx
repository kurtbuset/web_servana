import { MessageSquare, Users, Clock } from "react-feather";

/**
 * QuickActions - Quick action buttons
 */
export default function QuickActions({ navigate, hasPermission }) {
    return (
        <div className="dashboard-actions rounded-lg p-4 shadow-sm border" 
             style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <div className="w-1 h-5 bg-gradient-to-b from-[#6237A0] to-[#7A4ED9] rounded-full"></div>
                Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-2">
                <button 
                    onClick={() => navigate('/Chats')}
                    className="flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left group hover:border-[#6237A0]"
                    style={{ borderColor: 'var(--border-color)' }}
                >
                    <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-[#6237A0] transition-colors">
                        <MessageSquare size={18} className="text-[#6237A0] group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>View All Chats</span>
                </button>
                {hasPermission("priv_can_create_account") && (
                    <button 
                        onClick={() => navigate('/manage-agents')}
                        className="flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left group hover:border-[#6237A0]"
                        style={{ borderColor: 'var(--border-color)' }}
                    >
                        <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-[#6237A0] transition-colors">
                            <Users size={18} className="text-[#6237A0] group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Manage Agents</span>
                    </button>
                )}
                <button 
                    onClick={() => navigate('/queues')}
                    className="flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left group hover:border-[#6237A0]"
                    style={{ borderColor: 'var(--border-color)' }}
                >
                    <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-[#6237A0] transition-colors">
                        <Clock size={18} className="text-[#6237A0] group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>View Queue</span>
                </button>
            </div>
        </div>
    );
}
