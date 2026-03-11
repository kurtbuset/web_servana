import { Clock } from "react-feather";

/**
 * QueuesList - Shows pending queues preview
 */
export default function QueuesList({ queues }) {
    return (
        <div className="dashboard-activity rounded-lg p-5 shadow-sm border flex flex-col" 
             style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Clock size={20} className="text-[#6237A0]" />
                    Pending Queues
                </h2>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    {queues.length} waiting
                </span>
            </div>
            <div className="space-y-3 overflow-y-auto flex-1">
                {queues.length === 0 ? (
                    <div className="text-center py-8">
                        <Clock size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No pending queues</p>
                    </div>
                ) : (
                    queues.map((queue, idx) => (
                        <div 
                            key={idx} 
                            className="flex items-start gap-3 p-3 border rounded-lg hover:bg-opacity-50 transition-colors cursor-pointer"
                            style={{ borderColor: 'var(--border-color)' }}
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6237A0] to-[#7A4ED9] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-md">
                                {queue.client.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                        {queue.client}
                                    </p>
                                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                                        {queue.waitTime}
                                    </span>
                                </div>
                                <p className="text-xs mb-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                                    {queue.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full border border-purple-200">
                                        {queue.department}
                                    </span>
                                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
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
