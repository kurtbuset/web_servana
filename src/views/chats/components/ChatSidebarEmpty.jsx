/**
 * ChatSidebarEmpty - Empty state for chat sidebar
 */
export default function ChatSidebarEmpty({ icon, title, message }) {
  const renderIcon = () => {
    if (icon === "loading") {
      return (
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#6237A0] border-t-transparent"></div>
      );
    }
    
    return (
      <svg className="w-8 h-8 text-[#6237A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    );
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center">
          {renderIcon()}
        </div>
        <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <p className="text-xs max-w-xs mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {message}
        </p>
      </div>
    </div>
  );
}
