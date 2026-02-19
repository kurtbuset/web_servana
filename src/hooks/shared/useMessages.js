import { useState, useCallback, useRef } from 'react';
import { CHAT_CONFIG } from '../../constants/chat.constants';
import { transformMessages, deduplicateMessages } from '../../utils/messageTransformers';
import { handleError } from '../../utils/errorHandler';

/**
 * Shared hook for message loading and pagination
 * Used by both useChatMessages and useQueueMessages
 * 
 * @param {Object} config - Configuration object
 * @param {Function} config.fetchService - Service function to fetch messages
 * @returns {Object} Messages state and methods
 */
export const useMessages = ({ fetchService }) => {
  const [messages, setMessages] = useState([]);
  const [earliestMessageTime, setEarliestMessageTime] = useState(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMessagesInProgressRef = useRef(false);

  /**
   * Load messages from API
   * @param {string} clientId - Client/customer ID
   * @param {string} before - Timestamp to load messages before (for pagination)
   * @param {boolean} append - Whether to append to existing messages or replace
   */
  const loadMessages = useCallback(async (clientId, before = null, append = false) => {
    // Prevent duplicate loads
    if (!append && loadMessagesInProgressRef.current) return;

    loadMessagesInProgressRef.current = true;
    if (append) setIsLoadingMore(true);
    
    try {
      const response = await fetchService(clientId, before, CHAT_CONFIG.MESSAGES_PER_PAGE);
      const newMessages = transformMessages(response.messages);

      // Deduplicate and merge messages
      setMessages((prev) => {
        const combined = append ? [...newMessages, ...prev] : newMessages;
        return deduplicateMessages(combined);
      });

      // Update pagination state
      if (newMessages.length > 0) {
        setEarliestMessageTime(newMessages[0].timestamp);
      }
      if (newMessages.length < CHAT_CONFIG.MESSAGES_PER_PAGE) {
        setHasMoreMessages(false);
      }
    } catch (err) {
      handleError(err, 'Failed to load messages', { context: 'useMessages.loadMessages' });
    } finally {
      if (append) setIsLoadingMore(false);
      loadMessagesInProgressRef.current = false;
    }
  }, [fetchService]);

  /**
   * Reset messages state
   */
  const resetMessages = useCallback(() => {
    setMessages([]);
    setEarliestMessageTime(null);
    setHasMoreMessages(true);
  }, []);

  return {
    messages,
    setMessages,
    earliestMessageTime,
    setEarliestMessageTime,
    hasMoreMessages,
    setHasMoreMessages,
    isLoadingMore,
    loadMessages,
    resetMessages,
  };
};
