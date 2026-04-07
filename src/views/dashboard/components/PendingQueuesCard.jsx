import { useQueues } from "../../../hooks/useQueues";
import ScrollContainer from "../../../components/ScrollContainer";

export default function PendingQueuesCard() {
    const { queues, loading, refreshing, refreshQueues } = useQueues();
    
    const getAvatarClass = (index) => {
        const classes = ['av1', 'av2', 'av3', 'av4', 'av5', 'av6'];
        return classes[index % classes.length];
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleRefresh = () => {
        console.log('🔄 Manual refresh triggered for pending queues');
        refreshQueues();
    };

    if (loading) {
        return (
            <div className="card" style={{ minHeight: '100%' }}>
                <div className="queue-header">
                    <div className="card-title">
                        <span className="card-title-dot cyan"></span>
                        Pending Queues
                    </div>
                    <span className="waiting-pill">Loading...</span>
                </div>
                <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="card" style={{ minHeight: '100%' }}>
            <div className="queue-header">
                <div className="card-title">
                    <span className="card-title-dot cyan"></span>
                    Pending Queues
                </div>
                <div className="flex items-center gap-2">
                    <span className="waiting-pill">
                        {queues?.length || 0} Waiting
                    </span>
                    <button 
                        onClick={handleRefresh}
                        className="refresh-btn"
                        title="Refresh queues"
                        disabled={refreshing}
                    >
                        <svg 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                            className={refreshing ? 'animate-spin' : ''}
                        >
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                            <path d="M21 3v5h-5"/>
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                            <path d="M3 21v-5h5"/>
                        </svg>
                    </button>
                </div>
            </div>
            <ScrollContainer 
                variant="thin" 
                direction="vertical" 
                style={{ flex: 1 }}
                className="px-1"
            >
                {queues && queues.length > 0 ? (
                    queues.map((queue, index) => ( // Show all queues, let scroll handle overflow
                        <div key={queue.id || index} className="queue-item">
                            <div className={`agent-avatar ${getAvatarClass(index)}`}>
                                {getInitials(queue.chat_group_name || queue.customer?.name || 'Customer')}
                            </div>
                            <span className="queue-name">
                                {queue.chat_group_name || queue.customer?.name || 'Customer'}
                            </span>
                            <span className="queue-dept">
                                {queue.department || 'General'}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-24 text-gray-500"> {/* Reduced height */}
                        <div className="text-center">
                            <div className="text-sm">No pending queues</div>
                            <div className="text-xs mt-1">All caught up!</div>
                        </div>
                    </div>
                )}
            </ScrollContainer>
        </div>
    );
}