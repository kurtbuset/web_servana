import { useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * useQueuesHandlers - Event handlers for QueuesScreen
 * Handles UI interactions and user actions
 */
export const useQueuesHandlers = ({
  canMessage,
  isMobile,
  textareaRef,
  setInputMessage,
  setView,
  selectCustomer,
  acceptChat,
  sendMessageAction,
}) => {
  const handleInputChange = useCallback((e) => {
    setInputMessage(e.target.value);
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [setInputMessage, textareaRef]);

  const sendMessage = useCallback(() => {
    if (!canMessage) return;
    
    const trimmedMessage = textareaRef.current.value.replace(/\n+$/, "");
    if (!trimmedMessage.trim()) return;

    sendMessageAction(trimmedMessage);
    setInputMessage("");
  }, [canMessage, sendMessageAction, setInputMessage, textareaRef]);

  const handleChatClick = useCallback(async (customer) => {
    await selectCustomer(customer);
    if (isMobile) setView("conversation");
  }, [selectCustomer, isMobile, setView]);

  const handleAcceptChat = useCallback(async () => {
    const success = await acceptChat();
    if (success) {
      toast.success("Chat accepted! You can now communicate with the client.");
    } else {
      toast.error("Failed to accept chat. Please try again.");
    }
  }, [acceptChat]);

  const handleBackClick = useCallback(() => {
    setView("chatList");
  }, [setView]);

  return {
    handleInputChange,
    sendMessage,
    handleChatClick,
    handleAcceptChat,
    handleBackClick,
  };
};
