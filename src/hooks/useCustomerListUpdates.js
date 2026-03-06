import { useCallback } from 'react';

/**
 * useCustomerListUpdates hook manages customer list state updates
 * 
 * Features:
 * - Handle real-time customer list updates from socket events
 * - Move chats to top of list
 * - Add new queued chats
 * - Update chat status (queued to active)
 * - Remove chats from list
 * 
 * @param {Function} setDepartmentCustomers - State setter for department customers
 * @param {Function} setSelectedCustomer - State setter for selected customer
 * @param {Function} getUserId - Function to get current user ID
 * @returns {Object} Customer list update handlers
 */
export const useCustomerListUpdates = (
  setDepartmentCustomers,
  setSelectedCustomer,
  getUserId
) => {
  /**
   * Move chat to top of list or add new assignment
   */
  const handleMoveToTopOrNewAssignment = useCallback((customer, updateType) => {
    setDepartmentCustomers((prevDeptCustomers) => {
      const updatedDeptCustomers = { ...prevDeptCustomers };
      
      // Find the customer in all departments and remove them
      Object.keys(updatedDeptCustomers).forEach((dept) => {
        updatedDeptCustomers[dept] = updatedDeptCustomers[dept].filter(
          (existingCustomer) => existingCustomer.chat_group_id !== customer.chat_group_id
        );
      });
      
      // Find the department name for this customer
      const departmentName = customer.department || 'Unknown';
      
      // Add the customer to the top of their department
      if (!updatedDeptCustomers[departmentName]) {
        updatedDeptCustomers[departmentName] = [];
      }
      
      // Add customer to the beginning of the array (top of list)
      updatedDeptCustomers[departmentName].unshift(customer);
      
      // Log for new assignments
      if (updateType === 'new_assignment') {
        console.log(`✅ New chat assigned: ${customer.name} (${customer.chat_group_id})`);
      }
      
      return updatedDeptCustomers;
    });
  }, [setDepartmentCustomers]);

  /**
   * Add new queued chat to department list
   */
  const handleNewQueuedChat = useCallback((customer) => {
    setDepartmentCustomers((prevDeptCustomers) => {
      const updatedDeptCustomers = { ...prevDeptCustomers };
      
      // Find the department name for this customer
      const departmentName = customer.department || 'Unknown';
      
      // Add the department if it doesn't exist
      if (!updatedDeptCustomers[departmentName]) {
        updatedDeptCustomers[departmentName] = [];
      }
      
      // Check if chat already exists (avoid duplicates)
      const exists = updatedDeptCustomers[departmentName].some(
        (existingCustomer) => existingCustomer.chat_group_id === customer.chat_group_id
      );
      
      if (!exists) {
        // Add queued chat to the list
        updatedDeptCustomers[departmentName].push(customer);
        
        // Re-sort: active chats first, then queued chats
        updatedDeptCustomers[departmentName].sort((a, b) => {
          if (a.chat_type === 'active' && b.chat_type === 'queued') return -1;
          if (a.chat_type === 'queued' && b.chat_type === 'active') return 1;
          return 0;
        });
        
        console.log(`✅ New queued chat arrived: ${customer.name} (${customer.chat_group_id})`);
      }
      
      return updatedDeptCustomers;
    });
  }, [setDepartmentCustomers]);

  /**
   * Update chat from queued to active when accepted
   */
  const handleChatAccepted = useCallback((customer) => {
    setDepartmentCustomers((prevDeptCustomers) => {
      const updatedDeptCustomers = { ...prevDeptCustomers };
      
      // Find the customer in all departments and update from queued to active
      Object.keys(updatedDeptCustomers).forEach((dept) => {
        updatedDeptCustomers[dept] = updatedDeptCustomers[dept].map((existingCustomer) => {
          if (existingCustomer.chat_group_id === customer.chat_group_id) {
            return {
              ...existingCustomer,
              ...customer,
              chat_type: 'active',
              status: 'active'
            };
          }
          return existingCustomer;
        });
        
        // Re-sort: active chats first
        updatedDeptCustomers[dept].sort((a, b) => {
          if (a.chat_type === 'active' && b.chat_type === 'queued') return -1;
          if (a.chat_type === 'queued' && b.chat_type === 'active') return 1;
          return 0;
        });
      });
      
      console.log(`✅ Chat accepted and moved to active: ${customer.name} (${customer.chat_group_id})`);
      
      return updatedDeptCustomers;
    });
    
    // Update selected customer if it's the one we just accepted
    setSelectedCustomer((prev) => {
      if (prev && prev.chat_group_id === customer.chat_group_id) {
        return {
          ...prev,
          ...customer,
          chat_type: 'active',
          status: 'active'
        };
      }
      return prev;
    });
  }, [setDepartmentCustomers, setSelectedCustomer]);

  /**
   * Remove chat from list (when accepted by another agent)
   */
  const handleRemoveChatGroup = useCallback((chatGroupId, acceptedBy) => {
    const userId = getUserId();
    
    // Only remove from queue if another agent accepted it
    if (acceptedBy !== userId) {
      setDepartmentCustomers((prevDeptCustomers) => {
        const updatedDeptCustomers = { ...prevDeptCustomers };
        
        // Remove the chat from all departments
        Object.keys(updatedDeptCustomers).forEach((dept) => {
          updatedDeptCustomers[dept] = updatedDeptCustomers[dept].filter(
            (existingCustomer) => existingCustomer.chat_group_id !== chatGroupId
          );
        });
        
        console.log(`✅ Chat ${chatGroupId} removed from customer list (accepted by agent ${acceptedBy})`);
        
        return updatedDeptCustomers;
      });
    }
  }, [setDepartmentCustomers, getUserId]);

  /**
   * Handle chat transferred out (remove from old department)
   */
  const handleChatTransferredOut = useCallback((chatGroupId) => {
    setDepartmentCustomers((prevDeptCustomers) => {
      const updatedDeptCustomers = { ...prevDeptCustomers };
      
      // Remove the chat from all departments
      Object.keys(updatedDeptCustomers).forEach((dept) => {
        updatedDeptCustomers[dept] = updatedDeptCustomers[dept].filter(
          (existingCustomer) => existingCustomer.chat_group_id !== chatGroupId
        );
      });
      
      console.log(`✅ Chat ${chatGroupId} transferred out and removed from list`);
      
      return updatedDeptCustomers;
    });
  }, [setDepartmentCustomers]);

  /**
   * Handle chat transferred in (add to new department queue)
   */
  const handleChatTransferredIn = useCallback((customer) => {
    setDepartmentCustomers((prevDeptCustomers) => {
      const updatedDeptCustomers = { ...prevDeptCustomers };
      
      // Find the department name for this customer
      const departmentName = customer.department || 'Unknown';
      
      // Add the department if it doesn't exist
      if (!updatedDeptCustomers[departmentName]) {
        updatedDeptCustomers[departmentName] = [];
      }
      
      // Check if chat already exists (avoid duplicates)
      const exists = updatedDeptCustomers[departmentName].some(
        (existingCustomer) => existingCustomer.chat_group_id === customer.chat_group_id
      );
      
      if (!exists) {
        // Add transferred chat to the list
        updatedDeptCustomers[departmentName].push(customer);
        
        // Re-sort: active chats first, then queued chats
        updatedDeptCustomers[departmentName].sort((a, b) => {
          if (a.chat_type === 'active' && b.chat_type === 'queued') return -1;
          if (a.chat_type === 'queued' && b.chat_type === 'active') return 1;
          return 0;
        });
        
        console.log(`✅ Chat ${customer.chat_group_id} transferred in to department ${departmentName}`);
      }
      
      return updatedDeptCustomers;
    });
  }, [setDepartmentCustomers]);

  /**
   * Main handler for all customer list update types
   */
  const handleCustomerListUpdate = useCallback((updateData) => {
    console.log('updateData type: ', updateData.type);
    
    switch (updateData.type) {
      case 'move_to_top':
      case 'new_assignment':
        handleMoveToTopOrNewAssignment(updateData.data.customer, updateData.type);
        break;
      
      case 'new_queued_chat':
        handleNewQueuedChat(updateData.data.customer);
        break;
      
      case 'chat_accepted':
        handleChatAccepted(updateData.data.customer);
        break;
      
      case 'remove_chat_group':
        handleRemoveChatGroup(
          updateData.data.chat_group_id,
          updateData.data.accepted_by
        );
        break;
      
      case 'chat_transferred_out':
        handleChatTransferredOut(updateData.data.chat_group_id);
        break;
      
      case 'chat_transferred_in':
        handleChatTransferredIn(updateData.data.customer);
        break;
      
      default:
        console.warn(`Unknown customer list update type: ${updateData.type}`);
    }
  }, [
    handleMoveToTopOrNewAssignment,
    handleNewQueuedChat,
    handleChatAccepted,
    handleRemoveChatGroup,
    handleChatTransferredOut,
    handleChatTransferredIn,
  ]);

  return {
    handleCustomerListUpdate,
    handleMoveToTopOrNewAssignment,
    handleNewQueuedChat,
    handleChatAccepted,
    handleRemoveChatGroup,
    handleChatTransferredOut,
    handleChatTransferredIn,
  };
};
