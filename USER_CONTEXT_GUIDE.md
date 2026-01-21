# UserContext Guide - Global State Management

## 📚 Overview

The `UserContext` provides global state management for user data across the entire application. Once a user logs in, their data is automatically fetched and stored, making it accessible from any component.

## 🔧 How It Works

### 1. Context Setup

```javascript
// context/UserContext.jsx
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    // Fetches user data from /profile endpoint
    const res = await api.get("/profile");
    setUserData(res.data);
  };

  useEffect(() => {
    fetchUser(); // Auto-fetch on mount
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, loading, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
```

### 2. App Wrapper

```javascript
// src/App.jsx
import { UserProvider } from "../context/UserContext";

function App() {
  return (
    <UserProvider>
      <AppNavigation />
    </UserProvider>
  );
}
```

## 📦 Available Data

### User Data Structure

```javascript
{
  sys_user_id: 1,              // User ID
  sys_user_email: "user@example.com",
  role_id: 3,                  // Role ID (1=Admin, 2=Client, 3=Agent)
  profile: {
    prof_id: 1,
    prof_firstname: "John",
    prof_middlename: "M",
    prof_lastname: "Doe",
    prof_address: "123 Main St",
    prof_date_of_birth: "1990-01-01"
  },
  image: {
    img_id: 1,
    img_location: "https://...",
    img_is_current: true
  }
}
```

## 🎯 Usage Examples

### Example 1: Basic Usage in Dashboard

```javascript
// screens/Dashboard.jsx
import { useUser } from "../context/UserContext";

export default function Dashboard() {
  const { userData, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {userData?.profile?.prof_firstname}!</h1>
      <p>Email: {userData?.sys_user_email}</p>
      <p>Role ID: {userData?.role_id}</p>
    </div>
  );
}
```

### Example 2: Conditional Rendering Based on Role

```javascript
// components/AdminPanel.jsx
import { useUser } from "../context/UserContext";

export default function AdminPanel() {
  const { userData } = useUser();

  // Only show for Admin (role_id = 1)
  if (userData?.role_id !== 1) {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      {/* Admin-only content */}
    </div>
  );
}
```

### Example 3: Display User Profile Picture

```javascript
// components/UserAvatar.jsx
import { useUser } from "../context/UserContext";

export default function UserAvatar() {
  const { userData } = useUser();

  const avatarUrl = userData?.image?.img_location || "/default-avatar.png";

  return (
    <img 
      src={avatarUrl} 
      alt="User Avatar"
      className="w-10 h-10 rounded-full"
    />
  );
}
```

### Example 4: Show User Name in Navbar

```javascript
// components/TopNavbar.jsx
import { useUser } from "../context/UserContext";

export default function TopNavbar() {
  const { userData } = useUser();

  const fullName = userData?.profile 
    ? `${userData.profile.prof_firstname} ${userData.profile.prof_lastname}`
    : "Guest";

  return (
    <nav>
      <div>Welcome, {fullName}</div>
      <div>Role: {getRoleName(userData?.role_id)}</div>
    </nav>
  );
}
```

### Example 5: Refresh User Data After Update

```javascript
// screens/Profile.jsx
import { useUser } from "../context/UserContext";
import api from "../src/api";

export default function Profile() {
  const { userData, fetchUser } = useUser();

  const handleUpdateProfile = async (newData) => {
    try {
      await api.put("/profile", newData);
      // Refresh user data after update
      await fetchUser();
      alert("Profile updated!");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <form onSubmit={handleUpdateProfile}>
      {/* Form fields */}
    </form>
  );
}
```

### Example 6: Role-Based Navigation

```javascript
// components/Sidebar.jsx
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const { userData } = useUser();

  const isAdmin = userData?.role_id === 1;
  const isAgent = userData?.role_id === 3;

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/profile">Profile</Link>
      
      {isAgent && (
        <>
          <Link to="/chats">Chats</Link>
          <Link to="/queues">Queues</Link>
        </>
      )}
      
      {isAdmin && (
        <>
          <Link to="/manage-admin">Manage Admins</Link>
          <Link to="/manage-agents">Manage Agents</Link>
          <Link to="/roles">Roles</Link>
          <Link to="/departments">Departments</Link>
        </>
      )}
    </nav>
  );
}
```

### Example 7: Protected Route Component

```javascript
// components/ProtectedRoute.jsx
import { useUser } from "../context/UserContext";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children, requiredRole }) {
  const { userData, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userData.role_id !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

// Usage in routes
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole={1}>
      <AdminPage />
    </ProtectedRoute>
  } 
/>
```

### Example 8: Custom Hook for Role Checking

