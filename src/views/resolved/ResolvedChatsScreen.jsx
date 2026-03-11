import Layout from "../../components/Layout";
import { AnimatedBackground } from "../../components/ui";
import { useTheme } from "../../context/ThemeContext";
import ChatStyles from "../../components/chat/ChatStyles";
import ChatContainer from "../../components/chat/ChatContainer";
import "../../App.css";

/**
 * ResolvedChatsScreen - Screen for viewing resolved chats
 * 
 * Uses the unified ChatContainer with mode="resolved"
 * 
 * Features:
 * - View resolved chat history
 * - Department filtering for resolved chats
 * - Message pagination (load more)
 * - Mobile responsive with chat list/conversation views
 */
export default function ResolvedChatsScreen() {
  const { isDark } = useTheme();

  return (
    <Layout>
      <ChatStyles />
      <div className="flex flex-col h-full overflow-hidden relative" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <AnimatedBackground isDark={isDark} />
        <div className="flex flex-col h-full overflow-hidden relative z-10">
          <ChatContainer mode="resolved" />
        </div>
      </div>
    </Layout>
  );
}