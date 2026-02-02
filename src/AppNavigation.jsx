import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import api from "../src/api";
import { useUser } from "./context/UserContext";
import { useTheme } from "./context/ThemeContext";
import LoadingSpinner from "./components/LoadingSpinner";

// Critical path - load immediately
import LoginScreen from "./views/login/LoginScreen.jsx";

// Lazy load all other screens
const DashboardScreen = lazy(() => import("./views/dashboard/DashboardScreen.jsx"));
const ChatsScreen = lazy(() => import("./views/chats/ChatsScreen.jsx"));
const DepartmentScreen = lazy(() => import("./views/departments/DepartmentScreen.jsx"));
const ManageAgentsScreen = lazy(() => import("./views/agents/ManageAgentsScreen.jsx"));
const RolesScreen = lazy(() => import("./views/roles/RolesScreen.jsx"));
const ChangeRolesScreen = lazy(() => import("./views/change-roles/ChangeRolesScreen.jsx"));
const QueuesScreen = lazy(() => import("./views/queues/QueuesScreen.jsx"));
const AutoRepliesScreen = lazy(() => import("./views/auto-replies/AutoRepliesScreen.jsx"));
const MacrosAgentsScreen = lazy(() => import("./views/macros/MacrosAgentsScreen.jsx"));
const MacrosClientsScreen = lazy(() => import("./views/macros/MacrosClientsScreen.jsx"));
const Profile = lazy(() => import("./views/profile/Profile.jsx"));
const ManageAdmin = lazy(() => import("./views/manage-admin/ManageAdmin.jsx"));
const AnalyticsScreen = lazy(() => import("./views/analytics/AnalyticsScreen.jsx"));

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";


/**
 * PermissionRoute: Redirect to Dashboard if user doesn't have required permission
 */
function PermissionRoute({ children, permission }) {
  const { hasPermission, loading } = useUser();

  if (loading) {
    return <LoadingSpinner variant="page" message="Checking permissions..." />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/Dashboard" replace />;
  }

  return children;
}

/**
 * ProtectedRoute: Redirect to login if not authenticated
 */
function ProtectedRoute({ children }) {
  const [state, setState] = React.useState({ loading: true, authed: false });

  React.useEffect(() => {
    let isMounted = true;

    const checkAuth = () => {
      api
        .get("/auth/me")
        .then(() => {
          if (isMounted) setState({ loading: false, authed: true });
        })
        .catch(() => {
          if (isMounted) setState({ loading: false, authed: false });
        });
    };

    checkAuth();

    const handleStorage = (event) => {
      if (event.key === "logout") {
        setState({ loading: false, authed: false });
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      isMounted = false;
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  if (state.loading) {
    return <LoadingSpinner variant="page" message="Authenticating..." />;
  }

  if (!state.authed) {
    return <Navigate to="/" replace />;
  }

  return children;
}

/**
 * PublicRoute: Redirect authenticated users away from Login to /Dashboard
 */
function PublicRoute({ children }) {
  const [state, setState] = React.useState({ loading: true, authed: false });

  React.useEffect(() => {
    let isMounted = true;

    const checkAuth = () => {
      api
        .get("/auth/me")
        .then(() => {
          if (isMounted) {
            setState({ loading: false, authed: true });
          }
        })
        .catch(() => {
          if (isMounted) setState({ loading: false, authed: false });
        });
    };

    checkAuth();

    const handleStorage = (event) => {
      if (event.key === "logout") {
        checkAuth(); // recheck auth on logout event
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      isMounted = false;
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  if (state.loading) {
    return <LoadingSpinner variant="page" message="Loading application..." />;
  }

  if (state.authed) {
    return <Navigate to="/Dashboard" replace />;
  }

  return children;
}



function AppNavigation() {
  const { isDark } = useTheme();

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner variant="page" message="Loading..." />}>
        <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? "dark" : "light"}
        style={{
          fontSize: '14px'
        }}
        toastStyle={{
          backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
          color: isDark ? '#f5f5f5' : '#1a1a1a',
          border: `1px solid ${isDark ? '#4a4a4a' : '#e5e7eb'}`,
          boxShadow: isDark 
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)' 
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      />
      <Routes>
        {/* Public: Login, redirect if authed */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginScreen />
            </PublicRoute>
          }
        />


        {/* Protected */}
        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <DashboardScreen />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Queues"
          element={
            <ProtectedRoute>
              <PermissionRoute permission="priv_can_view_message">
                <QueuesScreen />
              </PermissionRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Chats"
          element={
            <ProtectedRoute>
              <PermissionRoute permission="priv_can_view_message">
                <ChatsScreen />
              </PermissionRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/department"
          element={
            <ProtectedRoute>
              <PermissionRoute permission="priv_can_manage_dept">
                <DepartmentScreen />
              </PermissionRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-agents"
          element={
            <ProtectedRoute>
              <PermissionRoute permission="priv_can_create_account">
                <ManageAgentsScreen />
              </PermissionRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-role"
          element={
            <ProtectedRoute>
              <PermissionRoute permission="priv_can_assign_role">
                <ChangeRolesScreen />
              </PermissionRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/auto-replies"
          element={
            <ProtectedRoute>
              <PermissionRoute permission="priv_can_manage_auto_reply">
                <AutoRepliesScreen />
              </PermissionRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agents"
          element={
            <ProtectedRoute>
              <PermissionRoute permission="priv_can_use_canned_mess">
                <MacrosAgentsScreen />
              </PermissionRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <PermissionRoute permission="priv_can_use_canned_mess">
                <MacrosClientsScreen />
              </PermissionRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/macros-agents"
          element={
            <ProtectedRoute>
              <PermissionRoute permission="priv_can_use_canned_mess">
                <MacrosAgentsScreen />
              </PermissionRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/macros-clients"
          element={
            <ProtectedRoute>
              <PermissionRoute permission="priv_can_use_canned_mess">
                <MacrosClientsScreen />
              </PermissionRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-admin"
          element={
            <ProtectedRoute>
              <PermissionRoute permission="priv_can_create_account">
                <ManageAdmin />
              </PermissionRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <ProtectedRoute>
              <PermissionRoute permission="priv_can_manage_role">
                <RolesScreen />
              </PermissionRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsScreen />
            </ProtectedRoute>
          }
        />

       
        <Route path="/queues" element={<Navigate to="/queues" replace />} />

        <Route path="/chats" element={<Navigate to="/chats" replace />} />
        
        {/* Fallback route - redirect unknown routes to Dashboard */}
        <Route path="*" element={<Navigate to="/Dashboard" replace />} />
      </Routes>
      </Suspense>
    </Router>
  );
}

export default AppNavigation;
