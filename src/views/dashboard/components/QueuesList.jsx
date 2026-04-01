import { Clock } from "react-feather";
import Badge from "../../../components/ui/Badge";

/**
 * QueuesList - Shows pending queues preview
 */
export default function QueuesList({ queues, className }) {
    return (
        <div className={`${className || ''} rounded-lg p-3 shadow-sm border flex flex-col`} 
             style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Clock size={16} className="text-[#6237A0]" />
                    Pending Queues
                </h2>
                <Badge variant="purple" size="lg">
                    {queues.length} waiting
                </Badge>
            </div>
            <div className="space-y-2 overflow-y-auto flex-1">
                {queues.length === 0 ? (
                    <div className="text-center py-6">
                        <Clock size={32} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No pending queues</p>
                    </div>
                ) : (
                    queues.map((queue, idx) => (
                        <div 
                            key={idx} 
                            className="flex items-start gap-2 p-2 border rounded-lg hover:bg-opacity-50 transition-colors cursor-pointer"
                            style={{ borderColor: 'var(--border-color)' }}
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6237A0] to-[#7A4ED9] flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 shadow-md">
                                {queue.client.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                                        {queue.client}
                                    </p>
                                    <Badge variant="purple" size="sm" className="ml-1">
                                        {queue.waitTime}
                                    </Badge>
                                </div>
                                <p className="text-[10px] mb-1 line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
                                    {queue.message}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                    <Badge variant="purple-soft" size="xs" truncate>
                                        {queue.department}
                                    </Badge>
                                    <span className="text-[9px] ml-1" style={{ color: 'var(--text-secondary)' }}>
                                        • {queue.timestamp}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
