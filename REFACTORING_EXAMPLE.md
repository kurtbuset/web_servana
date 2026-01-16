# Refactoring Example: Chats Screen

## 📊 Current State Analysis

### Current Chats.jsx Issues:
- **988 lines** of code in a single file
- **30+ useState hooks** - state management chaos
- **Multiple useEffect hooks** - side effects everywhere
- **Direct API calls** - no abstraction
- **Socket logic mixed** with UI
- **Business logic** in component
- **Hard to test** - everything coupled
- **Not reusable** - monolithic component

## 🎯 Refactored Structure

### New File Organization:

```
src/
├── api/services/
│   └── chat.service.js          # API calls
├── hooks/
│   ├── useChat.js               # Chat state & logic
│   ├── useChatGroups.js         # Chat groups logic
│   ├── useMessages.js           # Messages logic
│   ├── useSocket.js             # Socket.io logic
│   └── useCannedMessages.js     # Canned messages logic
├── components/
│   ├── common/
│   │   ├── Modal/
│   │   ├── Select/
│   │   └── Textarea/
│   └── features/chat/
│       ├── ChatList/
│       │   ├── ChatList.jsx
│       │   ├── ChatListItem.jsx
│       │   └── DepartmentFilter.jsx
│       ├── ChatWindow/
│       │   ├── ChatWindow.jsx
│       │   ├── ChatHeader.jsx
│       │   ├── ChatMessages.jsx
│       │   ├── ChatInput.jsx
│       │   └── MessageBubble.jsx
│       ├── CannedMessages/
│       │   └── CannedMessages.jsx
│       └── Modals/
│           ├── EndChatModal.jsx
│           └── TransferModal.jsx
└── pages/Chat/
    └── ChatPage.jsx             # Main page (100 lines)
```

---

## 📝 Step-by-Step Refactoring

### Step 1: Create API Service

```javascript
// src/api/services/chat.service.js
import { apiClient } from '../client';

export const chatService = {
  // Get all chat groups
  getChatGroups: async () => {
    const { data } = await apiClient.get('/chat/chatgroups');
    return data;
  },

  // Get messages for a client
  getMessages: async (clientId, params = {}) => {
    const { data } = await apiClient.get(`/chat/${clientId}`, { params });
    return data;
  },

  // Get canned messages
  getCannedMessages: async () => {
    const { data } = await apiClient.get('/chat/canned-messages');
    return data;
  },

  // Send message (via API, not socket)
  sendMessage: async (messageData) => {
    const { data } = await apiClient.post('/chat/messages', messageData);
    return data;
  },
};
```

### Step 2: Create Custom Hooks

#### useSocket Hook
```javascript
// src/hooks/useSocket.js
import { useEffect, useRef } from 'react';
import socket from '@/socket';

export function useSocket() {
  const socketRef = useRef(socket);

  useEffect(() => {
    socketRef.current.connect();
    console.log('Socket connected');

    return () => {
      socketRef.current.disconnect();
      console.log('Socket disconnected');
    };
  }, []);

  return socketRef.current;
}
```

#### useChatGroups Hook
```javascript
// src/hooks/useChatGroups.js
import { useState, useEffect } from 'react';
import { chatService } from '@/api/services';
import { useSocket } from './useSocket';

export function useChatGroups() {
  const [chatGroups, setChatGroups] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const socket = useSocket();

  const fetchChatGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatService.getChatGroups();
      const groups = Array.isArray(data) ? data : [];
      
      // Organize by department
      const deptMap = {};
      groups.forEach((group) => {
        const dept = group.department;
        if (!deptMap[dept]) deptMap[dept] = [];
        deptMap[dept].push({ ...group.customer, department: dept });
      });

      setChatGroups(deptMap);
      setDepartments(['All', ...Object.keys(deptMap)]);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load chat groups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatGroups();

    socket.on('updateChatGroups', fetchChatGroups);

    return () => {
      socket.off('updateChatGroups', fetchChatGroups);
    };
  }, []);

  const filteredGroups = selectedDepartment === 'All'
    ? Object.values(chatGroups).flat()
    : chatGroups[selectedDepartment] || [];

  return {
    chatGroups: filteredGroups,
    allChatGroups: chatGroups,
    departments,
    selectedDepartment,
    setSelectedDepartment,
    loading,
    error,
    refetch: fetchChatGroups,
  };
}
```

#### useMessages Hook
```javascript
// src/hooks/useMessages.js
import { useState, useEffect, useCallback } from 'react';
import { chatService } from '@/api/services';
import { useSocket } from './useSocket';

export function useMessages(clientId, chatGroupId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [earliestTime, setEarliestTime] = useState(null);
  const socket = useSocket();

  const loadMessages = useCallback(async (before = null, append = false) => {
    if (!clientId) return;

    setLoading(true);
    try {
      const { messages: newMessages } = await chatService.getMessages(clientId, {
        before,
        limit: 10,
      });

      const formatted = newMessages.map((msg) => ({
        id: msg.chat_id,
        sender: msg.sys_user_id ? 'user' : 'system',
        content: msg.chat_body,
        timestamp: msg.chat_created_at,
        displayTime: new Date(msg.chat_created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));

      setMessages((prev) => {
        const combined = append ? [...formatted, ...prev] : formatted;
        // Deduplicate
        const unique = [];
        const seen = new Set();
        for (const m of combined) {
          if (!seen.has(m.id)) {
            seen.add(m.id);
            unique.push(m);
          }
        }
        return unique;
      });

      if (formatted.length > 0) {
        setEarliestTime(formatted[0].timestamp);
      }
      if (formatted.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    if (!chatGroupId) return;

    // Join chat group
    socket.emit('joinChatGroup', chatGroupId);

    // Listen for new messages
    const handleReceiveMessage = (msg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.chat_id);
        if (exists) return prev;

        return [
          ...prev,
          {
            id: msg.chat_id,
            sender: msg.sys_user_id ? 'user' : 'system',
            content: msg.chat_body,
            timestamp: msg.chat_created_at,
            displayTime: new Date(msg.chat_created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        ];
      });
    };

    socket.on('receiveMessage', handleReceiveMessage);

    // Load initial messages
    loadMessages();

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [clientId, chatGroupId, loadMessages]);

  const sendMessage = useCallback((content) => {
    if (!content.trim() || !chatGroupId) return;

    socket.emit('sendMessage', {
      chat_body: content,
      chat_group_id: chatGroupId,
      sys_user_id: 1, // Should come from auth context
      client_id: null,
    });
  }, [chatGroupId, socket]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadMessages(earliestTime, true);
    }
  }, [hasMore, loading, earliestTime, loadMessages]);

  return {
    messages,
    loading,
    hasMore,
    sendMessage,
    loadMore,
  };
}
```

