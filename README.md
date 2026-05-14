# Servana Web - Real-Time Customer Support Platform

Servana Web is a modern, real-time customer support and messaging platform built with React 19 and Vite. It provides agents with a comprehensive interface to manage customer conversations, handle support queues, and collaborate with team members across departments.

**Key Highlights:**

- ⚡ Built with React 19 and Vite for blazing-fast performance
- 🚀 Zustand for efficient state management
- 🔄 Real-time communication via Socket.IO
- 🎨 Modern UI with Tailwind CSS v4
- 🔐 JWT-based authentication with automatic token refresh
- 📱 Fully responsive and mobile-friendly

## Features

### Real-Time Messaging

- **Live Chat Interface** - Real-time bidirectional communication using Socket.IO
- **Message History** - Paginated message loading with date separators
- **Typing Indicators** - See when customers are typing
- **Read Receipts** - Track message delivery and read status

### Queue Management

- **Smart Queue System** - Automatically route customers to appropriate departments
- **Department Filtering** - View and manage queues by department
- **Priority Handling** - Accept and assign chats from the queue
- **Real-time Updates** - Live queue count updates via WebSocket

### Agent Tools

- **Canned Messages** - Quick responses for common inquiries
- **Macros** - Automated message templates for agents and clients
- **Auto-Replies** - Set up automatic responses for common scenarios
- **Chat Transfer** - Transfer conversations between departments
- **End Chat** - Close resolved conversations

### Administration

- **User Management** - Create and manage agent accounts
- **Role-Based Access Control** - Granular permissions system
- **Department Management** - Configure departments and assignments
- **Agent Assignment** - Assign agents to specific departments

### Dashboard & Analytics

- **Real-time Metrics** - Active chats, pending queue, response times
- **Performance Tracking** - Monitor agent activity and efficiency
- **Department Statistics** - View metrics by department

## Tech Stack

### Core

- **Frontend Framework**: React 19.0.0 - Latest React with concurrent features
- **Build Tool**: Vite 6.2.0 - Fast build tool and HMR
- **State Management**: Zustand 5.0.13 - Lightweight, performant state management
- **Routing**: React Router DOM 7.5.0 - Client-side routing with protected routes
- **HTTP Client**: Axios 1.9.0 - HTTP client with interceptors and auto token refresh

### Real-Time & Communication

- **WebSocket**: Socket.IO Client 4.8.1 - Bidirectional real-time communication
- **Notifications**: React Toastify 11.0.5 - Toast notifications

### UI & Styling

- **CSS Framework**: Tailwind CSS 4.1.3 - Utility-first CSS with dark mode support
- **Icons**: React Feather 2.0.10, React Icons 5.5.0, Lucide React 0.577.0
- **Animations**: Framer Motion 12.9.2 - Smooth animations and transitions
- **Charts**: Chart.js 4.5.1, ApexCharts 5.6.0 - Data visualization

### Developer Experience

- **DevTools**: Redux DevTools integration (via Zustand)
- **Linting**: ESLint 9.21.0
- **Type Safety**: PropTypes validation

## Project Structure

