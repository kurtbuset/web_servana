import { useState, useEffect } from "react";
import { useQueues } from "../../../hooks/useQueues";
import { ChatService } from "../../../services/chat.service";

export default function StatsCard() {
    const { queues } = useQueues();
    const [activeChats, setActiveChats] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch active chats
    useEffect(() => {
        const fetchActiveChats = async () => {
            try {
                const chatGroups = await ChatService.getChatGroups();
                setActiveChats(chatGroups || []);
            } catch (error) {
                console.error('Failed to fetch active chats:', error);
                setActiveChats([]);
            } finally {
                setLoading(false);
            }
        };

        fetchActiveChats();
    }, []);

    // Count chatting (active chat groups)
    const chattingCount = activeChats.length;
    
    // Count queued (from useQueues hook)
    const queuedCount = queues.length;

    // Calculate department rankings based on active chats
    const getDepartmentRankings = () => {
        const deptCounts = {};
        
        // Count chats per department
        activeChats.forEach(chat => {
            const deptName = chat.department || 'General';
            deptCounts[deptName] = (deptCounts[deptName] || 0) + 1;
        });
        
        // Convert to array and sort by count
        return Object.entries(deptCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3); // Top 3 only
    };

    // Calculate department rankings for queued chats
    const getQueueDepartmentRankings = () => {
        const deptCounts = {};
        
        // Count queued chats per department
        queues.forEach(queue => {
            const deptName = queue.department || 'General';
            deptCounts[deptName] = (deptCounts[deptName] || 0) + 1;
        });
        
        // Convert to array and sort by count
        return Object.entries(deptCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3); // Top 3 only
    };

    const topDepartments = getDepartmentRankings();
    const topQueueDepartments = getQueueDepartmentRankings();

    // Dynamic messages based on activity
    const getActivityMessage = () => {
        const total = chattingCount + queuedCount;
        
        if (total === 0) {
            return "All quiet right now! 😊";
        } else if (chattingCount > 0 && queuedCount === 0) {
            return `${chattingCount} ${chattingCount === 1 ? 'chat' : 'chats'} going strong! 💬`;
        } else if (chattingCount === 0 && queuedCount > 0) {
            return `${queuedCount} ${queuedCount === 1 ? 'person is' : 'people are'} waiting 👋`;
        } else if (queuedCount > chattingCount) {
            return "Busy day! Let's help everyone 🚀";
        } else {
            return "Things are moving! Keep it up 🎉";
        }
    };

    if (loading) {
        return (
            <div className="card card-gold" style={{ justifyContent: 'space-between' }}>
                <div className="card-title">
                    <span className="card-title-dot gold"></span>
                    Count
                </div>
                <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="card card-gold" style={{ justifyContent: 'space-between' }}>
            <div className="card-title">
                <span className="card-title-dot gold"></span>
                Count
            </div>
            
            {/* Stats display - side by side without inner containers */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-around',
                gap: '32px',
                flex: 1,
                padding: '20px 0'
            }}>
                {/* Queued Count - NOW ON LEFT with Rankings beside */}
                <div style={{ 
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px'
                }}>
                    {/* Left: Number and Label */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <div style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: '56px',
                            fontWeight: '600',
                            color: 'var(--gold)',
                            lineHeight: '1',
                            marginBottom: '12px'
                        }}>
                            {queuedCount}
                        </div>
                        <div style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: 'var(--gold)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em'
                        }}>
                            In Queue
                        </div>
                    </div>
                    
                    {/* Right: Top 3 Queue Department Rankings */}
                    {topQueueDepartments.length > 0 && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            paddingLeft: '16px',
                            borderLeft: '1px solid rgba(217, 119, 6, 0.2)'
                        }}>
                            {topQueueDepartments.map((dept, index) => (
                                <div key={dept.name} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '10px'
                                }}>
                                    <span style={{
                                        fontWeight: '700',
                                        color: 'var(--gold)',
                                        fontSize: '11px',
                                        minWidth: '16px'
                                    }}>
                                        {index + 1}
                                    </span>
                                    <span style={{ 
                                        flex: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        color: 'var(--muted)',
                                        minWidth: '80px'
                                    }}>
                                        {dept.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div style={{
                    width: '1px',
                    height: '80px',
                    background: 'linear-gradient(to bottom, transparent, rgba(217, 119, 6, 0.2), transparent)'
                }}></div>

                {/* Chatting Count - NOW ON RIGHT with Rankings beside */}
                <div style={{ 
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px'
                }}>
                    {/* Left: Number and Label */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <div style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: '56px',
                            fontWeight: '600',
                            color: 'var(--gold)',
                            lineHeight: '1',
                            marginBottom: '12px'
                        }}>
                            {chattingCount}
                        </div>
                        <div style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: 'var(--gold)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em'
                        }}>
                            Chatting
                        </div>
                    </div>
                    
                    {/* Right: Top 3 Department Rankings */}
                    {topDepartments.length > 0 && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            paddingLeft: '16px',
                            borderLeft: '1px solid rgba(217, 119, 6, 0.2)'
                        }}>
                            {topDepartments.map((dept, index) => (
                                <div key={dept.name} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '10px'
                                }}>
                                    <span style={{
                                        fontWeight: '700',
                                        color: 'var(--gold)',
                                        fontSize: '11px',
                                        minWidth: '16px'
                                    }}>
                                        {index + 1}
                                    </span>
                                    <span style={{ 
                                        flex: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        color: 'var(--muted)',
                                        minWidth: '80px'
                                    }}>
                                        {dept.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom text - dynamic and friendly */}
            <div style={{ 
                fontSize: '11px',
                color: 'var(--text)', 
                lineHeight: '1.4',
                textAlign: 'center',
                marginTop: '8px',
                fontWeight: '500'
            }}>
                {getActivityMessage()}
            </div>
        </div>
    );
}
