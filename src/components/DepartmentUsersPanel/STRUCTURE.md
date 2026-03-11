# Component Structure

## File Organization

```
components/
├── DepartmentUsersPanel.jsx          # Re-export file (backwards compatibility)
└── DepartmentUsersPanel/
    ├── index.jsx                     # Main component (state & logic)
    ├── PanelHeader.jsx               # Header section
    ├── UserListWithSections.jsx      # User list with sections
    ├── UserCard.jsx                  # Individual user card
    ├── MiniProfileModal.jsx          # Profile popup modal
    ├── PanelStyles.jsx               # Styles component
    ├── README.md                     # Documentation
    └── STRUCTURE.md                  # This file
```

## Component Hierarchy

```
DepartmentUsersPanel (index.jsx)
├── Overlay (mobile only)
├── Panel Container
│   ├── PanelHeader
│   │   ├── Close Button (mobile)
│   │   ├── Title & Department Name
│   │   ├── Stats (Members/Online)
│   │   └── Navigation Dots
│   ├── Content Area
│   │   ├── Loading State
│   │   ├── Error State
│   │   ├── Empty State
│   │   └── UserListWithSections
│   │       ├── Online Section
│   │       │   └── UserCard (multiple)
│   │       └── Offline Section
│   │           └── UserCard (multiple)
│   └── PanelStyles
└── MiniProfileModal (conditional)
    ├── Backdrop (mobile)
    └── Modal Content
        ├── Banner
        ├── Avatar
        ├── User Info
        ├── Departments
        └── Email
```

## Data Flow

```
index.jsx (Main Component)
    ↓ (fetches data)
API → departmentsData
    ↓ (passes props)
PanelHeader ← currentDepartment, stats, handlers
    ↓
UserListWithSections ← members, onUserClick
    ↓
UserCard ← user, onClick
    ↓ (on click)
MiniProfileModal ← selectedUser
```

## State Management

### index.jsx
- `departmentsData` - All department data with members
- `loading` - Loading state
- `error` - Error message
- `currentDeptIndex` - Current department index
- `selectedUser` - User for profile modal
- `previousUserId` - Track for animation skip

### UserCard.jsx
- `currentTime` - For "X mins ago" updates

### MiniProfileModal.jsx
- `position` - Modal position
- `isMobile` - Mobile detection

## Key Features by Component

### index.jsx
- API data fetching
- 1-minute caching
- Real-time online count calculation
- Department navigation
- User selection handling

### PanelHeader.jsx
- Department info display
- Statistics display
- Navigation controls
- Mobile close button

### UserListWithSections.jsx
- Online/Offline separation
- Alphabetical sorting
- Real-time status calculation

### UserCard.jsx
- Avatar with status indicator
- Name and last seen display
- 10-second refresh interval
- Hover effects

### MiniProfileModal.jsx
- Responsive positioning
- Click-outside to close
- Department badges
- Email display

### PanelStyles.jsx
- Custom scrollbar
- Animation keyframes
- Theme-reactive styles

## Benefits of This Structure

1. **Easy Navigation** - Each component in its own file
2. **Maintainability** - Clear separation of concerns
3. **Reusability** - Components can be used independently
4. **Testing** - Easier to test individual components
5. **Code Organization** - Logical grouping by feature
6. **Backwards Compatible** - Original import path still works
