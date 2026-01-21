# Web Servana - Frontend Architecture

## Overview

This document describes the architecture of the `web_servana` frontend application. The application follows a layered architecture with clear separation of concerns between services, business logic, and presentation.

## Architecture Layers

```
┌─────────────────────────────────────────┐
│         Views (Presentation)            │
│  - Screen components                    │
│  - UI rendering                         │
│  - User interactions                    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Custom Hooks (Business Logic)      │
│  - State management                     │
│  - Side effects                         │
│  - Data transformation                  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       Services (API Communication)      │
│  - HTTP requests                        │
│  - WebSocket connections                │
│  - Error handling                       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│          Backend API                    │
│  - Express/Node.js                      │
│  - Supabase Database                    │
│  - Socket.IO                            │
└─────────────────────────────────────────┘
```

## Directory Structure

```
web_servana/
├── src/
│   ├── services/           # API communication layer
│   │   ├── auth.service.js
│   │   ├── profile.service.js
│   │   ├── dashboard.service.js
│   │   ├── chat.service.js
│   │   ├── department.service.js
│   │   ├── agent.service.js
│   │   ├── role.service.js
│   │   └── socket.service.js
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useProfile.js
│   │   ├── useDashboard.js
│   │   ├── useChat.js
│   │   ├── useDepartments.js
│   │   ├── useAgents.js
│   │   └── useRoles.js
│   │
│   ├── views/              # Screen components
│   │   ├── login/
│   │   │   └── LoginScreen.jsx
│   │   ├── dashboard/
│   │   │   └── DashboardScreen.jsx
│   │   ├── chats/
│   │   │   └── ChatsScreen.jsx
│   │   ├── queues/
│   │   │   └── QueuesScreen.jsx
│   │   ├── departments/
│   │   │   └── DepartmentScreen.jsx
│   │   ├── agents/
│   │   │   └── ManageAgentsScreen.jsx
│   │   ├── roles/
│   │   │   ├── RolesScreen.jsx
│   │   │   └── ChangeRolesScreen.jsx
│   │   ├── auto-replies/
│   │   │   └── AutoRepliesScreen.jsx
│   │   └── macros/
│   │       ├── MacrosAgentsScreen.jsx
│   │       └── MacrosClientsScreen.jsx
│   │
│   ├── components/         # Reusable UI components
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Modal.jsx
│   │   ├── Sidebar/
│   │   │   └── Sidebar.jsx
│   │   └── ...
│   │
│   ├── context/            # React Context providers
│   │   ├── UserContext.jsx
│   │   └── SocketContext.jsx
│   │
│   ├── utils/              # Utility functions
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── helpers.js
│   │
│   ├── constants/          # App constants
│   │   ├── routes.js
│   │   ├── api.js
│   │   └── config.js
│   │
│   ├── api.js              # Base HTTP client (Axios)
│   ├── App.jsx             # Root component
│   └── AppNavigation.jsx   # Route configuration
│
├── screens/                # Legacy (being migrated)
├── components/             # Legacy components
└── context/                # Legacy context
```

## Layer Responsibilities

### 1. Services Layer (`src/services/`)

**Purpose**: Handle all communication with the backend API.

**Responsibilities**:
- Make HTTP requests using the base API client
- Format request payloads
- Parse response data
- Throw errors with consistent structure
- Log requests for debugging

**Example**:
```javascript
// src/services/auth.service.js
import api from '../api';

export class AuthService {
  static async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  }

  static async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  }
}
```

**Rules**:
- Services are static classes with static methods
- Services never manage state
- Services throw errors, don't handle them
- Services return raw data from the backend

### 2. Custom Hooks Layer (`src/hooks/`)

**Purpose**: Encapsulate business logic and state management.

**Responsibilities**:
- Call service methods
- Manage loading, error, and data states
- Handle side effects (useEffect)
- Provide action functions to components
- Display toast notifications
- Handle navigation

**Example**:
```javascript
// src/hooks/useAuth.js
import { useState, useCallback } from 'react';
import { AuthService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthService.login(email, password);
      toast.success('Login successful');
      navigate('/dashboard');
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return { login, loading, error };
};
```

**Rules**:
- Hooks always return an object with consistent structure
- Hooks always include `loading` and `error` states
- Hooks use `useCallback` for action functions
- Hooks handle errors and display user feedback
- Hooks are named with `use` prefix

### 3. Views Layer (`src/views/`)

**Purpose**: Render UI and handle user interactions.

**Responsibilities**:
- Use custom hooks for data and actions
- Render UI based on state
- Handle user input
- Compose smaller components
- Minimal business logic

