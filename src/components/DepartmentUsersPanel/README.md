# DepartmentUsersPanel Component

Discord-style right sidebar showing department team members with real-time online status.

## Structure

```
DepartmentUsersPanel/
├── index.jsx                  # Main panel component with state management
├── PanelHeader.jsx           # Header with department info and navigation
├── UserListWithSections.jsx  # Online/Offline user sections
├── UserCard.jsx              # Individual user card
├── MiniProfileModal.jsx      # User profile popup modal
├── PanelStyles.jsx           # Scrollbar and animation styles
└── README.md                 # This file
```

## Components

### index.jsx (Main Component)
- Manages panel state (open/close, loading, errors)
- Fetches department data from API
- Handles department navigation
- Caches department data (1 minute)
- Tracks online member counts in real-time

### PanelHeader.jsx
- Displays current department name
- Shows member/online statistics
- Department navigation dots
- Close button for mobile

### UserListWithSections.jsx
- Separates users into ONLINE/OFFLINE sections
- Sorts users alphabetically within sections
- Calculates online status from socket data

### UserCard.jsx
- Displays user avatar with online indicator
- Shows user name and last seen time
- Updates every 10 seconds
- Clickable to open profile modal

### MiniProfileModal.jsx
- Discord-style profile popup
- Shows full user details
- Displays departments as badges
- Responsive positioning (centered on mobile, left of panel on desktop)

### PanelStyles.jsx
- Custom scrollbar styling
- Animation keyframes (fadeIn, scaleIn, slideInRight)
- Theme-reactive styles

## Usage

```jsx
import DepartmentUsersPanel from './components/DepartmentUsersPanel';

function MyComponent() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsPanelOpen(!isPanelOpen)}>
        Toggle Team Panel
      </button>
      
      <DepartmentUsersPanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
      />
    </>
  );
}
```

## Props

### DepartmentUsersPanel
- `isOpen` (boolean): Controls panel visibility
- `onClose` (function): Callback when panel should close
- `isDropdown` (boolean, optional): Dropdown mode flag

## Features

- Real-time online status tracking
- Department switching with navigation
- Responsive design (overlay on mobile, sidebar on desktop)
- User profile modal on click
- 1-minute data caching
- Discord-inspired UI/UX

## Dependencies

- `useUser` context for user data and status
- `useTheme` context for dark/light mode
- `api` for backend requests
- `formatLastSeen` utility
- `getProfilePictureUrl` utility
