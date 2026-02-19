/**
 * LoginHeader - Header section with welcome message
 */
export default function LoginHeader() {
  return (
    <div className="space-y-1.5 sm:space-y-2">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#C4B5FD] bg-clip-text text-transparent animate-gradient">
        Welcome back 👋
      </h1>
      <p className="text-xs sm:text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
        <span className="w-8 h-0.5 bg-gradient-to-r from-[#6237A0] to-transparent"></span>
        Please sign in to your account
      </p>
    </div>
  );
}
