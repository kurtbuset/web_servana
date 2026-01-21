# Recommended Folder Structure for servana_web

## 🎯 Current Problems

### Issues Identified:
1. **JSX Hell** - 988-line Chats.jsx with everything mixed together
2. **API Calls in Components** - Direct API calls scattered throughout
3. **No Separation of Concerns** - Business logic, UI, and state management mixed
4. **Duplicate Code** - Similar patterns repeated across screens
5. **Hard to Test** - Tightly coupled components
6. **Poor Reusability** - Components not modular
7. **State Management Chaos** - 30+ useState hooks in single component
8. **No Custom Hooks** - Logic not extracted and reusable

## 📁 Recommended Folder Structure

```
servana_web/
├── public/                          # Static assets
│   ├── images/
│   └── profile_picture/
│
├── src/
│   ├── api/                         # ✨ NEW - API layer
│   │   ├── client.js                # Axios instance configuration
│   │   ├── endpoints.js             # API endpoint constants
│   │   └── services/                # API service modules
│   │       ├── auth.service.js
│   │       ├── chat.service.js
│   │       ├── department.service.js
│   │       ├── profile.service.js
│   │       ├── role.service.js
│   │       └── index.js             # Export all services
│   │
│   ├── assets/                      # Static assets (images, fonts, etc.)
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/                  # ✨ RESTRUCTURED - Reusable components
│   │   ├── common/                  # Generic reusable components
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Button.test.jsx
│   │   │   │   └── index.js
│   │   │   ├── Input/
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Input.test.jsx
│   │   │   │   └── index.js
│   │   │   ├── Modal/
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── ConfirmModal.jsx
│   │   │   │   ├── Modal.test.jsx
│   │   │   │   └── index.js
│   │   │   ├── Dropdown/
│   │   │   ├── Select/
│   │   │   ├── Textarea/
│   │   │   ├── Avatar/
│   │   │   ├── Badge/
│   │   │   ├── Card/
│   │   │   ├── Spinner/
│   │   │   └── index.js
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── TopNavbar/
│   │   │   │   ├── TopNavbar.jsx
│   │   │   │   ├── TopNavbar.test.jsx
│   │   │   │   └── index.js
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── SidebarItem.jsx
│   │   │   │   ├── Sidebar.test.jsx
│   │   │   │   └── index.js
│   │   │   ├── MainLayout/
│   │   │   │   ├── MainLayout.jsx
│   │   │   │   └── index.js
│   │   │   └── index.js
│   │   │
│   │   ├── features/                # ✨ NEW - Feature-specific components
│   │   │   ├── chat/
│   │   │   │   ├── ChatList/
│   │   │   │   │   ├── ChatList.jsx
│   │   │   │   │   ├── ChatListItem.jsx
│   │   │   │   │   └── index.js
│   │   │   │   ├── ChatWindow/
│   │   │   │   │   ├── ChatWindow.jsx
│   │   │   │   │   ├── ChatHeader.jsx
│   │   │   │   │   ├── ChatMessages.jsx
│   │   │   │   │   ├── ChatInput.jsx
│   │   │   │   │   └── index.js
│   │   │   │   ├── CannedMessages/
│   │   │   │   │   ├── CannedMessages.jsx
│   │   │   │   │   └── index.js
│   │   │   │   ├── TransferModal/
│   │   │   │   │   ├── TransferModal.jsx
│   │   │   │   │   └── index.js
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── department/
│   │   │   │   ├── DepartmentList/
│   │   │   │   ├── DepartmentForm/
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── role/
│   │   │   │   ├── RoleList/
│   │   │   │   ├── RoleForm/
│   │   │   │   ├── PermissionSelector/
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   ├── ProfileInfo/
│   │   │   │   ├── ProfileForm/
│   │   │   │   ├── ImageUpload/
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── auth/
│   │   │       ├── LoginForm/
│   │   │       └── index.js
│   │   │
│   │   └── index.js                 # Export all components
│   │
│   ├── config/                      # ✨ NEW - Configuration files
│   │   ├── constants.js             # App constants
│   │   ├── routes.js                # Route paths
│   │   └── theme.js                 # Theme configuration
│   │
│   ├── context/                     # React Context providers
│   │   ├── AuthContext.jsx          # ✨ NEW - Auth context
│   │   ├── ChatContext.jsx          # ✨ NEW - Chat context
│   │   ├── UserContext.jsx          # Existing
│   │   └── index.js
│   │
│   ├── hooks/                       # ✨ NEW - Custom React hooks
│   │   ├── useAuth.js               # Authentication hook
│   │   ├── useChat.js               # Chat functionality hook
│   │   ├── useChatGroups.js         # Chat groups hook
│   │   ├── useMessages.js           # Messages hook
│   │   ├── useSocket.js             # Socket.io hook
│   │   ├── useDepartments.js        # Departments hook
│   │   ├── useRoles.js              # Roles hook
│   │   ├── useProfile.js            # Profile hook
│   │   ├── useForm.js               # Form handling hook
│   │   ├── useModal.js              # Modal state hook
│   │   ├── useDebounce.js           # Debounce hook
│   │   ├── useLocalStorage.js       # Local storage hook
│   │   └── index.js
│   │
│   ├── pages/                       # ✨ RENAMED from screens - Page components
│   │   ├── Auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── index.js
│   │   ├── Chat/
│   │   │   ├── ChatPage.jsx         # Main chat page (simplified)
│   │   │   └── index.js
│   │   ├── Dashboard/
│   │   │   ├── DashboardPage.jsx
│   │   │   └── index.js
│   │   ├── Department/
│   │   │   ├── DepartmentPage.jsx
│   │   │   └── index.js
│   │   ├── Role/
│   │   │   ├── RolePage.jsx
│   │   │   └── index.js
│   │   ├── Profile/
│   │   │   ├── ProfilePage.jsx
│   │   │   └── index.js
│   │   ├── Queue/
│   │   │   ├── QueuePage.jsx
│   │   │   └── index.js
│   │   ├── Admin/
│   │   │   ├── ManageAdminPage.jsx
│   │   │   ├── ManageAgentsPage.jsx
│   │   │   └── index.js
│   │   ├── Macro/
│   │   │   ├── MacrosAgentsPage.jsx
│   │   │   ├── MacrosClientsPage.jsx
│   │   │   └── index.js
│   │   └── index.js
│   │
│   ├── routes/                      # ✨ NEW - Route configuration
│   │   ├── AppRoutes.jsx            # Main route configuration
│   │   ├── PrivateRoute.jsx         # Protected route wrapper
│   │   ├── PublicRoute.jsx          # Public route wrapper
│   │   └── index.js
│   │
│   ├── store/                       # ✨ NEW - State management (optional)
│   │   ├── slices/                  # Redux slices or Zustand stores
│   │   │   ├── authSlice.js
│   │   │   ├── chatSlice.js
│   │   │   └── index.js
│   │   └── index.js
│   │
│   ├── styles/                      # ✨ NEW - Global styles
│   │   ├── globals.css              # Global CSS
│   │   ├── variables.css            # CSS variables
│   │   └── tailwind.css             # Tailwind imports
│   │
│   ├── types/                       # ✨ NEW - TypeScript types (if using TS)
│   │   ├── api.types.ts
│   │   ├── chat.types.ts
│   │   └── index.ts
│   │
│   ├── utils/                       # ✨ NEW - Utility functions
│   │   ├── formatters/              # Formatting utilities
│   │   │   ├── date.js
│   │   │   ├── currency.js
│   │   │   └── index.js
│   │   ├── validators/              # Validation utilities
│   │   │   ├── email.js
│   │   │   ├── phone.js
│   │   │   └── index.js
│   │   ├── helpers/                 # Helper functions
│   │   │   ├── storage.js
│   │   │   ├── array.js
│   │   │   └── index.js
│   │   └── index.js
│   │
│   ├── App.jsx                      # Main App component
│   ├── main.jsx                     # Entry point
│   └── socket.js                    # Socket.io configuration
│
├── .env                             # Environment variables
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎨 Component Structure Example

### Before (Current - Bad):
```jsx
// screens/Chats.jsx - 988 lines of hell
export default function Chats() {
  // 30+ useState hooks
  // Multiple useEffect hooks
  // API calls
  // Socket logic
  // Business logic
  // UI rendering
  // Event handlers
  // Everything mixed together!
}
```

### After (Recommended - Good):
```jsx
// pages/Chat/ChatPage.jsx - Clean and focused
import { MainLayout } from '@/components/layout';
import { ChatList, ChatWindow } from '@/components/features/chat';
import { useChat, useChatGroups } from '@/hooks';