```
web_servana/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── chat/           # Chat-specific components
│   │   │   ├── ChatContainer.jsx
│   │   │   ├── ChatMessages.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   └── TypingIndicator.jsx
│   │   ├── Sidebar/        # Navigation sidebar
│   │   ├── ui/             # UI component library
│   │   ├── TopNavbar.jsx   # Top navigation bar
│   │   ├── Layout.jsx      # Main layout wrapper
│   │   └── StoreInitializer.jsx  # Zustand store initialization
│   ├── views/              # Page-level components
│   │   ├── chats/          # Chat interface
│   │   ├── dashboard/      # Dashboard with analytics
│   │   ├── departments/    # Department management
│   │   ├── agents/         # Agent management
│   │   ├── roles/          # Role & permissions management
│   │   ├── macros/         # Macro management (agents & clients)
│   │   ├── auto-replies/   # Auto-reply configuration
│   │   ├── profile/        # User profile management
│   │   └── login/          # Authentication
│   ├── stores/             # Zustand state stores
│   │   ├── userStore.js    # User authentication & permissions
│   │   ├── themeStore.js   # Theme management (dark/light)
│   │   ├── presenceStore.js # Real-time user presence
│   │   ├── rolePreviewStore.js # Role preview functionality
│   │   └── unsavedChangesStore.js # Form state tracking
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.js      # Authentication logic
│   │   ├── useChat.js      # Chat state management
│   │   ├── useChatSocket.js # Socket.IO integration
│   │   ├── useTyping.js    # Typing indicators
│   │   ├── useUser.js      # User store wrapper
│   │   └── usePagination.js # Pagination logic
│   ├── services/           # API service layer
│   │   ├── auth.service.js
│   │   ├── profile.service.js
│   │   ├── chat.service.js
│   │   ├── department.service.js
│   │   └── role.service.js
│   ├── socket/             # Socket.IO configuration
│   │   ├── connection.js   # Socket instance
│   │   ├── chat.js         # Chat events
│   │   ├── presence.js     # Presence events
│   │   └── typing.js       # Typing events
│   ├── constants/          # App constants and routes
│   ├── utils/              # Utility functions
│   ├── styles/             # Global styles
│   ├── api.js              # Axios configuration
│   ├── App.jsx             # Root component
│   └── main.jsx            # Entry point
├── public/                 # Static assets
│   ├── images/
│   └── profile_picture/
├── docs/                   # Documentation
│   ├── 01-PROJECT-OVERVIEW.md
│   ├── 04-PROJECT-STRUCTURE.md
│   └── 16-REFACTORING-HISTORY.md
├── .env.example            # Environment variables template
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── eslint.config.js        # ESLint configuration
├── Dockerfile              # Production Docker image
├── Dockerfile.dev          # Development Docker image
├── nginx.conf              # Nginx configuration
├── REACT_FUNDAMENTALS_SERVANA.md  # React interview guide
├── ZUSTAND_MIGRATION.md    # Zustand migration guide
└── README.md               # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm (specified in package.json engines)
- Backend API server running (servana_backend)
- Modern browser with WebSocket support

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:
   Create a `.env` file in the root directory (see `.env.example`):

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be created in the `dist/` directory.

### Docker Deployment

**Development:**

```bash
docker build -f Dockerfile.dev -t servana-web-dev .
docker run -p 5173:5173 servana-web-dev
```

**Production:**

```bash
docker build -t servana-web .
docker run -p 80:80 servana-web
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Architecture & Implementation

### State Management with Zustand

The application uses **Zustand** for global state management, providing better performance than Context API:

**Key Stores:**

- **userStore** - Authentication, user data, and permissions
- **themeStore** - Dark/light mode with localStorage persistence
- **presenceStore** - Real-time user online/offline status
- **rolePreviewStore** - Role simulation for testing permissions
- **unsavedChangesStore** - Form dirty state tracking

**Benefits:**

- ✅ No provider nesting (eliminated 5-level provider hell)
- ✅ Selective re-renders (components only update when their state changes)
- ✅ Built-in Redux DevTools support
- ✅ Smaller bundle size (~1KB per store)
- ✅ Easier to test and maintain

### Real-Time Communication

Socket.IO powers all real-time features:

**Events:**

- `receiveMessage` - New chat messages
- `typing` / `stopTyping` - Typing indicators
- `presence:change` - User online/offline status
- `customerListUpdate` - Queue updates
- `chatTransferred` - Chat transfers between departments
- `messageStatusUpdate` - Read receipts
- `chat:resolved` - Chat completion

**Implementation:**

```javascript
// Custom hooks for Socket.IO
useChatSocket({ onMessageReceived, onTyping });
useTyping({ chatGroupId, userId });
```

### Authentication & Security

**JWT-based authentication:**

- Access token stored in memory (cleared on page refresh)
- Refresh token in HTTP-only cookie (secure, not accessible via JS)
- Automatic token refresh on 401 errors
- Seamless re-authentication on page reload

**Flow:**

```
Login → Access Token (memory) + Refresh Token (cookie)
  ↓
Token expires (401)
  ↓
Auto refresh → New Access Token
  ↓
Retry original request → Seamless UX
```

### Permission System

Role-based access control with 20+ granular permissions:

**Categories:**

