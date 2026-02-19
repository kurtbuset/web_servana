/**
 * InfoCard - Reusable info card component for displaying profile information
 */
export default function InfoCard({ icon, label, value, isDark }) {
  return (
    <div 
      className="flex items-start gap-2 p-3 rounded-lg transition-all group relative overflow-hidden" 
      style={{ 
        background: isDark ? 'linear-gradient(to bottom right, #2a2a2a, #1e1e1e)' : 'linear-gradient(to bottom right, #f9fafb, #ffffff)',
        border: `1px solid ${isDark ? '#4a4a4a' : '#f3f4f6'}`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = isDark ? '#6237A0' : '#c4b5fd';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isDark ? '#4a4a4a' : '#f3f4f6';
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#6237A0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex-shrink-0 text-[#6237A0] mt-0.5 group-hover:scale-110 transition-transform relative z-10">
        {icon}
      </div>
      <div className="flex-1 min-w-0 relative z-10">
        <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </p>
        <p className="text-xs font-medium break-words truncate" style={{ color: 'var(--text-primary)' }} title={value}>
          {value}
        </p>
      </div>
    </div>
  );
}
