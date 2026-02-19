import { Eye, EyeOff } from "react-feather";
import LoadingSpinner from "../../../components/LoadingSpinner";

/**
 * LoginForm - Login form with email and password inputs
 */
export default function LoginForm({
  email,
  password,
  showPassword,
  loading,
  error,
  isDark,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onLogin
}) {
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Email with icon */}
      <div className="space-y-1 group">
        <label className="text-xs sm:text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
          <svg className="w-4 h-4 text-[#6237A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
          Email
        </label>
        <div className="relative">
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#6237A0]/50 focus:border-[#6237A0] transition-all"
            style={{
              backgroundColor: isDark ? 'rgba(58, 58, 58, 0.5)' : 'rgba(255, 255, 255, 0.5)',
              color: 'var(--text-primary)',
              border: `2px solid var(--border-color)`
            }}
            disabled={loading}
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#6237A0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </div>
      </div>

      {/* Password with icon */}
      <div className="space-y-1 group">
        <label className="text-xs sm:text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
          <svg className="w-4 h-4 text-[#6237A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 pr-10 sm:pr-11 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#6237A0]/50 focus:border-[#6237A0] transition-all"
            style={{
              backgroundColor: isDark ? 'rgba(58, 58, 58, 0.5)' : 'rgba(255, 255, 255, 0.5)',
              color: 'var(--text-primary)',
              border: `2px solid var(--border-color)`
            }}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading) {
                onLogin();
              }
            }}
          />
          {password.length > 0 &&
            (showPassword ? (
              <Eye
                size={18}
                strokeWidth={1.5}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-[#6237A0] transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onClick={onTogglePassword}
              />
            ) : (
              <EyeOff
                size={18}
                strokeWidth={1.5}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-[#6237A0] transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onClick={onTogglePassword}
              />
            ))}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#6237A0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </div>
      </div>

      {/* Error with animation */}
      {error && (
        <div className="text-xs sm:text-sm p-2 sm:p-3 rounded-lg flex items-center gap-2 animate-shake" style={{
          color: isDark ? '#fca5a5' : '#dc2626',
          backgroundColor: isDark ? 'rgba(220, 38, 38, 0.1)' : '#fef2f2',
          border: `1px solid ${isDark ? 'rgba(220, 38, 38, 0.3)' : '#fecaca'}`
        }}>
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Button with gradient and animation */}
      <button
        onClick={onLogin}
        disabled={loading}
        className="w-full rounded-lg bg-gradient-to-r from-[#6237A0] to-[#7A4ED9] py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white transition-all hover:shadow-2xl hover:shadow-purple-500/50 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-lg relative overflow-hidden group"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-[#7A4ED9] to-[#6237A0] opacity-0 group-hover:opacity-100 transition-opacity"></span>
        <span className="relative z-10">
          {loading ? (
            <LoadingSpinner variant="button" message="Logging in..." size="sm" />
          ) : (
            <span className="flex items-center gap-2">
              Login
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )}
        </span>
      </button>
    </div>
  );
}