- **Communication**: View chats, send messages, end chats, transfer
- **Profile**: Manage own profile
- **Departments**: View, add, edit, assign departments
- **Roles**: Manage roles and permissions
- **Accounts**: Create admin/agent accounts
- **Auto-Replies**: View, add, edit, delete auto-replies
- **Macros**: View, add, edit, delete macros
- **Manage Agents**: View, edit, analytics

**Usage:**

```javascript
const { permissions } = useUser();

{
  permissions.canMessage && <button onClick={sendMessage}>Send</button>;
}
```

### API Architecture

**Centralized Axios instance with interceptors:**

```javascript
// Request interceptor - Add auth token
api.interceptors.request.use(async (config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor - Auto token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token and retry request
    }
  },
);
```

**Service Layer Pattern:**

```javascript
// services/profile.service.js
export class ProfileService {
  static async getProfile() {
    const response = await api.get("/profile");
    return response.data;
  }
}
```

### Performance Optimizations

1. **Zustand Selectors** - Selective re-renders

   ```javascript
   const userData = useUserStore((state) => state.userData);
   ```

2. **Debouncing** - Typing indicators, search inputs

   ```javascript
   const debouncedTyping = debounce(() => emit("typing"), 300);
   ```

3. **Pagination** - Client-side data chunking

   ```javascript
   const paginatedData = data.slice(startIndex, endIndex);
   ```

4. **Lazy Loading** - Route-based code splitting

   ```javascript
   const Dashboard = lazy(() => import("./views/dashboard"));
   ```

5. **Memoization** - useCallback, useMemo for expensive operations

### Responsive Design

- **Mobile-first approach** with Tailwind CSS
- **Adaptive layouts** for desktop, tablet, and mobile
- **Touch-friendly** interface elements
- **Optimized** for various screen sizes (320px - 4K)
- **Dark mode** support with theme persistence

## Key Features Implementation

### Real-Time Communication

The application uses Socket.IO for real-time features:

- Agents join chat group rooms to receive messages
- New messages are broadcast to all participants
- Queue updates are pushed to all connected agents
- Chat group updates trigger UI refreshes

### Permission System

Role-based access control with granular permissions:

- `priv_can_view_message` - View and access chats
- `priv_can_message` - Send messages to customers
- `priv_can_create_account` - Create agent accounts
- `priv_can_manage_role` - Manage roles and permissions
- And more...

### Responsive Design

- Mobile-first approach with Tailwind CSS
- Adaptive layouts for desktop and mobile
- Touch-friendly interface elements
- Optimized for various screen sizes

## API Integration

The web application communicates with the backend API for:

**Authentication:**

- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user

**Profile:**

- `GET /profile` - Get user profile with permissions
- `PUT /profile` - Update user profile
- `POST /profile/image` - Upload profile image

**Chat:**

- `GET /chat-groups` - Get chat groups by department
- `GET /chat-groups/:id/messages` - Get chat messages
- `POST /messages` - Send message (also via Socket.IO)
- `PUT /chat-groups/:id/resolve` - Resolve chat

**Departments:**

- `GET /departments` - Get all departments
- `POST /departments` - Create department
- `PUT /departments/:id` - Update department

**Roles:**

- `GET /roles` - Get all roles
- `POST /roles` - Create role
- `PUT /roles/:id` - Update role permissions

**Real-Time:**

- WebSocket connection via Socket.IO
- Event-driven architecture for live updates

See the backend documentation for complete API reference.

## Key Architectural Decisions

### Why Zustand over Context API?

- **Performance**: Selective re-renders vs. entire subtree re-renders
- **Developer Experience**: No provider nesting, built-in DevTools
- **Bundle Size**: ~1KB per store vs. Context overhead
- **Maintainability**: Easier to test, cleaner code structure

### Why Service Layer Pattern?

- **Separation of Concerns**: API logic separate from components
- **Reusability**: Services can be used across multiple components
- **Testability**: Easy to mock and test API calls
- **Maintainability**: Centralized API logic

### Why Custom Hooks?

- **Reusability**: Share logic across components
- **Testability**: Test hooks in isolation
- **Readability**: Cleaner component code
- **Separation of Concerns**: Business logic separate from UI

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Requirements:**

- ES6+ support
- WebSocket support
- LocalStorage support

## Contributing

This is a private project. For questions or issues, contact the development team.

## License

Proprietary - All rights reserved

---

**Built with ❤️ using React, Zustand, and Socket.IO**
