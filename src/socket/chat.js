/**
 * Chat Socket Handlers
 * Emitters and event listeners for chat functionality
 */
import toast from "../utils/toast";

// ============= EMITTERS =============

export const joinChatGroup = (socket, { groupId, userType, userId }) => {
  if (!socket.connected) {
    console.warn("Socket not connected");
    return;
  }
  socket.emit("chat:join", {
    chatGroupId: groupId,
    userType,
    userId,
  });
};

export const sendMessage = (
  socket,
  { chat_body, chat_group_id, sys_user_id, client_id },
) => {
  if (!socket.connected) {
    console.warn("Socket not connected");
    return;
  }
  if (!chat_body || !chat_group_id || !sys_user_id) {
    console.warn("Missing required parameters for sendMessage");
    return;
  }
  socket.emit("sendMessage", {
    chat_body,
    chat_group_id,
    sys_user_id,
    client_id: client_id || null,
  });
};

export const resolveChat = (socket, chatGroupId) => {
  if (!socket.connected) return;
  socket.emit("resolveChat", { chatGroupId });
};

// ============= EVENT LISTENERS =============

export const registerChatEvents = (socket, callbacks = {}) => {
  const {
    onMessageReceived,
    onCustomerListUpdate,
    onUserJoined,
    onMessageError,
    onError,
    onMessageStatusUpdate,
    onChatTransferred,
    onChatResolved,
  } = callbacks;

  const handleReceiveMessage = (msg) => {
    console.log("received message");
    if (onMessageReceived) onMessageReceived(msg);
  };

  const handleCustomerListUpdate = (updateData) => {
    console.log("Received customerListUpdate:", updateData);
    if (onCustomerListUpdate) onCustomerListUpdate(updateData);
  };

  const handleUserJoined = (data) => {
    console.log(`${data.userType} joined chat_group ${data.chatGroupId}`);
    if (onUserJoined) onUserJoined(data);
  };

  const handleMessageError = (error) => {
    console.error("❌ Message error:", error);
    toast.error(error.error || error.details || "Failed to send message");
    if (onMessageError) onMessageError(error);
  };

  const handleError = (error) => {
    console.error("❌ Socket error:", error);
    const errorMessage = error.message || error.reason || "An error occurred";
    if (!errorMessage.toLowerCase().includes("auth")) {
      toast.error(errorMessage);
    }
    if (onError) onError(error);
  };

  const handleMessageStatusUpdate = (data) => {
    if (onMessageStatusUpdate) onMessageStatusUpdate(data);
  };

  const handleChatTransferred = (data) => {
    if (onChatTransferred) onChatTransferred(data);
  };

  const handleChatResolved = (data) => {
    console.log("Chat resolved:", data);
    if (onChatResolved) onChatResolved(data);
  };

  // Register listeners
  socket.on("receiveMessage", handleReceiveMessage);
  socket.on("customerListUpdate", handleCustomerListUpdate);
  socket.on("userJoined", handleUserJoined);
  socket.on("messageError", handleMessageError);
  socket.on("error", handleError);
  socket.on("messageStatusUpdate", handleMessageStatusUpdate);
  socket.on("chatTransferred", handleChatTransferred);
  socket.on("chat:resolved", handleChatResolved);

  // Return cleanup function
  return () => {
    socket.off("receiveMessage", handleReceiveMessage);
    socket.off("customerListUpdate", handleCustomerListUpdate);
    socket.off("userJoined", handleUserJoined);
    socket.off("messageError", handleMessageError);
    socket.off("error", handleError);
    socket.off("messageStatusUpdate", handleMessageStatusUpdate);
    socket.off("chatTransferred", handleChatTransferred);
    socket.off("chat:resolved", handleChatResolved);
  };
};
