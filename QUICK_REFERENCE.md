# Quick Reference Guide

## 📁 New File Structure

```
src/
├── constants/
│   └── chat.constants.js          # All constants (timing, events, permissions)
├── utils/
│   ├── messageTransformers.js     # Message transformation utilities
│   └── errorHandler.js            # Centralized error handling
├── hooks/
│   ├── shared/
│   │   ├── useGroups.js          # Shared groups logic (chat + queue)
│   │   └── useMessages.js        # Shared messages logic (chat + queue)
│   ├── chats/
│   │   ├── useChat.js            # Main composer (no effects)
│   │   ├── useChatGroups.js      # Wrapper for useGroups
│   │   ├── useChatMessages.js    # Wrapper for useMessages
│   │   ├── useChatActions.js     # Chat-specific actions
│   │   ├── useChatSocket.js      # Socket handling
│   │   ├── useChatEffects.js     # All side effects
│   │   ├── useChatHandlers.js    # Event handlers
│   │   └── useCannedMessages.js  # Canned messages
│   └── queues/
│       ├── useQueues.js          # Main composer
│       ├── useQueueGroups.js     # Wrapper for useGroups
│       ├── useQueueMessages.js   # Wrapper for useMessages
│       ├── useQueueActions.js    # Queue-specific actions
│       ├── useQueueSocket.js     # Socket handling
│       ├── useQueuesEffects.js   # All side effects
│       └── useQueuesHandlers.js  # Event handlers
```

---

## 🔧 How to Use

### Constants
```javascript
import { CHAT_CONFIG, SOCKET_EVENTS, PERMISSIONS } from '../constants/chat.constants';

// Timing
setTimeout(() => { ... }, CHAT_CONFIG.END_CHAT_DELAY_MS);

// Socket events
socket.emit(SOCKET_EVENTS.SEND_MESSAGE, data);

// Permissions
if (hasPermission(PERMISSIONS.CAN_MESSAGE)) { ... }
```

### Message Transformers
```javascript
import { 
  transformMessages, 
  createSystemMessage,
  formatMessageTime 
} from '../utils/messageTransformers';

// Transform API messages
const messages = transformMessages(apiResponse.messages);

// Create system message
const endMsg = createSystemMessage('Chat ended');

// Format time
const time = formatMessageTime(timestamp);
```

### Error Handler
```javascript
import { 
  handleError, 
  handleApiError, 
  handlePermissionError,
  showSuccess 
} from '../utils/errorHandler';

// General error
try {
  await someAction();
} catch (err) {
  handleError(err, 'Action failed', { context: 'MyComponent' });
}

// API error (auto-extracts message from response)
try {
  await apiCall();
} catch (err) {
  handleApiError(err, 'API call failed');
}

// Permission error
if (!hasPermission(PERMISSIONS.CAN_MESSAGE)) {
  handlePermissionError('send messages');
  return;
}

// Success message
showSuccess('Chat transferred successfully');
```

### Shared Hooks
```javascript
import { useGroups } from '../shared/useGroups';
import { useMessages } from '../shared/useMessages';

// Use in your custom hook
export const useMyGroups = () => {
  return useGroups({
    fetchService: MyService.getGroups,
    socketUpdateEvent: 'myUpdateEvent',
    debounceUpdates: true,
  });
};

export const useMyMessages = () => {
  return useMessages({
    fetchService: MyService.getMessages,
  });
};
```

---

## 📋 Common Patterns

### Adding a New Feature

1. **Add constants** (if needed)
```javascript
// constants/chat.constants.js
export const CHAT_CONFIG = {
  // ... existing
  NEW_FEATURE_TIMEOUT: 2000,
};
```

2. **Add utility function** (if reusable)
```javascript
// utils/messageTransformers.js
export const myNewTransformer = (data) => {
  // transformation logic
};
```

3. **Update shared hook** (if affects both chat and queue)
```javascript
// hooks/shared/useGroups.js or useMessages.js
// Add new functionality here
```

