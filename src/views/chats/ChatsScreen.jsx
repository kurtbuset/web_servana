import Layout from "../../components/Layout";
import { AnimatedBackground } from "../../components/ui";
import { useTheme } from "../../hooks/useTheme";
import ChatStyles from "../../components/chat/ChatStyles";
import ChatContainer from "../../components/chat/ChatContainer";
import "../../App.css";

/**
 * ChatsScreen - Refactored chat interface
 * 
 * Uses the unified ChatContainer with mode="active"
 * 
 * Features:
 * - Real-time messaging via Socket.IO
 * - Department filtering
 * - Canned messages
 * - Message pagination (load more)
 * - End chat functionality
 * - Transfer department
 * - Mobile responsive with chat list/conversation views
 */
export default function ChatsScreen() {
  const { isDark } = useTheme();

  return (
    <Layout>
      <ChatStyles />
      <div className="flex flex-col h-full overflow-hidden relative" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <AnimatedBackground isDark={isDark} />
        <div className="flex flex-col h-full overflow-hidden relative z-10">
          <ChatContainer mode="active" />
        </div>
      </div>
    </Layout>
  );
}
