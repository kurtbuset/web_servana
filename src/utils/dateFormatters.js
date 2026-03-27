/**
 * Format a timestamp into a human-readable date string
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} - "Today", "Yesterday", or formatted date
 */
export const formatMessageDate = (timestamp) => {
  const messageDate = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (messageDate.toDateString() === today.toDateString()) {
    return "Today";
  } else if (messageDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return messageDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year:
        messageDate.getFullYear() !== today.getFullYear()
          ? "numeric"
          : undefined,
    });
  }
};

/**
 * Group messages by date with date dividers
 * @param {Array} messages - Array of message objects with timestamp
 * @returns {Array} - Array with date dividers, transfer separators, and messages
 */
export const groupMessagesByDate = (messages) => {
  const groupedMessages = [];
  let currentDate = null;

  messages.forEach((message) => {
    const messageDate = formatMessageDate(message.timestamp);

    // Add date divider if date changed
    if (messageDate !== currentDate) {
      currentDate = messageDate;
      groupedMessages.push({
        type: "date",
        content: messageDate,
      });
    }

    // Check if this is a transfer message
    if (message.message_type === 'transfer') {
      groupedMessages.push({
        type: "message",
        message_type: "transfer",
        content: message.content,
        timestamp: message.timestamp,
        transfer_data: message.transfer_data,
        ...message,
      });
    } else {
      groupedMessages.push({
        type: "message",
        ...message,
      });
    }
  });

  return groupedMessages;
};
