import { MessageSquare, Users, Clock } from "react-feather";
import { memo } from "react";

/**
 * QuickActions - Quick action buttons
 */
const QuickActions = memo(function QuickActions({ navigate, permissions, className }) {
    return (
        <div className={`${className || ''} rounded-lg p-4 shadow-sm border`} 
             style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <div className="w-1 h-4 bg-gradient-to-b from-[#6237A0] to-[#7A4ED9] rounded-full"></div>
                Quick Actions
            </h2>
            <div className="space-y-2">
                <button 
                    onClick={() => navigate('/Chats')}
                    className="w-full flex items-center gap-2 p-2 rounded-lg border transition-all text-left group hover:border-[#6237A0] hover:bg-purple-50"
                    style={{ borderColor: 'var(--border-color)' }}
                >
                    <div className="p-1.5 rounded-md bg-purple-100 group-hover:bg-[#6237A0] transition-colors">
                        <MessageSquare size={14} className="text-[#6237A0] group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>View All Chats</span>
                </button>
                {/* {permissions.canCreateAccount && (
                    <button 
                        onClick={() => navigate('/manage-agents')}
                        className="w-full flex items-center gap-2 p-2 rounded-lg border transition-all text-left group hover:border-[#6237A0] hover:bg-purple-50"
                        style={{ borderColor: 'var(--border-color)' }}
                    >
                        <div className="p-1.5 rounded-md bg-purple-100 group-hover:bg-[#6237A0] transition-colors">
                            <Users size={14} className="text-[#6237A0] group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Manage Agents</span>
                    </button>
                )} */}
            </div>
        </div>
    );
});

export default QuickActions;
