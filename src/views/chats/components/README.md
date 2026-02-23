# Chat Components

This directory contains the refactored components for the ChatsScreen.

## Component Structure

```
ChatsScreen (Main Screen)
├── ChatStyles (Scoped CSS)
└── ChatContainer (Main Logic Container)
    ├── ChatModals (All Modal Dialogs)
    │   ├── ConfirmDialog (End Chat)
    │   ├── TransferModal
    │   └── ConfirmDialog (Transfer Confirm)
    │
    ├── ChatSidebar (Customer List)
    │   ├── ChatSidebarHeader
    │   ├── DepartmentFilter
    │   ├── CustomerList
    │   └── ChatSidebarEmpty
    │
    ├── ChatMainArea (Conversation Area)
    │   ├── ChatHeader
    │   ├── ChatMessages
    │   ├── MessageInput
    │   └── ChatMainEmpty
    │
    └── ProfilePanel
```

## Components

### ChatContainer
Main container that manages all state and business logic. Delegates rendering to child components.

**Responsibilities:**
- State management (modals, dropdowns, mobile view)
- Business logic (transfer, end chat, send message)
- Event handlers
- Effects (resize, scroll, click outside)

### ChatModals
Renders all modal dialogs used in the chat interface.

**Props:**
- Modal visibility states
- Confirmation handlers
- Department data

### ChatSidebar
Left sidebar showing the customer list with department filtering.

**Props:**
- Customer list data
- Department filter state
- Selection handlers

### ChatSidebarHeader
Header section of the sidebar showing active chat count.

### ChatSidebarEmpty
Empty state component for the sidebar (loading or no chats).

### ChatMainArea
Main conversation area showing messages and input.

**Props:**
- Selected customer
- Messages
- Input handlers
- Permission flags

### ChatMainEmpty
Empty state when no chat is selected.

### ChatStyles
Scoped CSS styles for the chat interface (scrollbar, animations).

## Usage

```jsx
import ChatsScreen from './views/chats/ChatsScreen';

// In your router
<Route path="/chats" element={<ChatsScreen />} />
```

## Features Maintained

- Real-time messaging via Socket.IO
- Department filtering
- Canned messages
- Message pagination (load more)
- End chat functionality
- Transfer department
- Mobile responsive with chat list/conversation views
- Profile panel
- Typing indicators
- Permission-based UI

## Notes

- All existing functionality is preserved
- No behavior changes, only structural refactoring
- Components are more maintainable and testable
- Easier to adjust individual pieces without affecting others
