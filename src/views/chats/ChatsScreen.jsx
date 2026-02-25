import Layout from "../../components/Layout";
import { AnimatedBackground } from "../../components/ui";
import { useTheme } from "../../context/ThemeContext";
import ChatStyles from "./components/ChatStyles";
import ChatContainer from "./components/ChatContainer";
import "../../App.css";

/**
 * ChatsScreen - Refactored chat interface
 * 
 * Uses the new useChat hook for business logic and Socket.IO integration
 * while maintaining the exact same UI/UX as the original Chats screen.
 * 
 * Features:
 * - Real-time messaging via Socket.IO
 * - Department filtering
 * - Canned messages
 * - Message pagination (load more)
 * - End chat functionality
 * - Transfer department (UI only)
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
          <ChatContainer />
        </div>
      </div>
    </Layout>
  );
}