**Example**:
```javascript
// src/views/login/LoginScreen.jsx
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <div className="error">{error}</div>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          disabled={loading}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
```

**Rules**:
- Views are functional components
- Views use hooks for all business logic
- Views focus on presentation
- Views handle user interactions
- Views are organized by feature in subdirectories

## Data Flow

### Request Flow (User Action → Backend)
```
User Interaction
    ↓
View Component
    ↓
Custom Hook (useAuth, useProfile, etc.)
    ↓
Service (AuthService, ProfileService, etc.)
    ↓
API Client (axios)
    ↓
Backend API
```

### Response Flow (Backend → UI Update)
```
Backend API
    ↓
API Client (axios)
    ↓
Service (returns data or throws error)
    ↓
Custom Hook (updates state, shows toast)
    ↓
View Component (re-renders with new data)
    ↓
User sees updated UI
```

## Real-Time Communication (Socket.IO)

### Socket Service
```javascript
// src/services/socket.service.js
import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(url) {
    if (!this.socket) {
      this.socket = io(url, {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });
    }
    return this.socket;
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export default new SocketService();
```

### Using Socket in Hooks
```javascript
// src/hooks/useChat.js
import { useEffect } from 'react';
import socketService from '../services/socket.service';

export const useChat = () => {
  useEffect(() => {
    socketService.on('receiveMessage', (message) => {
      // Handle incoming message
    });

    return () => {
      socketService.off('receiveMessage');
    };
  }, []);

  const sendMessage = (message) => {
    socketService.emit('sendMessage', message);
  };

  return { sendMessage };
};
```

## Error Handling

### Service Layer
- Services throw errors with original backend error messages
- Services don't catch errors (let hooks handle them)

### Hook Layer
- Hooks catch errors from services
- Hooks set error state
- Hooks display toast notifications
- Hooks log errors for debugging

### View Layer
- Views display error states from hooks
- Views provide retry mechanisms
- Views gracefully degrade when data unavailable

## State Management

### Local State (useState)
- Use for component-specific state
- Form inputs, UI toggles, etc.

### Custom Hooks
- Use for feature-specific state
- Data fetching, CRUD operations

### Context (React Context)
- Use for global state
- User authentication, theme, etc.

## Adding New Features

### 1. Create Service
```javascript
// src/services/example.service.js
import api from '../api';

export class ExampleService {
  static async getItems() {
    const response = await api.get('/example');
    return response.data;
  }

  static async createItem(data) {
    const response = await api.post('/example', data);
    return response.data;
  }
}
```

### 2. Create Hook
```javascript
// src/hooks/useExample.js
import { useState, useCallback } from 'react';
import { ExampleService } from '../services/example.service';
import { toast } from 'react-toastify';

export const useExample = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ExampleService.getItems();
      setItems(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch items';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ExampleService.createItem(data);
      toast.success('Item created successfully');
      await fetchItems(); // Refresh list
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create item';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchItems]);

  return { items, loading, error, fetchItems, createItem };
};
```

### 3. Create View
```javascript
// src/views/example/ExampleScreen.jsx
import { useEffect } from 'react';
import { useExample } from '../../hooks/useExample';

export default function ExampleScreen() {
  const { items, loading, error, fetchItems, createItem } = useExample();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Example Screen</h1>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### 4. Add Route
```javascript
// src/AppNavigation.jsx
import ExampleScreen from './views/example/ExampleScreen';

// Add to routes
<Route path="/example" element={<ExampleScreen />} />
```

## Best Practices

1. **Keep Views Simple**: Views should focus on rendering and user interactions
2. **Extract Logic to Hooks**: Business logic belongs in custom hooks
3. **Services are Stateless**: Services never manage state
4. **Consistent Error Handling**: Always use try/catch in hooks
5. **Toast Notifications**: Show user feedback for all actions
6. **Loading States**: Always show loading indicators
7. **Error States**: Always display error messages
8. **Memoization**: Use useCallback for functions, useMemo for expensive computations
9. **Cleanup**: Always cleanup side effects in useEffect
10. **TypeScript**: Consider adding TypeScript for better type safety

## Migration Status

This architecture is being implemented incrementally. Current status:

- [x] Directory structure created
- [x] Base services implemented (AuthService, ProfileService, SocketService, DashboardService, ChatService)
- [x] Base hooks implemented (useAuth, useProfile, useDashboard, useChat)
- [x] Views migrated:
  - [x] LoginScreen
  - [x] DashboardScreen
  - [x] ChatsScreen (with real-time Socket.IO)
- [ ] Legacy code removed (kept as backup until full verification)

See `.kiro/specs/frontend-architecture-refactor/tasks.md` for detailed migration plan.
