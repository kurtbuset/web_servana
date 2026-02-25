/**
 * QueueMainEmpty - Empty state when no customer is selected from queue
 */
export default function QueueMainEmpty() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="text-center animate-slide-in">
        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 md:w-12 md:h-12 text-[#6237A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-base md:text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          No Chat Selected
        </h3>
        <p className="text-xs md:text-sm max-w-xs mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Select a customer from the queue to start chatting
        </p>
      </div>
    </div>
  );
}
