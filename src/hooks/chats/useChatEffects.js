import { useEffect } from 'react';
import { ChatService } from '../../services/chat.service';
import { CHAT_CONFIG } from '../../constants/chat.constants';
import { handleError } from '../../utils/errorHandler';

/**
 * useChatEffects - Side effects for ChatsScreen
 * Handles dropdown clicks, department fetching, window resize, scroll pagination,
 * auto-scroll, and textarea auto-resize
 */
export const useChatEffects = ({
  dropdownRef,
  scrollContainerRef,
  bottomRef,
  textareaRef,
  setOpenDropdown,
  setShowCannedMessages,
  setAllDepartments,
  setIsMobile,
  earliestMessageTime,
  hasMoreMessages,
  selectedCustomer,
  loadMessages,
  isLoadingMore,
  messages,
  inputMessage,
}) => {
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

  // Click outside canned messages
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".canned-dropdown")) {
        setShowCannedMessages(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowCannedMessages]);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const depts = await ChatService.getAllDepartments();
        setAllDepartments(depts);
      } catch (err) {
        handleError(err, "Failed to fetch departments", { context: 'useChatEffects.fetchDepartments' });
      }
    };
    fetchDepartments();
  }, [setAllDepartments]);

  // Window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobile]);

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
          handleError(error, 'Error loading more messages', { context: 'useChatEffects.handleScroll' });
        }

        setTimeout(() => { isThrottled = false; }, CHAT_CONFIG.SCROLL_THROTTLE_MS);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [earliestMessageTime, hasMoreMessages, selectedCustomer, loadMessages, isLoadingMore, scrollContainerRef]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages, bottomRef]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage, textareaRef]);
};
