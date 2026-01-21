# Servana Web - Customer Support Platform

Servana Web is a real-time customer support and messaging platform built with React and Vite. It provides agents with a comprehensive interface to manage customer conversations, handle support queues, and collaborate with team members across departments.

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

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: React Context API
- **Real-time Communication**: Socket.IO Client
- **Styling**: Tailwind CSS
- **Icons**: React Feather
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Notifications**: React Toastify

## Project Structure

```
servana_web/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── chat/         # Chat-specific components
│   │   ├── Sidebar/      # Navigation sidebar
│   │   └── TopNavbar.jsx # Top navigation bar
│   ├── views/            # Page components
│   │   ├── chats/        # Chat interface
│   │   ├── queues/       # Queue management
│   │   ├── dashboard/    # Dashboard view
│   │   ├── departments/  # Department management
│   │   ├── agents/       # Agent management
│   │   ├── roles/        # Role management
│   │   └── macros/       # Macro management
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service layer
│   ├── context/          # React Context providers
│   ├── constants/        # App constants and routes
│   ├── utils/            # Utility functions
│   └── socket.js         # Socket.IO configuration
├── public/               # Static assets
└── index.html           # Entry HTML file
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Backend API server running (servana_backend)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000
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
- `priv_can_manage_dept` - Manage departments
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
- Authentication and authorization
- Chat message CRUD operations
- Queue management
- User and department management
- Real-time WebSocket connections

See the backend documentation for API endpoints and data structures.

## Contributing

This is a private project. For questions or issues, contact the development team.

## License

Proprietary - All rights reserved
