import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";

export default function QuickActionsCard() {
    const navigate = useNavigate();
    const { hasPermission } = useUser();

    const actions = [
        {
            label: 'New Chat',
            icon: (
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 5v14M5 12h14"/>
                </svg>
            ),
            onClick: () => navigate('/chats'),
            style: {
                background: 'var(--purple-pale)',
                color: 'var(--purple)'
            }
        },
        {
            label: 'Add Agent',
            icon: (
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
            ),
            onClick: () => navigate('/manage-agents'),
            style: {
                background: 'var(--cyan-pale)',
                color: 'var(--cyan)'
            },
            permission: 'manage_agents'
        },
        {
            label: 'Departments',
            icon: (
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
            ),
            onClick: () => navigate('/departments'),
            style: {
                background: '#fef9ec',
                color: 'var(--gold)'
            },
            permission: 'priv_can_view_department'
        },
        {
            label: 'Roles',
            icon: (
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                </svg>
            ),
            onClick: () => navigate('/roles'),
            style: {
                background: '#fff1f2',
                color: '#e11d48'
            },
            permission: 'priv_can_view_roles'
        }
    ];

    const visibleActions = actions.filter(action => 
        !action.permission || hasPermission(action.permission)
    );

    return (
        <div className="card">
            <div className="card-title">
                <span className="card-title-dot"></span>
                Quick Actions
            </div>
            <div className="actions-grid">
                {visibleActions.map((action, index) => (
                    <button 
                        key={index}
                        className="action-btn"
                        onClick={action.onClick}
                    >
                        <div 
                            className="action-btn-icon" 
                            style={action.style}
                        >
                            {action.icon}
                        </div>
                        <span className="action-btn-label">
                            {action.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}