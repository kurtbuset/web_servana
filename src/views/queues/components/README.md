# Queue Components

This directory contains the refactored components for the QueuesScreen.

## Component Structure

```
QueuesScreen (Main Screen)
├── Styles (Scoped CSS)
└── QueueContainer (Main Logic Container)
    ├── QueueModals (All Modal Dialogs)
    │   ├── ConfirmDialog (End Chat)
    │   ├── TransferModal
    │   └── ConfirmDialog (Transfer Confirm)
    │
    ├── QueueSidebar (Customer Queue List)
    │   ├── QueueSidebarHeader
    │   ├── DepartmentFilter
    │   ├── CustomerList
    │   └── QueueSidebarEmpty
    │
    └── QueueMainArea (Conversation Area)
        ├── ChatHeader (with Accept Button)
        ├── ChatMessages
        ├── MessageInput (with Preview Banner)
        └── QueueMainEmpty
```

## Components

### QueueContainer
Main container that manages all state and business logic. Delegates rendering to child components.

**Responsibilities:**
- State management (modals, dropdowns, mobile view)
- Business logic (accept, transfer, end chat, send message)
- Event handlers
- Effects (resize, scroll, click outside, auto-scroll, textarea resize)

### QueueModals
Renders all modal dialogs used in the queue interface.

**Props:**
- Modal visibility states
- Confirmation handlers
- Department data

### QueueSidebar
Left sidebar showing the customer queue with department filtering.

**Props:**
- Customer queue data
- Department filter state
- Selection handlers

### QueueSidebarHeader
Header section of the sidebar showing waiting customer count.

### QueueSidebarEmpty
Empty state component for the sidebar (loading or empty queue).

### QueueMainArea
Main conversation area showing messages and input with accept functionality.

**Props:**
- Selected customer
- Messages
- Input handlers
- Permission flags
- Accept handler

### QueueMainEmpty
Empty state when no customer is selected from queue.

## Key Differences from ChatsScreen

1. **Accept Button**: Queue has an "Accept Chat" button for unaccepted customers
2. **Preview Banner**: Shows preview mode when chat is not yet accepted
3. **No Canned Messages**: Queue doesn't support canned messages
4. **Queue Icon**: Uses clock icon instead of chat bubble
5. **Different Empty States**: Queue-specific messaging

## Usage

```jsx
import QueuesScreen from './views/queues/QueuesScreen';

// In your router
<Route path="/queues" element={<QueuesScreen />} />
```

## Features Maintained

- Real-time queue updates via Socket.IO
- Department filtering
- Accept chat functionality
- Message pagination (load more)
- End chat functionality
- Transfer department
- Mobile responsive with queue list/conversation views
- Permission-based UI
- Preview mode for unaccepted chats

## Notes

- All existing functionality is preserved
- No behavior changes, only structural refactoring
- Components are more maintainable and testable
- Easier to adjust individual pieces without affecting others
- Shares some components with ChatsScreen (ChatHeader, ChatMessages, MessageInput)
