import { useState, useEffect } from "react";
import { ChatService } from "../../../services/chat.service";
import ScrollContainer from "../../../components/ScrollContainer";

export default function ChattingCard() {
    const [activeChats, setActiveChats] = useState([]);
    const [loading, setLoading] = useState(true);
    
    
    // Fetch active chats (same as chats screen)
    useEffect(() => {
        const fetchActiveChats = async () => {
            setLoading(true);
            try {
                const chatGroups = await ChatService.getChatGroups();
                // Transform to match the format expected by the component
                const transformedChats = chatGroups.map(group => ({
                    id: group.customer.id,
                    chat_group_id: group.customer.chat_group_id,
                    name: group.customer.name,
                    number: group.customer.number,
                    department: group.department,
                    time: group.customer.time,
                    profile: group.customer.profile
                }));
                setActiveChats(transformedChats);
            } catch (error) {
                console.error('Failed to fetch active chats:', error);
                setActiveChats([]);
            } finally {
                setLoading(false);
            }
        };

        fetchActiveChats();
    }, []);

    const getAvatarClass = (index) => {
        const classes = ['av1', 'av2', 'av3', 'av4', 'av5', 'av6'];
        return classes[index % classes.length];
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const chatMessages = [
        'Working on your issue…',
        'Looking into this now',
        'Can you share more details?',
        'Let me check that for you',
        'Almost done with your request',
        'Thanks for your patience'
    ];

    // Show first 3 active chats for dashboard display
    const displayChats = activeChats.slice(0, 3);

    if (loading) {
        return (
            <div className="card card-cyan" style={{ justifyContent: 'space-between' }}>
                <div className="card-title">
                    <span className="card-title-dot cyan"></span>
                    Chatting
                </div>
                <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="card card-cyan" style={{ justifyContent: 'space-between' }}>
            <div className="card-title">
                <span className="card-title-dot cyan"></span>
                Chatting
            </div>
            <ScrollContainer 
                variant="thin" 
                direction="vertical" 
                style={{ flex: 1 }}
                className="px-1"
            >
                {activeChats.length > 0 ? (
                    activeChats.map((chat, index) => ( // Show all active chats, let scroll handle overflow
                        <div key={chat.id || index} className="chat-item">
                            <div className={`agent-avatar ${getAvatarClass(index)}`}>
                                {getInitials(chat.name || 'Customer')}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="queue-name" style={{ fontSize: '12px' }}> {/* Reduced font size */}
                                    {chat.name || 'Customer'}
                                </div>
                                <div className="chat-msg" style={{ 
                                    whiteSpace: 'nowrap', 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis' 
                                }}>
                                    {chatMessages[index % chatMessages.length]}
                                </div>
                            </div>
                            <div className="chat-online"></div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-24 text-gray-500"> {/* Reduced height */}
                        <div className="text-center">
                            <div className="text-sm">No active chats</div>
                            <div className="text-xs mt-1">Ready for new conversations</div>
                        </div>
                    </div>
                )}
            </ScrollContainer>
        </div>
    );
}