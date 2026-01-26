import { useState } from "react";
import { Eye, EyeOff } from "react-feather";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import { useUser } from "../../../src/context/UserContext";

/**
 * LoginScreen - Refactored authentication screen
 * 
 * Uses the new useAuth hook for business logic while maintaining
 * the exact same UI/UX as the original Login screen.
 * 
 * Features:
 * - Email/password authentication
 * - Password visibility toggle
 * - Loading states with spinner
 * - Error message display
 * - Responsive design
 */
export default function LoginScreen() {
  const { login, loading, error } = useAuth();
  const { refreshUserData } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    try {
      await login(email, password);
      // Force refresh user data after successful login to ensure fresh privileges
      console.log("🔄 Login successful - refreshing user data...");
      await refreshUserData();
      // Set flag for showing toast after navigation
      localStorage.setItem("showLoginToast", "true");
    } catch (err) {
      // Error is already handled by useAuth hook (toast notification)
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F7F5FB] via-[#E8E4F3] to-[#F0EBFF] px-3 sm:px-4 py-4 sm:py-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-[1200px] bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col-reverse lg:flex-row min-h-[600px] sm:min-h-[650px] lg:min-h-[700px] relative z-10 border border-white/20">

        {/* Left side – Login form */}
        <div className="w-full lg:w-2/5 flex items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12 relative">
          {/* Decorative corner elements */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-purple-200 rounded-tl-2xl"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-purple-200 rounded-br-2xl"></div>
          
          <div className="w-full max-w-md space-y-6 sm:space-y-8 relative z-10">

            {/* Header with animated gradient text */}
            <div className="space-y-1.5 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#2E1065] via-[#6237A0] to-[#7A4ED9] bg-clip-text text-transparent animate-gradient">
                Welcome back 👋
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-gradient-to-r from-[#6237A0] to-transparent"></span>
                Please sign in to your account
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4 sm:space-y-5">

              {/* Email with icon */}
              <div className="space-y-1 group">
                <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#6237A0]/50 focus:border-[#6237A0] transition-all hover:border-gray-300 bg-white/50"
                    disabled={loading}
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#6237A0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </div>

              {/* Password with icon */}
              <div className="space-y-1 group">
                <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
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
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 pr-10 sm:pr-11 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#6237A0]/50 focus:border-[#6237A0] transition-all hover:border-gray-300 bg-white/50"
                    disabled={loading}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !loading) {
                        handleLogin();
                      }
                    }}
                  />
                  {password.length > 0 &&
                    (showPassword ? (
                      <Eye
                        size={18}
                        strokeWidth={1.5}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#6237A0] transition-colors"
                        onClick={togglePasswordVisibility}
                      />
                    ) : (
                      <EyeOff
                        size={18}
                        strokeWidth={1.5}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#6237A0] transition-colors"
                        onClick={togglePasswordVisibility}
                      />
                    ))}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#6237A0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </div>

              {/* Error with animation */}
              {error && (
                <div className="text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 p-2 sm:p-3 rounded-lg flex items-center gap-2 animate-shake">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Button with gradient and animation */}
              <button
                onClick={handleLogin}
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

            {/* Decorative dots */}
            <div className="flex justify-center gap-2 pt-4">
              <div className="w-2 h-2 rounded-full bg-[#6237A0]/20"></div>
              <div className="w-2 h-2 rounded-full bg-[#6237A0]/40"></div>
              <div className="w-2 h-2 rounded-full bg-[#6237A0]/60"></div>
            </div>
          </div>
        </div>

        {/* Right side – Branding with enhanced design */}
        <div className="w-full lg:w-3/5 bg-gradient-to-br from-[#6237A0] via-[#7A4ED9] to-[#8B5CF6] flex items-center justify-center p-8 sm:p-10 md:p-12 min-h-[200px] sm:min-h-[250px] lg:min-h-0 relative overflow-hidden">
          {/* Animated circles */}
          <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white/20 rounded-full animate-ping-slow"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 border-2 border-white/20 rounded-full animate-ping-slow animation-delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float animation-delay-2000"></div>
          
          <div className="flex flex-col items-center sm:flex-row relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
              <img
                src="images/icon.png"
                alt="Servana Logo"
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mb-3 sm:mb-0 sm:mr-4 drop-shadow-2xl relative z-10 animate-float"
              />
            </div>
            <span className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white font-baloo drop-shadow-lg">
              servana
            </span>
          </div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
        .animate-shake { animation: shake 0.5s; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-ping-slow { animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