```javascript
// hooks/useRole.js
import { useUser } from "../context/UserContext";

export function useRole() {
  const { userData } = useUser();

  const isAdmin = userData?.role_id === 1;
  const isClient = userData?.role_id === 2;
  const isAgent = userData?.role_id === 3;

  const hasRole = (roleId) => userData?.role_id === roleId;

  const getRoleName = () => {
    const roles = {
      1: "Admin",
      2: "Client",
      3: "Agent",
    };
    return roles[userData?.role_id] || "Unknown";
  };

  return {
    isAdmin,
    isClient,
    isAgent,
    hasRole,
    getRoleName,
    roleId: userData?.role_id,
  };
}

// Usage
import { useRole } from "../hooks/useRole";

function MyComponent() {
  const { isAdmin, getRoleName } = useRole();

  return (
    <div>
      <p>You are: {getRoleName()}</p>
      {isAdmin && <AdminButton />}
    </div>
  );
}
```

## 🔄 Context Methods

### Available Methods

```javascript
const { 
  userData,      // Current user data object
  setUserData,   // Manually set user data
  loading,       // Loading state (true while fetching)
  fetchUser      // Refetch user data from API
} = useUser();
```

### When to Use Each Method

1. **`userData`** - Read user information
   ```javascript
   const email = userData?.sys_user_email;
   ```

2. **`setUserData`** - Manually update user data (rare)
   ```javascript
   setUserData({ ...userData, sys_user_email: "new@email.com" });
   ```

3. **`loading`** - Show loading states
   ```javascript
   if (loading) return <Spinner />;
   ```

4. **`fetchUser`** - Refresh user data after updates
   ```javascript
   await api.put("/profile", newData);
   await fetchUser(); // Refresh
   ```

## 🎨 Role ID Reference

```javascript
const ROLES = {
  ADMIN: 1,
  CLIENT: 2,
  AGENT: 3,
};

// Helper function
function getRoleName(roleId) {
  const roles = {
    1: "Admin",
    2: "Client",
    3: "Agent",
  };
  return roles[roleId] || "Unknown";
}
```

## ⚠️ Best Practices

### ✅ DO:
```javascript
// Always check if userData exists
if (userData?.role_id === 1) {
  // Do something
}

// Use optional chaining
const name = userData?.profile?.prof_firstname;

// Show loading state
if (loading) return <Spinner />;
```

### ❌ DON'T:
```javascript
// Don't access without checking
const name = userData.profile.prof_firstname; // ❌ Can crash

// Don't forget loading state
return <div>{userData.sys_user_email}</div>; // ❌ Shows nothing while loading
```

## 🔐 Security Notes

1. **User data is fetched on app load** - Automatic authentication check
2. **Data is stored in memory** - Lost on page refresh (refetched automatically)
3. **Protected by cookies** - Backend validates authentication
4. **Role-based access** - Check `role_id` for permissions

## 🚀 Quick Reference

```javascript
// Import
import { useUser } from "../context/UserContext";

// Use in component
const { userData, loading, fetchUser } = useUser();

// Access data
userData?.sys_user_id        // User ID
userData?.sys_user_email     // Email
userData?.role_id            // Role (1=Admin, 2=Client, 3=Agent)
userData?.profile            // Profile object
userData?.image              // Profile image

// Check loading
if (loading) return <Spinner />;

// Refresh data
await fetchUser();
```

## 📝 Example: Complete Component

```javascript
import { useUser } from "../context/UserContext";

export default function UserProfile() {
  const { userData, loading, fetchUser } = useUser();

  // Loading state
  if (loading) {
    return <div>Loading user data...</div>;
  }

  // No user data
  if (!userData) {
    return <div>Please log in</div>;
  }

  // Role check
  const isAdmin = userData.role_id === 1;

  return (
    <div>
      <h1>Profile</h1>
      
      {/* User Info */}
      <div>
        <p>ID: {userData.sys_user_id}</p>
        <p>Email: {userData.sys_user_email}</p>
        <p>Role: {userData.role_id}</p>
      </div>

      {/* Profile Info */}
      {userData.profile && (
        <div>
          <p>Name: {userData.profile.prof_firstname} {userData.profile.prof_lastname}</p>
          <p>Address: {userData.profile.prof_address}</p>
        </div>
      )}

      {/* Profile Image */}
      {userData.image && (
        <img src={userData.image.img_location} alt="Profile" />
      )}

      {/* Admin Only */}
      {isAdmin && (
        <button>Admin Settings</button>
      )}

      {/* Refresh Button */}
      <button onClick={fetchUser}>Refresh Data</button>
    </div>
  );
}
```

---

**Remember**: The UserContext is your single source of truth for user data! Use it everywhere you need user information. 🎯
