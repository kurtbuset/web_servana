# Quick Wins - Immediate Improvements

## 🎯 Priority Actions (Can be done today!)

### 1. Create API Services Layer (30 minutes)

```javascript
// src/api/client.js
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

```javascript
// src/api/services/index.js
export { chatService } from './chat.service';
export { authService } from './auth.service';
export { departmentService } from './department.service';
export { profileService } from './profile.service';
```

**Impact**: Centralize all API calls, easier to maintain and test

---

### 2. Extract useSocket Hook (15 minutes)

```javascript
// src/hooks/useSocket.js
import { useEffect, useRef } from 'react';
import socket from '@/socket';

export function useSocket() {
  const socketRef = useRef(socket);

  useEffect(() => {
    socketRef.current.connect();
    return () => socketRef.current.disconnect();
  }, []);

  return socketRef.current;
}

// Usage in any component
import { useSocket } from '@/hooks';

function ChatComponent() {
  const socket = useSocket();
  // Use socket...
}
```

**Impact**: Reusable socket connection, no more duplicate code

---

### 3. Create Common Components (1 hour)

#### Button Component
```javascript
// src/components/common/Button/Button.jsx
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  ...props 
}) {
  const baseStyles = 'rounded-lg font-semibold transition';
  
  const variants = {
    primary: 'bg-[#6237A0] text-white hover:bg-[#552C8C]',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner className="mr-2" />}
      {children}
    </button>
  );
}

// Usage
<Button variant="primary" onClick={handleSave}>Save</Button>
<Button variant="danger" loading={isDeleting}>Delete</Button>
```

#### Modal Component
```javascript
// src/components/common/Modal/Modal.jsx
export function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {title}
          </h3>
        )}
        <div className="mb-6">{children}</div>
        {footer && <div className="flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

// Usage
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Confirm Action"
  footer={
    <>
      <Button variant="secondary" onClick={() => setShowModal(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleConfirm}>
        Confirm
      </Button>
    </>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

**Impact**: Consistent UI, less code duplication

---

### 4. Create MainLayout Component (20 minutes)

```javascript
// src/components/layout/MainLayout/MainLayout.jsx
import { useState } from 'react';
import { TopNavbar } from '../TopNavbar';
import { Sidebar } from '../Sidebar';

export function MainLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNavbar toggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar */}
        <Sidebar
          isMobile={true}
          isOpen={mobileSidebarOpen}
          toggleDropdown={setOpenDropdown}
          openDropdown={openDropdown}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/* Desktop Sidebar */}
        <Sidebar
          isMobile={false}
          toggleDropdown={setOpenDropdown}
          openDropdown={openDropdown}
        />

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// Usage in any page
export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <h1>Dashboard</h1>
        {/* Your content */}
      </div>
    </MainLayout>
  );
}
```

**Impact**: No more duplicate layout code in every screen

---

### 5. Create useForm Hook (30 minutes)

```javascript
// src/hooks/useForm.js
import { useState } from 'react';

export function useForm(initialValues, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await onSubmit(values);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    loading,
    handleChange,
    handleSubmit,
    reset,
    setValues,
    setErrors,
  };
}

// Usage
function LoginForm() {
  const { values, errors, loading, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    async (data) => {
      await authService.login(data);
      navigate('/dashboard');
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={values.email}
        onChange={(e) => handleChange('email', e.target.value)}
      />
      {errors.email && <span>{errors.email}</span>}
      
      <Button type="submit" loading={loading}>Login</Button>
    </form>
  );
}
```

**Impact**: Simplified form handling, less boilerplate

---

### 6. Add Path Aliases (5 minutes)

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@api': path.resolve(__dirname, './src/api'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
});
```

```javascript
// Before
import { Button } from '../../../components/common/Button';
import { useAuth } from '../../../hooks/useAuth';

// After
import { Button } from '@components/common/Button';
import { useAuth } from '@hooks/useAuth';
```

**Impact**: Cleaner imports, easier refactoring

---

### 7. Create Constants File (10 minutes)

```javascript
// src/config/constants.js
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  CHAT: {
    GROUPS: '/chat/chatgroups',
    MESSAGES: (clientId) => `/chat/${clientId}`,
    CANNED: '/chat/canned-messages',
  },
  DEPARTMENTS: '/departments',
  ROLES: '/roles',
};

export const SOCKET_EVENTS = {
  CONNECT: 'connection',
  DISCONNECT: 'disconnect',
  JOIN_CHAT: 'joinChatGroup',
  SEND_MESSAGE: 'sendMessage',
  RECEIVE_MESSAGE: 'receiveMessage',
  UPDATE_GROUPS: 'updateChatGroups',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CHATS: '/chats',
  QUEUES: '/queues',
  PROFILE: '/profile',
};

export const COLORS = {
  PRIMARY: '#6237A0',
  SECONDARY: '#E6DCF7',
  DANGER: '#EF4444',
  SUCCESS: '#10B981',
};
```

**Impact**: Single source of truth, easier to maintain

---

### 8. Add Error Boundary (15 minutes)

```javascript
// src/components/common/ErrorBoundary/ErrorBoundary.jsx
import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage in App.jsx
<ErrorBoundary>
  <AppNavigation />
</ErrorBoundary>
```

**Impact**: Better error handling, improved UX

---

## 📋 Implementation Checklist

### Day 1 (2-3 hours)
- [ ] Create API services layer
- [ ] Extract useSocket hook
- [ ] Add path aliases
- [ ] Create constants file

### Day 2 (2-3 hours)
- [ ] Create Button component
- [ ] Create Modal component
- [ ] Create Input component
- [ ] Create MainLayout component

### Day 3 (2-3 hours)
- [ ] Create useForm hook
- [ ] Add Error Boundary
- [ ] Refactor Login screen (simplest)
- [ ] Test everything

### Week 2
- [ ] Refactor Dashboard
- [ ] Refactor Profile
- [ ] Create more custom hooks

### Week 3-4
- [ ] Refactor Chats screen
- [ ] Refactor other complex screens
- [ ] Add tests

---

## 🎯 Expected Results

### Before Quick Wins:
- ❌ Duplicate code everywhere
- ❌ Hard to maintain
- ❌ Inconsistent patterns
- ❌ Poor error handling

### After Quick Wins:
- ✅ Centralized API calls
- ✅ Reusable components
- ✅ Custom hooks for logic
- ✅ Consistent patterns
- ✅ Better error handling
- ✅ Cleaner imports
- ✅ Easier to test

---

## 💡 Tips

1. **Start Small**: Don't try to refactor everything at once
2. **Test Often**: Test after each change
3. **Keep It Simple**: Don't over-engineer
4. **Document**: Add comments for complex logic
5. **Be Consistent**: Follow the same patterns
6. **Ask for Help**: Review with team members

---

**Remember**: Small improvements compound over time! 🚀
