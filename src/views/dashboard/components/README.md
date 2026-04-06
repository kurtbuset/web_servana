# Dashboard Components

This directory contains the new dashboard components based on the modern masonry grid layout design.

## Components

### ProfileStrip.jsx
- Displays user profile information at the top of the dashboard
- Shows user avatar, name, email, role, and department badges
- Uses user context to get current user data

### PendingQueuesCard.jsx
- Shows pending customer queues waiting for agent response
- Displays customer names, departments, and queue count
- Uses the queues hook to get real-time queue data

### MessageCountCard.jsx
- Displays message analytics with period-based data
- Shows total messages, trends, and response time statistics
- Includes a sparkline chart visualization
- Supports daily, weekly, monthly, and yearly periods

### RatingCard.jsx
- Shows user/agent ratings with star visualization
- Displays rating score out of 5 and total review count
- Uses analytics data for review statistics

### ChattingCard.jsx
- Shows currently active chat sessions
- Displays customer names and simulated chat messages
- Shows online status indicators for active chats

### CalendarCard.jsx
- Interactive calendar component with month navigation
- Highlights current date
- Shows upcoming events/appointments
- Fully functional calendar with proper date calculations

### QuickActionsCard.jsx
- Grid of quick action buttons for common tasks
- Includes New Chat, Add Agent, Schedule, and Reports actions
- Respects user permissions for action visibility
- Uses proper navigation routing

## Styles

### DashboardStyles.css
- Complete CSS implementation matching the HTML design
- Uses CSS custom properties for theming
- Includes hover effects, animations, and responsive design
- Masonry grid layout with proper card styling

## Layout Structure

The dashboard uses a masonry grid layout with the following areas:
- **queues**: Pending queues (spans 3 rows)
- **msgs**: Message count card
- **rating**: Rating card  
- **chat**: Active chatting card
- **calendar**: Calendar card (spans 2 rows)
- **actions**: Quick actions card

## Features

- **Real-time updates**: Socket integration for live data updates
- **Responsive design**: Adapts to different screen sizes
- **Smooth animations**: Fade-in animations with staggered delays
- **Interactive elements**: Hover effects and clickable actions
- **Modern styling**: Gradient backgrounds, rounded corners, shadows
- **Accessibility**: Proper color contrast and semantic HTML

## Usage

```jsx
import DashboardScreen from './views/dashboard/DashboardScreen';

// The dashboard automatically integrates with:
// - UserContext for user data
// - ThemeContext for dark/light mode
// - useQueues hook for queue data
// - useAnalytics hook for analytics data
// - Socket for real-time updates
```

## Dependencies

- React hooks (useState, useCallback, useEffect)
- Context providers (UserContext, ThemeContext)
- Custom hooks (useQueues, useAnalytics)
- Socket.io for real-time updates
- Google Fonts (Syne, DM Sans, DM Mono)

## Customization

The dashboard can be customized by:
1. Modifying CSS custom properties in DashboardStyles.css
2. Adjusting grid layout in the `.msnry` class
3. Adding new card components following the existing pattern
4. Updating color schemes in the CSS variables