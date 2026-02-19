import { useState, useCallback, useEffect } from 'react';
import { ChatService } from '../../services/chat.service';
import { useUser } from '../../context/UserContext';

/**
 * useCannedMessages - Manage canned messages
 * Handles fetching and displaying pre-defined message templates
 */
export const useCannedMessages = () => {
  const [cannedMessages, setCannedMessages] = useState([]);
  const [showCannedMessages, setShowCannedMessages] = useState(false);
  const { hasPermission } = useUser();

  const fetchCannedMessages = useCallback(async () => {
    if (!hasPermission("priv_can_use_canned_mess")) {
      setCannedMessages([]);
      return;
    }

    try {
      const data = await ChatService.getCannedMessages();
      if (Array.isArray(data)) {
        setCannedMessages(data.map((msg) => msg.canned_message));
      }
    } catch (err) {
      console.error('Failed to load canned messages:', err);
    }
  }, [hasPermission]);

  useEffect(() => {
    if (hasPermission("priv_can_use_canned_mess")) {
      fetchCannedMessages();
    } else {
      setCannedMessages([]);
    }
  }, [hasPermission, fetchCannedMessages]);

  return {
    cannedMessages,
    showCannedMessages,
    setShowCannedMessages,
  };
};
