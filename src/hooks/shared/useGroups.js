import { useState, useCallback, useEffect, useRef } from 'react';
import socket from '../../socket';
import { CHAT_CONFIG, SOCKET_EVENTS, CUSTOMER_LIST_UPDATE_TYPES } from '../../constants/chat.constants';
import { handleError } from '../../utils/errorHandler';

/**
 * Shared hook for managing chat/queue groups and departments
 * Used by both useChatGroups and useQueueGroups
 * 
 * @param {Object} config - Configuration object
 * @param {Function} config.fetchService - Service function to fetch groups
 * @param {string} config.socketUpdateEvent - Socket event name for updates
 * @param {boolean} config.debounceUpdates - Whether to debounce socket updates
 * @returns {Object} Groups state and methods
 */
export const useGroups = ({ 
  fetchService, 
  socketUpdateEvent = SOCKET_EVENTS.UPDATE_CHAT_GROUPS,
  debounceUpdates = false,
}) => {
  const [departmentCustomers, setDepartmentCustomers] = useState({});
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(CHAT_CONFIG.DEFAULT_DEPARTMENT);
  const [loading, setLoading] = useState(false);
  
  const fetchInProgressRef = useRef(false);
  const lastFetchTimeRef = useRef(0);

  /**
   * Fetch chat/queue groups from API
   */
  const fetchGroups = useCallback(async () => {
    // Prevent duplicate fetches
    if (fetchInProgressRef.current) return;

    const now = Date.now();
    if (now - lastFetchTimeRef.current < CHAT_CONFIG.FETCH_COOLDOWN_MS) return;

    fetchInProgressRef.current = true;
    lastFetchTimeRef.current = now;
    setLoading(true);
    
    try {
      const groups = await fetchService();
      const deptMap = {};

      groups.forEach((group) => {
        const dept = group.department;
        if (!deptMap[dept]) deptMap[dept] = [];
        deptMap[dept].push({ ...group.customer, department: dept });
      });

      setDepartmentCustomers(deptMap);
      setDepartments([CHAT_CONFIG.DEFAULT_DEPARTMENT, ...Object.keys(deptMap)]);
    } catch (err) {
      handleError(err, 'Failed to load groups', { context: 'useGroups.fetchGroups' });
    } finally {
      setLoading(false);
      fetchInProgressRef.current = false;
    }
  }, [fetchService]);

  /**
   * Handle customer list update from socket
   */
  const handleCustomerListUpdate = useCallback((updateData) => {
    if (updateData.type !== CUSTOMER_LIST_UPDATE_TYPES.MOVE_TO_TOP) return;
    
    const { customer } = updateData.data;
    
    setDepartmentCustomers((prevDeptCustomers) => {
      const updatedDeptCustomers = { ...prevDeptCustomers };
      
      // Remove customer from all departments
      Object.keys(updatedDeptCustomers).forEach((dept) => {
        updatedDeptCustomers[dept] = updatedDeptCustomers[dept].filter(
          (existingCustomer) => existingCustomer.chat_group_id !== customer.chat_group_id
        );
      });
      
      // Add to top of correct department
      const departmentName = customer.department || 'Unknown';
      if (!updatedDeptCustomers[departmentName]) {
        updatedDeptCustomers[departmentName] = [];
      }
      updatedDeptCustomers[departmentName].unshift(customer);
      
      return updatedDeptCustomers;
    });
  }, []);

  // Initial fetch
  useEffect(() => {
    if (!socket.connected) socket.connect();
    fetchGroups();
  }, [fetchGroups]);

  // Socket event listeners
  useEffect(() => {
    let updateTimeout = null;
    
    const handleUpdateGroups = () => {
      if (debounceUpdates) {
        // Debounce updates to prevent excessive fetching
        if (updateTimeout) clearTimeout(updateTimeout);
        updateTimeout = setTimeout(fetchGroups, CHAT_CONFIG.DEBOUNCE_UPDATE_MS);
      } else {
        fetchGroups();
      }
    };

    socket.on(socketUpdateEvent, handleUpdateGroups);
    socket.on(SOCKET_EVENTS.CUSTOMER_LIST_UPDATE, handleCustomerListUpdate);

    return () => {
      if (updateTimeout) clearTimeout(updateTimeout);
      socket.off(socketUpdateEvent, handleUpdateGroups);
      socket.off(SOCKET_EVENTS.CUSTOMER_LIST_UPDATE, handleCustomerListUpdate);
    };
  }, [fetchGroups, handleCustomerListUpdate, socketUpdateEvent, debounceUpdates]);

  // Computed values
  const filteredCustomers = selectedDepartment === CHAT_CONFIG.DEFAULT_DEPARTMENT
    ? Object.values(departmentCustomers).flat()
    : departmentCustomers[selectedDepartment] || [];

  return {
    departmentCustomers,
    setDepartmentCustomers,
    departments,
    setDepartments,
    selectedDepartment,
    setSelectedDepartment,
    filteredCustomers,
    loading,
  };
};
