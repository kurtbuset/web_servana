import Layout from "../../components/Layout";
import { AnimatedBackground } from "../../components/ui";
import { useTheme } from "../../context/ThemeContext";
import QueueContainer from "./components/QueueContainer";
import "../../App.css";
import "../../styles/GridLayout.css";
import "../../styles/Animations.css";

/**
 * QueuesScreen - Refactored queue interface
 * 
 * Manages customer queue with department filtering and chat acceptance.
 * 
 * Features:
 * - Real-time queue updates via Socket.IO
 * - Department filtering
 * - Accept chat functionality
 * - Message pagination (load more)
 * - End chat functionality
 * - Transfer department
 * - Mobile responsive with queue list/conversation views
 */
export default function QueuesScreen() {
  const { isDark } = useTheme();

  return (
    <Layout>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? '#2a2a2a' : '#f1f1f1'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6237A0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7A4ED9;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
      <div className="flex flex-col h-full overflow-hidden relative" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <AnimatedBackground isDark={isDark} />
        <div className="flex flex-col h-full overflow-hidden relative z-10">
          <QueueContainer />
        </div>
      </div>
    </Layout>
  );
}
