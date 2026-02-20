import { useState, useEffect } from "react";
import api from "../../api";
import Layout from "../../components/Layout";
import ScreenContainer from "../../components/ScreenContainer";
import { useTheme } from "../../context/ThemeContext";
import AdminTable from "./components/AdminTable";
import AddEditAdminModal from "./components/AddEditAdminModal";
import ViewProfileModal from "./components/ViewProfileModal";
import "../../../src/App.css";
import "../../styles/GridLayout.css";
import "../../styles/Animations.css";

export default function ManageAdmin() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [modalError, setModalError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [viewProfileModal, setViewProfileModal] = useState(null);

  const { isDark } = useTheme();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = (value) => emailRegex.test(value.trim());

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/admins");
      const { admins, currentUserId } = data;
      setAgents(
        admins.map((a) => ({
          sys_user_id: a.sys_user_id,
          email: a.sys_user_email,
          password: a.sys_user_password,
          active: a.sys_user_is_active,
          profile_picture: a.profile_picture,
        }))
      );
      setCurrentUserId(currentUserId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const filteredAgents = agents.filter((agent) =>
    agent.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetModalFields = () => {
    setCurrentEditId(null);
    setEditEmail("");
    setEditPassword("");
    setEditActive(true);
    setShowPassword(false);
    setModalError(null);
  };

  const openAddModal = () => {
    resetModalFields();
    setIsModalOpen(true);
  };

  const openEditModal = (agent) => {
    setCurrentEditId(agent.sys_user_id);
    setEditEmail(agent.email);
    setEditPassword("");
    setEditActive(agent.active);
    setShowPassword(false);
    setModalError(null);
    setIsModalOpen(true);
  };

  const emailAlreadyExists = (email, ignoreId = null) => {
    const lower = email.trim().toLowerCase();
    return agents.some(
      (a) =>
        a.email.trim().toLowerCase() === lower && a.sys_user_id !== ignoreId
    );
  };

  const saveAdmin = async () => {
    setModalError(null);

    if (!editEmail || !editPassword) {
      setModalError("Email and password are required.");
      return;
    }

    if (!isValidEmail(editEmail)) {
      setModalError("Please enter a valid email address.");
      return;
    }

    if (emailAlreadyExists(editEmail, currentEditId)) {
      setModalError("Email is already taken.");
      return;
    }

    const updatedBy = 1;

    try {
      if (currentEditId !== null) {
        await api.put(`admins/${currentEditId}`, {
          sys_user_email: editEmail,
          ...(editPassword !== "" && { sys_user_password: editPassword }),
          sys_user_is_active: editActive,
          sys_user_updated_by: updatedBy,
        });
      } else {
        await api.post("/admins", {
          sys_user_email: editEmail,
          sys_user_password: editPassword,
          sys_user_is_active: true,
          sys_user_created_by: updatedBy,
        });
      }

      await fetchAdmins();
      setIsModalOpen(false);
      resetModalFields();
    } catch (err) {
      const serverMsg = err.response?.data?.message || "Failed to save admin";
      const lowerMsg = serverMsg.toLowerCase();

      if (
        lowerMsg.includes("duplicate") ||
        lowerMsg.includes("exists") ||
        lowerMsg.includes("taken") ||
        lowerMsg.includes("unique")
      ) {
        setModalError("Email is already taken.");
      } else if (lowerMsg.includes("email")) {
        setModalError(serverMsg);
      } else {
        setModalError(serverMsg);
      }
    }
  };

  const toggleActiveStatus = async (sys_user_id) => {
    const idx = agents.findIndex((a) => a.sys_user_id === sys_user_id);
    if (idx === -1) return;

    const admin = agents[idx];
    const updatedBy = 1;

    try {
      setAgents((prev) =>
        prev.map((a) =>
          a.sys_user_id === sys_user_id ? { ...a, active: !a.active } : a
        )
      );

      await api.put(`admins/${sys_user_id}/toggle`, {
        sys_user_is_active: !admin.active,
        sys_user_updated_by: updatedBy,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to toggle active status");
      setAgents((prev) =>
        prev.map((a) =>
          a.sys_user_id === sys_user_id ? { ...a, active: admin.active } : a
        )
      );
    }
  };

  return (
    <Layout>
      <ScreenContainer>
        <div className="p-3 sm:p-4 flex flex-col h-full overflow-hidden">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="relative">
              <h1 className="text-lg sm:text-xl font-bold relative inline-block" style={{ color: 'var(--text-primary)' }}>
                Manage Admins
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#6237A0] via-[#8B5CF6] to-transparent rounded-full"></div>
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={openAddModal}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap bg-[#6237A0] text-white hover:bg-[#552C8C]"
              >
                + Add Admin
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            <div className="rounded-lg shadow-sm h-full flex flex-col" style={{ backgroundColor: 'var(--card-bg)' }}>
              {/* Content Area */}
              <div className="flex-1 overflow-hidden p-2">
                <AdminTable
                  agents={filteredAgents}
                  currentUserId={currentUserId}
                  loading={loading}
                  error={error}
                  searchQuery={searchQuery}
                  isDark={isDark}
                  onViewProfile={(agent) => setViewProfileModal(agent)}
                  onEdit={(agent) => {
                    if (agent.sys_user_id !== currentUserId) {
                      openEditModal(agent);
                      setError(null);
                    }
                  }}
                  onToggleStatus={toggleActiveStatus}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddEditAdminModal
          isOpen={isModalOpen}
          isEdit={currentEditId !== null}
          email={editEmail}
          password={editPassword}
          showPassword={showPassword}
          error={modalError}
          isDark={isDark}
          onEmailChange={(value) => {
            setEditEmail(value);
            if (modalError) setModalError(null);
          }}
          onPasswordChange={(value) => {
            setEditPassword(value);
            if (modalError) setModalError(null);
          }}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onSave={saveAdmin}
          onClose={() => {
            setIsModalOpen(false);
            setModalError(null);
          }}
        />

        <ViewProfileModal
          user={viewProfileModal}
          onClose={() => setViewProfileModal(null)}
        />
      </ScreenContainer>
    </Layout>
  );
}