4. **Or update specific hook** (if chat or queue only)
```javascript
// hooks/chats/useChatActions.js
// Add chat-specific action
```

### Handling Errors

```javascript
// Always use error handler
try {
  const result = await someAsyncAction();
  showSuccess('Action completed');
  return result;
} catch (err) {
  handleError(err, 'User-friendly message', {
    context: 'ComponentName.functionName',
    showToast: true,
  });
  return null;
}
```

### Using Socket Events

```javascript
import { SOCKET_EVENTS } from '../constants/chat.constants';

// Emit
socket.emit(SOCKET_EVENTS.SEND_MESSAGE, payload);

// Listen
socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handler);

// Cleanup
socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handler);
```

---

## 🎯 Best Practices

### DO ✅
- Use constants for all magic numbers
- Use error handler for all errors
- Use message transformers for message formatting
- Keep hooks focused and single-purpose
- Put side effects in *Effects hooks
- Use shared hooks for common logic

### DON'T ❌
- Don't use magic numbers directly
- Don't use `console.error` + `toast.error` separately
- Don't duplicate message transformation logic
- Don't put side effects in main composer hooks
- Don't duplicate code between chat and queue

---

## 🔍 Troubleshooting

### Issue: Constants not found
**Solution:** Check import path
```javascript
import { CHAT_CONFIG } from '../constants/chat.constants';
```

### Issue: Error handler not showing toast
**Solution:** Check options
```javascript
handleError(err, 'Message', { showToast: true });
```

### Issue: Shared hook not working
**Solution:** Verify service function signature
```javascript
// Service must accept (id, before, limit)
const fetchService = async (id, before, limit) => { ... };
```

---

## 📚 Examples

### Complete Error Handling Example
```javascript
const transferChat = async (deptId) => {
  if (!selectedCustomer) return false;

  try {
    const response = await ChatService.transferChat(
      selectedCustomer.chat_group_id, 
      deptId
    );
    
    if (response.success) {
      // Update state...
      showSuccess("Chat transferred successfully");
      return true;
    }
    return false;
  } catch (err) {
    handleApiError(err, "Failed to transfer chat", {
      context: 'useChatActions.transferChat'
    });
    return false;
  }
};
```

### Complete Message Loading Example
```javascript
const loadMessages = async (clientId, before = null, append = false) => {
  if (!append && loadInProgress.current) return;

  loadInProgress.current = true;
  if (append) setIsLoadingMore(true);
  
  try {
    const response = await fetchService(
      clientId, 
      before, 
      CHAT_CONFIG.MESSAGES_PER_PAGE
    );
    
    const newMessages = transformMessages(response.messages);
    
    setMessages((prev) => {
      const combined = append ? [...newMessages, ...prev] : newMessages;
      return deduplicateMessages(combined);
    });

    if (newMessages.length > 0) {
      setEarliestMessageTime(newMessages[0].timestamp);
    }
    if (newMessages.length < CHAT_CONFIG.MESSAGES_PER_PAGE) {
      setHasMoreMessages(false);
    }
  } catch (err) {
    handleError(err, 'Failed to load messages', {
      context: 'useMessages.loadMessages'
    });
  } finally {
    if (append) setIsLoadingMore(false);
    loadInProgress.current = false;
  }
};
```

---

## 🚀 Quick Start

### For New Developers

1. **Read constants file** to understand configuration
2. **Check utils** to see available helpers
3. **Look at shared hooks** to understand common patterns
4. **Follow existing patterns** when adding features

### For Existing Developers

1. **Replace magic numbers** with constants
2. **Use error handler** instead of console.error + toast
3. **Use message transformers** instead of inline transformation
4. **Consider shared hooks** before duplicating code

---

## 📞 Need Help?

1. Check `IMPROVEMENTS_SUMMARY.md` for detailed explanation
2. Look at existing code for examples
3. Follow the patterns established in shared hooks
4. Use constants and utilities consistently

---

**Remember:** The goal is consistency, maintainability, and DRY (Don't Repeat Yourself)!
