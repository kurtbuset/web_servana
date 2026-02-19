/**
 * LoadingState - Reusable loading state component with spinner and message
 */
export default function LoadingState({ message = "Loading...", className = "" }) {
  return (
    <div className={`flex items-center justify-center h-full py-8 ${className}`}>
      <div className="flex items-center space-x-3">
        <div 
          className="animate-spin rounded-full h-8 w-8 border-3 border-t-[#6237A0]" 
          style={{ borderColor: 'var(--border-color)', borderTopColor: '#6237A0' }}
        ></div>
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {message}
        </span>
      </div>
    </div>
  );
}
