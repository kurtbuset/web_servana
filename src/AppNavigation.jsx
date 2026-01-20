import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import api from "../src/api";
import { useUser } from "./context/UserContext";

// New refactored screens
import LoginScreen from "./views/login/LoginScreen.jsx";
import DashboardScreen from "./views/dashboard/DashboardScreen.jsx";
import ChatsScreen from "./views/chats/ChatsScreen.jsx";
import DepartmentScreen from "./views/departments/DepartmentScreen.jsx";
import ManageAgentsScreen from "./views/agents/ManageAgentsScreen.jsx";
import RolesScreen from "./views/roles/RolesScreen.jsx";
import ChangeRolesScreen from "./views/change-roles/ChangeRolesScreen.jsx";
import QueuesScreen from "./views/queues/QueuesScreen.jsx";
import AutoRepliesScreen from "./views/auto-replies/AutoRepliesScreen.jsx";
import MacrosAgentsScreen from "./views/macros/MacrosAgentsScreen.jsx";
import MacrosClientsScreen from "./views/macros/MacrosClientsScreen.jsx";
import Profile from "./views/profile/Profile.jsx";
import ManageAdmin from "./views/manage-admin/ManageAdmin.jsx"

// Legacy screens (not yet migrated)
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";


/**
 * PermissionRoute: Redirect to Dashboard if user doesn't have required permission
 */
function PermissionRoute({ children, permission }) {
  const { hasPermission, loading } = useUser();

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading…</div>;
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
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading…</div>;
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
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading…</div>;
  }

  if (state.authed) {
    return <Navigate to="/Dashboard" replace />;
  }

  return children;
}


function ToastHandler() {
  const location = useLocation();

  React.useEffect(() => {
    // Check if we should show login toast
    const showLoginToast = localStorage.getItem("showLoginToast");
    if (showLoginToast === "true") {
      localStorage.removeItem("showLoginToast");
      toast.success("Welcome back! You've successfully logged in.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [location]);

  return null;
}

function AppNavigation() {
  return (
    <Router>
      <ToastContainer />
      <ToastHandler />
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
          path="/chats"
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

       
        <Route path="/queues" element={<Navigate to="/queues" replace />} />
      </Routes>
    </Router>
  );
}

export default AppNavigation;
