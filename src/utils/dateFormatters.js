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
 * @returns {Array} - Array with date dividers and messages
 */
export const groupMessagesByDate = (messages) => {
  const groupedMessages = [];
  let currentDate = null;

  messages.forEach((message) => {
    const messageDate = formatMessageDate(message.timestamp);

    if (messageDate !== currentDate) {
      currentDate = messageDate;
      groupedMessages.push({
        type: "date",
        content: messageDate,
      });
    }

    groupedMessages.push({
      type: "message",
      ...message,
    });
  });

  return groupedMessages;
};
