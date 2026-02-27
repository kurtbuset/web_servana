import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../api";
import { PanelHeader } from "./PanelHeader";
import { UserListWithSections } from "./UserListWithSections";
import { MiniProfileModal } from "./MiniProfileModal";
import { PanelStyles } from "./PanelStyles";

// Cache for department data
let departmentDataCache = [];
let lastFetchTime = 0;
const CACHE_DURATION = 60000;

/**
 * DepartmentUsersPanel - Discord-style right sidebar showing department team members
 */
const DepartmentUsersPanel = React.memo(({ isOpen = false, onClose, isDropdown = false }) => {
  const { userData, getUserStatus, userStatuses } = useUser();
  const { isDark } = useTheme();
  const [departmentsData, setDepartmentsData] = useState(departmentDataCache);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDeptIndex, setCurrentDeptIndex] = useState(0);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [previousUserId, setPreviousUserId] = useState(null);
  
  const userStatusesArray = React.useMemo(() => {
    return Array.from(userStatuses.entries());
  }, [userStatuses]);

  const departments = userData?.departments || [];
  const currentDepartment = departmentsData[currentDeptIndex];
  
  const getOnlineMembersCount = (members) => {
    if (!members) return 0;
    
    return members.filter(member => {
      const status = getUserStatus(member.sys_user_id);
      const socketStatus = status.status;
      const lastSeenDate = status.lastSeen;
      
      if (socketStatus) {
        return socketStatus === 'online';
      } else if (lastSeenDate) {
        const diffMs = Date.now() - new Date(lastSeenDate).getTime();
        return diffMs < 45000;
      }
      return false;
    }).length;
  };
  
  const currentDeptWithOnlineCount = currentDepartment ? {
    ...currentDepartment,
    onlineMembers: getOnlineMembersCount(currentDepartment.members)
  } : null;

  React.useEffect(() => {
    if (currentDepartment && userStatuses.size > 0) {
      forceUpdate();
    }
  }, [userStatuses, currentDepartment]);

  useEffect(() => {
    if (!isOpen) return;
    
    const now = Date.now();
    const shouldFetch = departments.length > 0 && 
                       (departmentsData.length === 0 || now - lastFetchTime > CACHE_DURATION);
    
    if (shouldFetch) {
      fetchAllDepartmentsUsers();
    }
  }, [isOpen, userData, departments.length]);

  const fetchAllDepartmentsUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const promises = departments.map(dept => 
        api.get(`/departments/${dept.dept_id}/view-members`, { withCredentials: true })
          .then(res => ({
            ...dept,
            members: res.data.members || [],
            totalMembers: (res.data.members || []).length,
            onlineMembers: 0
          }))
          .catch(err => {
            console.error(`❌ Error fetching members for ${dept.dept_name}:`, err);
            return {
              ...dept,
              members: [],
              totalMembers: 0,
              onlineMembers: 0,
              error: true
            };
          })
      );

      const results = await Promise.all(promises);
      setDepartmentsData(results);
      departmentDataCache = results;
      lastFetchTime = Date.now();
    } catch (err) {
      console.error('❌ Error fetching department users:', err);
      setError('Failed to load department users');
    } finally {
      setLoading(false);
    }
  };

  const handleNextDepartment = () => {
    setCurrentDeptIndex((prev) => (prev + 1) % departmentsData.length);
  };

  const handlePrevDepartment = () => {
    setCurrentDeptIndex((prev) => (prev - 1 + departmentsData.length) % departmentsData.length);
  };

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[65] transition-opacity duration-300"
          onClick={() => {
            if (onClose) onClose();
          }}
        />
      )}
      
      <div
        className={`
          lg:relative lg:flex-shrink-0
          fixed lg:static top-14 sm:top-16 lg:top-0 right-0 
          h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] lg:h-full
          shadow-lg border-l overflow-hidden flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen ? 'lg:w-60' : 'lg:w-0'}
          ${isOpen ? 'translate-x-0 w-60 sm:w-72 z-[70]' : 'translate-x-full lg:translate-x-0 w-0 z-[70]'}
        `}
        style={{ 
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)'
        }}
      >
        <PanelHeader
          isDark={isDark}
          loading={loading}
          currentDepartment={currentDeptWithOnlineCount}
          departmentsData={departmentsData}
          currentDeptIndex={currentDeptIndex}
          onClose={() => {
            if (onClose) onClose();
          }}
          onPrevDepartment={handlePrevDepartment}
          onNextDepartment={handleNextDepartment}
          onDepartmentSelect={setCurrentDeptIndex}
        />

        <div className="flex-1 p-3 space-y-3 overflow-y-auto department-panel-scrollbar" style={{ 
          backgroundColor: 'var(--bg-secondary)'
        }}>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center space-y-2">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-[#6237A0]" style={{ borderColor: 'var(--border-color)', borderTopColor: '#6237A0' }}></div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <svg className="w-8 h-8 mx-auto mb-2" style={{ color: isDark ? '#6b7280' : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{error}</p>
            </div>
          ) : !currentDepartment ? (
            <div className="text-center py-8">
              <svg className="w-8 h-8 mx-auto mb-2" style={{ color: isDark ? '#6b7280' : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>No departments</p>
            </div>
          ) : currentDepartment.members.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-8 h-8 mx-auto mb-2" style={{ color: isDark ? '#6b7280' : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No members</p>
            </div>
          ) : (
            <UserListWithSections 
              members={currentDepartment.members} 
              isDark={isDark} 
              onUserClick={(user) => {
                setPreviousUserId(selectedUser?.sys_user_id || null);
                setSelectedUser(user);
              }} 
            />
          )}
        </div>
        
        <PanelStyles isDark={isDark} />
      </div>
      
      {selectedUser && (
        <MiniProfileModal 
          user={selectedUser} 
          isDark={isDark} 
          onClose={() => {
            setSelectedUser(null);
            setPreviousUserId(null);
          }}
          skipAnimation={previousUserId === selectedUser.sys_user_id}
        />
      )}
    </>
  );
});

DepartmentUsersPanel.displayName = 'DepartmentUsersPanel';

export default DepartmentUsersPanel;
