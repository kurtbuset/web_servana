import { ArrowLeft } from "react-feather";
import ScrollContainer from "../../../components/ScrollContainer";

/**
 * AnalyticsView Component
 * Full analytics view showing performance metrics for an agent
 * 
 * @param {Object} agent - The agent object with email and other details
 * @param {Function} onBack - Function to navigate back to agent detail view
 * @param {boolean} isDark - Dark mode flag
 */
export default function AnalyticsView({ agent, onBack, isDark }) {
  return (
    <ScrollContainer className="flex-1 pb-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-3 flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-opacity-80"
        style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : '#f3e8ff', color: '#6237A0' }}
      >
        <ArrowLeft size={14} />
        <span className="text-xs font-medium">Back</span>
      </button>

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Analytics for {agent.email?.split('@')[0]}
        </h2>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Performance metrics and insights
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {/* Total Chats */}
        <div className="p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4" style={{ color: '#6237A0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Total Chats</p>
          </div>
          <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>247</p>
          <p className="text-[10px] mt-1" style={{ color: '#10b981' }}>+12% this week</p>
        </div>

        {/* Avg Response Time */}
        <div className="p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4" style={{ color: '#6237A0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Avg Response</p>
          </div>
          <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>2.3m</p>
          <p className="text-[10px] mt-1" style={{ color: '#10b981' }}>-15% faster</p>
        </div>

        {/* Satisfaction Rate */}
        <div className="p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4" style={{ color: '#6237A0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Satisfaction</p>
          </div>
          <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>4.8/5</p>
          <p className="text-[10px] mt-1" style={{ color: '#10b981' }}>+0.3 rating</p>
        </div>

        {/* Resolved Tickets */}
        <div className="p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4" style={{ color: '#6237A0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Resolved</p>
          </div>
          <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>234</p>
          <p className="text-[10px] mt-1" style={{ color: '#10b981' }}>94.7% rate</p>
        </div>
      </div>

      {/* Performance Graph */}
      <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.05)' : '#f9fafb' }}>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Chat Performance (Last 7 Days)</h4>
          <span className="text-[10px] px-2 py-1 rounded" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : '#f3e8ff', color: '#6237A0' }}>
            Weekly
          </span>
        </div>
        
        {/* Simple SVG Line Graph */}
        <div className="relative h-32">
          <svg className="w-full h-full" viewBox="0 0 350 100" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="25" x2="350" y2="25" stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} strokeWidth="0.5" />
            <line x1="0" y1="50" x2="350" y2="50" stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} strokeWidth="0.5" />
            <line x1="0" y1="75" x2="350" y2="75" stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} strokeWidth="0.5" />
            
            {/* Area under the line */}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#6237A0', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#6237A0', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <path
              d="M 0 80 L 50 65 L 100 70 L 150 45 L 200 50 L 250 35 L 300 40 L 350 25 L 350 100 L 0 100 Z"
              fill="url(#lineGradient)"
            />
            
            {/* Line */}
            <path
              d="M 0 80 L 50 65 L 100 70 L 150 45 L 200 50 L 250 35 L 300 40 L 350 25"
              fill="none"
              stroke="#6237A0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            <circle cx="0" cy="80" r="3" fill="#6237A0" />
            <circle cx="50" cy="65" r="3" fill="#6237A0" />
            <circle cx="100" cy="70" r="3" fill="#6237A0" />
            <circle cx="150" cy="45" r="3" fill="#6237A0" />
            <circle cx="200" cy="50" r="3" fill="#6237A0" />
            <circle cx="250" cy="35" r="3" fill="#6237A0" />
            <circle cx="300" cy="40" r="3" fill="#6237A0" />
            <circle cx="350" cy="25" r="3" fill="#6237A0" />
          </svg>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <span key={i} className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{day}</span>
            ))}
          </div>
        </div>
      </div>
    </ScrollContainer>
  );
}
