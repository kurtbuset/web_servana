import { TrendingUp } from "react-feather";

/**
 * StatCard - Reusable stat card component
 */
export default function StatCard({ icon: Icon, label, value, trend, color, onClick }) {
    return (
        <div 
            className={`rounded-lg p-4 shadow-sm border hover:shadow-lg transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
            style={{ 
                backgroundColor: 'var(--card-bg)', 
                borderColor: 'var(--border-color)'
            }}
            onClick={onClick}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs mb-1 font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                    <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{value}</h3>
                    {trend && (
                        <div className="flex items-center gap-1 mt-1">
                            <TrendingUp size={12} className="text-green-500" />
                            <span className="text-xs text-green-500 font-medium">{trend}</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${color} shadow-lg`}>
                    <Icon size={20} strokeWidth={2} className="text-white" />
                </div>
            </div>
        </div>
    );
}