#### useCannedMessages Hook
```javascript
// src/hooks/useCannedMessages.js
import { useState, useEffect } from 'react';
import { chatService } from '@/api/services';

export function useCannedMessages() {
  const [cannedMessages, setCannedMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCannedMessages = async () => {
      setLoading(true);
      try {
        const data = await chatService.getCannedMessages();
        if (Array.isArray(data)) {
          setCannedMessages(data.map((msg) => msg.canned_message));
        }
      } catch (err) {
        console.error('Failed to load canned messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCannedMessages();
  }, []);

  return { cannedMessages, loading };
}
```

### Step 3: Create Feature Components

#### ChatList Component
```javascript
// src/components/features/chat/ChatList/ChatList.jsx
import { useState } from 'react';
import { Filter } from 'react-feather';
import { ChatListItem } from './ChatListItem';
import { DepartmentFilter } from './DepartmentFilter';

export function ChatList({ 
  chatGroups, 
  selectedChat, 
  onSelectChat, 
  departments,
  selectedDepartment,
  onDepartmentChange,
  loading 
}) {
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="w-full md:w-[320px] bg-[#F5F5F5] overflow-y-auto">
      {/* Department Filter */}
      <div className="relative p-4">
        <button
          className="w-full flex items-center justify-between rounded-xl py-2 px-4 bg-[#E6DCF7]"
          onClick={() => setShowDeptDropdown(!showDeptDropdown)}
        >
          <span className="text-sm text-[#6237A0]">{selectedDepartment}</span>
          <Filter size={16} className="text-[#6237A0]" />
        </button>

        {showDeptDropdown && (
          <DepartmentFilter
            departments={departments}
            selected={selectedDepartment}
            onSelect={(dept) => {
              onDepartmentChange(dept);
              setShowDeptDropdown(false);
            }}
          />
        )}
      </div>

      {/* Chat List */}
      <div className="space-y-2 px-2">
        {chatGroups.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isSelected={selectedChat?.id === chat.id}
            onClick={() => onSelectChat(chat)}
          />
        ))}
      </div>
    </div>
  );
}
```

#### ChatWindow Component
```javascript
// src/components/features/chat/ChatWindow/ChatWindow.jsx
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { useMessages, useCannedMessages } from '@/hooks';

export function ChatWindow({ chat }) {
  const { messages, loading, sendMessage, loadMore, hasMore } = useMessages(
    chat?.id,
    chat?.chat_group_id
  );
  const { cannedMessages } = useCannedMessages();

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader chat={chat} />
      <ChatMessages 
        messages={messages} 
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
      <ChatInput 
        onSend={sendMessage}
        cannedMessages={cannedMessages}
      />
    </div>
  );
}
```

### Step 4: Create Main Page

```javascript
// src/pages/Chat/ChatPage.jsx
import { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { ChatList, ChatWindow } from '@/components/features/chat';
import { useChatGroups } from '@/hooks';

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  
  const {
    chatGroups,
    departments,
    selectedDepartment,
    setSelectedDepartment,
    loading,
  } = useChatGroups();

  return (
    <MainLayout>
      <div className="flex h-full">
        <ChatList
          chatGroups={chatGroups}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          departments={departments}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          loading={loading}
        />
        <ChatWindow chat={selectedChat} />
      </div>
    </MainLayout>
  );
}
```

---

## 📊 Comparison

### Before:
```
Chats.jsx: 988 lines
├── 30+ useState hooks
├── 10+ useEffect hooks
├── API calls
├── Socket logic
├── Business logic
├── UI components
└── Event handlers
```

### After:
```
ChatPage.jsx: ~50 lines
├── hooks/
│   ├── useSocket.js: ~30 lines
│   ├── useChatGroups.js: ~80 lines
│   ├── useMessages.js: ~120 lines
│   └── useCannedMessages.js: ~30 lines
├── api/services/
│   └── chat.service.js: ~40 lines
└── components/features/chat/
    ├── ChatList/: ~100 lines
    ├── ChatWindow/: ~150 lines
    ├── ChatHeader/: ~50 lines
    ├── ChatMessages/: ~80 lines
    ├── ChatInput/: ~100 lines
    └── Modals/: ~100 lines
```

## ✅ Benefits Achieved

1. **Maintainability**: Each file has a single responsibility
2. **Reusability**: Hooks and components can be reused
3. **Testability**: Each piece can be tested independently
4. **Readability**: Code is organized and easy to understand
5. **Scalability**: Easy to add new features
6. **Performance**: Better optimization opportunities

## 🚀 Next Steps

1. Apply this pattern to other screens
2. Create more reusable components
3. Add unit tests
4. Add error boundaries
5. Optimize performance

---

**Result**: From 988-line monolith to clean, modular architecture! 🎉
