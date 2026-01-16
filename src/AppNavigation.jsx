import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import api from "../src/api";

import Login from "../screens/Login.jsx";
import Queues from "../screens/Queues.jsx";
import Chats from "../screens/Chats.jsx";
import Department from "../screens/Department.jsx";
import Profile from "../screens/Profile.jsx";
import ManageAgents from "../screens/ManageAgents.jsx";
import ChangeRole from "../screens/ChangeRoles.jsx";
import AutoReplies from "../screens/AutoReplies.jsx";
import Agents from "../screens/MacrosAgents.jsx";
import Clients from "../screens/MacrosClients.jsx";
import ManageAdmin from "../screens/ManageAdmin.jsx";
import Roles from "../screens/Roles.jsx";
import MacrosAgents from "../screens/MacrosAgents.jsx";
import MacrosClients from "../screens/MacrosClients.jsx";
import Dashboard from "../screens/Dashboard.jsx";

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
 * PublicRoute: Redirect authenticated users away from Login to /Queues
 */
function PublicRoute({ children }) {
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


function AppNavigation() {
  return (
    <Router>
      <Routes>
        {/* Public: Login, redirect if authed */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />


        {/* Protected */}
        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Queues"
          element={
            <ProtectedRoute>
              <Queues />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <Chats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/department"
          element={
            <ProtectedRoute>
              <Department />
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
              <ManageAgents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-role"
          element={
            <ProtectedRoute>
              <ChangeRole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auto-replies"
          element={
            <ProtectedRoute>
              <AutoReplies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agents"
          element={
            <ProtectedRoute>
              <Agents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/macros-agents"
          element={
            <ProtectedRoute>
              <MacrosAgents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/macros-clients"
          element={
            <ProtectedRoute>
              <MacrosClients />
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
              <Roles />
            </ProtectedRoute>
          }
        />

       
        <Route path="/queues" element={<Navigate to="/queues" replace />} />
      </Routes>
    </Router>
  );
}

export default AppNavigation;
