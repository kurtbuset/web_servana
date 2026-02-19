import { useEffect } from 'react';
import { CHAT_CONFIG } from '../../constants/chat.constants';
import { handleError } from '../../utils/errorHandler';

/**
 * useQueuesEffects - Side effects for QueuesScreen
 * Handles scroll pagination, window resize, dropdown clicks, auto-scroll, and textarea auto-resize
 */
export const useQueuesEffects = ({
  dropdownRef,
  bottomRef,
  textareaRef,
  scrollContainerRef,
  setOpenDropdown,
  setIsMobile,
  messages,
  inputMessage,
  earliestMessageTime,
  hasMoreMessages,
  selectedCustomer,
  loadMessages,
  isLoadingMore,
}) => {
  // Scroll pagination - load more messages when scrolling to top
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let isThrottled = false;

    const handleScroll = async () => {
      if (isThrottled || isLoadingMore || !hasMoreMessages || !selectedCustomer) return;
      
      if (container.scrollTop <= CHAT_CONFIG.SCROLL_TOP_THRESHOLD) {
        isThrottled = true;
        const prevHeight = container.scrollHeight;
        const prevScrollTop = container.scrollTop;

        try {
          await loadMessages(selectedCustomer.id, earliestMessageTime, true);
          
          // Maintain scroll position after loading
          setTimeout(() => {
            if (container) {
              const heightDiff = container.scrollHeight - prevHeight;
              container.scrollTop = prevScrollTop + heightDiff;
            }
          }, CHAT_CONFIG.SCROLL_POSITION_DELAY_MS);
        } catch (error) {
          handleError(error, 'Error loading more messages', { context: 'useQueuesEffects.handleScroll' });
        }

        setTimeout(() => { isThrottled = false; }, CHAT_CONFIG.SCROLL_THROTTLE_MS);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [earliestMessageTime, hasMoreMessages, selectedCustomer, loadMessages, isLoadingMore, scrollContainerRef]);

  // Window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobile]);

  // Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef, setOpenDropdown]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, bottomRef]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage, textareaRef]);
};
