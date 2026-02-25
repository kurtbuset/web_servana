/**
 * QueueSidebarHeader - Header section of the queue sidebar
 */
export default function QueueSidebarHeader({ customerCount }) {
  return (
    <div className="bg-gradient-to-r from-[#6237A0] to-[#7A4ED9] p-3 md:p-4">
      <h2 className="text-base md:text-lg font-bold text-white mb-0.5 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Queue
      </h2>
      <p className="text-purple-100 text-[10px] md:text-xs">
        {customerCount} customer{customerCount !== 1 ? 's' : ''} waiting
      </p>
    </div>
  );
}
