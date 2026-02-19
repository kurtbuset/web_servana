import { useState, useEffect, useRef } from 'react';
import { ChatService } from '../../services/chat.service';
import { useUser } from '../../context/UserContext';
import { handleError } from '../../utils/errorHandler';
import { PERMISSIONS } from '../../constants/permissions';

/**
 * useCannedMessages - Manage canned messages
 * Handles fetching and displaying pre-defined message templates
 */
export const useCannedMessages = () => {
  const [cannedMessages, setCannedMessages] = useState([]);
  const [showCannedMessages, setShowCannedMessages] = useState(false);
  const { hasPermission } = useUser();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch once when component mounts
    if (hasFetchedRef.current) return;

    const fetchCannedMessages = async () => {
      if (!hasPermission(PERMISSIONS.USE_CANNED_MESS)) {
        setCannedMessages([]);
        return;
      }

      try {
        const data = await ChatService.getCannedMessages();
        if (Array.isArray(data)) {
          setCannedMessages(data.map((msg) => msg.canned_message));
        }
      } catch (err) {
        handleError(err, 'Failed to load canned messages', { 
          context: 'useCannedMessages.fetchCannedMessages',
          showToast: false, // Don't show toast for canned messages error
        });
      }
    };

    fetchCannedMessages();
    hasFetchedRef.current = true;
  }, []); // Empty dependency array - only run once on mount

  return {
    cannedMessages,
    showCannedMessages,
    setShowCannedMessages,
  };
};