export default function ChatPage() {
  const { 
    selectedChat, 
    selectChat 
  } = useChat();
  
  const { 
    chatGroups, 
    loading 
  } = useChatGroups();

  return (
    <MainLayout>
      <div className="flex h-full">
        <ChatList 
          chatGroups={chatGroups}
          selectedChat={selectedChat}
          onSelectChat={selectChat}
          loading={loading}
        />
        <ChatWindow 
          chat={selectedChat}
        />
      </div>
    </MainLayout>
  );
}
```

## 🔧 Key Improvements

### 1. API Layer Separation
```javascript
// api/services/chat.service.js
import { apiClient } from '../client';

export const chatService = {
  getChatGroups: () => apiClient.get('/chat/chatgroups'),
  
  getMessages: (clientId, params) => 
    apiClient.get(`/chat/${clientId}`, { params }),
  
  getCannedMessages: () => 
    apiClient.get('/chat/canned-messages'),
  
  sendMessage: (message) => 
    apiClient.post('/chat/messages', message),
};
```

### 2. Custom Hooks for Logic
```javascript
// hooks/useChat.js
import { useState, useEffect } from 'react';
import { chatService } from '@/api/services';
import { useSocket } from './useSocket';

export function useChat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    if (!selectedChat) return;
    
    loadMessages(selectedChat.id);
    socket.emit('joinChatGroup', selectedChat.chat_group_id);
    
    return () => {
      socket.off('receiveMessage');
    };
  }, [selectedChat]);

  const loadMessages = async (clientId) => {
    setLoading(true);
    try {
      const { data } = await chatService.getMessages(clientId);
      setMessages(data.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content) => {
    // Send message logic
  };

  return {
    selectedChat,
    messages,
    loading,
    selectChat: setSelectedChat,
    sendMessage,
  };
}
```

### 3. Feature-Based Components
```javascript
// components/features/chat/ChatWindow/ChatWindow.jsx
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { useMessages } from '@/hooks';

export function ChatWindow({ chat }) {
  const { messages, sendMessage, loading } = useMessages(chat?.id);

  if (!chat) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader chat={chat} />
      <ChatMessages messages={messages} loading={loading} />
      <ChatInput onSend={sendMessage} />
    </div>
  );
}
```

### 4. Reusable Common Components
```javascript
// components/common/Modal/Modal.jsx
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

