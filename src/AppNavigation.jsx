import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import api from "../src/api";

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

// Legacy screens (not yet migrated)
import Profile from "../screens/Profile.jsx";
import ManageAdmin from "../screens/ManageAdmin.jsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";


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
              <QueuesScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <ChatsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/department"
          element={
            <ProtectedRoute>
              <DepartmentScreen />
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
              <ManageAgentsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-role"
          element={
            <ProtectedRoute>
              <ChangeRolesScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auto-replies"
          element={
            <ProtectedRoute>
              <AutoRepliesScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agents"
          element={
            <ProtectedRoute>
              <MacrosAgentsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <MacrosClientsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/macros-agents"
          element={
            <ProtectedRoute>
              <MacrosAgentsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/macros-clients"
          element={
            <ProtectedRoute>
              <MacrosClientsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-admin"
          element={
            <ProtectedRoute>
              <ManageAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <ProtectedRoute>
              <RolesScreen />
            </ProtectedRoute>
          }
        />

       
        <Route path="/queues" element={<Navigate to="/queues" replace />} />
      </Routes>
    </Router>
  );
}

export default AppNavigation;