// Usage
<Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Confirm">
  <p>Are you sure?</p>
  <Button onClick={handleConfirm}>Yes</Button>
</Modal>
```

## 📋 Migration Strategy

### Phase 1: Setup New Structure (Week 1)
1. Create new folder structure
2. Move existing files to appropriate locations
3. Set up API services layer
4. Create basic custom hooks

### Phase 2: Refactor Components (Week 2-3)
1. Extract common components (Button, Input, Modal, etc.)
2. Break down large screens into smaller components
3. Move business logic to custom hooks
4. Implement feature-based components

### Phase 3: Optimize & Test (Week 4)
1. Add unit tests for hooks and components
2. Optimize performance
3. Add error boundaries
4. Document components

## 🎯 Benefits

### Maintainability
- ✅ Easy to find and fix bugs
- ✅ Clear separation of concerns
- ✅ Consistent patterns

### Reusability
- ✅ Components can be reused across pages
- ✅ Hooks can be shared
- ✅ API services centralized

### Testability
- ✅ Components are isolated
- ✅ Hooks can be tested independently
- ✅ API calls are mocked easily

### Scalability
- ✅ Easy to add new features
- ✅ Team can work in parallel
- ✅ Code is organized by feature

### Developer Experience
- ✅ Faster development
- ✅ Less cognitive load
- ✅ Better code navigation

## 📝 Naming Conventions

### Files
- Components: `PascalCase.jsx` (e.g., `ChatWindow.jsx`)
- Hooks: `camelCase.js` (e.g., `useChat.js`)
- Services: `camelCase.service.js` (e.g., `chat.service.js`)
- Utils: `camelCase.js` (e.g., `formatDate.js`)
- Constants: `UPPER_SNAKE_CASE.js` (e.g., `API_ENDPOINTS.js`)

### Folders
- `kebab-case` or `PascalCase` for component folders
- `camelCase` for utility folders

### Imports
```javascript
// Use absolute imports with @ alias
import { Button } from '@/components/common';
import { useChat } from '@/hooks';
import { chatService } from '@/api/services';
```

## 🚀 Quick Start

1. **Create the new structure**
2. **Move one screen at a time** (start with simplest)
3. **Extract common components first**
4. **Create custom hooks for logic**
5. **Move API calls to services**
6. **Test thoroughly**

## 📚 Additional Resources

- React Best Practices
- Component Design Patterns
- Custom Hooks Guide
- API Layer Architecture
- Testing Strategies

---

**Status**: Ready for Implementation
**Estimated Time**: 3-4 weeks
**Impact**: High - Significantly improves codebase quality
