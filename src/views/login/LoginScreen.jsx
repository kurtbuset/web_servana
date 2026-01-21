import { useState } from "react";
import { Eye, EyeOff } from "react-feather";
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
    <div className="min-h-screen flex items-center justify-center bg-[#F7F5FB] px-4">
      <div className="w-full max-w-[1200px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col-reverse md:flex-row min-h-[700px]">

        {/* Left side – Login form */}
        <div className="w-full md:w-2/5 flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md space-y-8">

            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-[#2E1065]">
                Welcome back 👋
              </h1>
              <p className="text-sm text-gray-500">
                Please sign in to your account
              </p>
            </div>

            {/* Form */}
            <div className="space-y-5">

              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6237A0] focus:border-transparent"
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#6237A0] focus:border-transparent"
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#6237A0]"
                        onClick={togglePasswordVisibility}
                      />
                    ) : (
                      <EyeOff
                        size={18}
                        strokeWidth={1.5}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#6237A0]"
                        onClick={togglePasswordVisibility}
                      />
                    ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              {/* Button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full rounded-lg bg-[#6237A0] py-3 text-sm font-semibold text-white transition hover:bg-[#552C8C] disabled:opacity-70 flex items-center justify-center"
              >
                {loading && (
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                )}
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </div>
        </div>

        {/* Right side – Branding */}
        <div className="w-full md:w-3/5 bg-gradient-to-br from-[#6237A0] to-[#7A4ED9] flex items-center justify-center p-10">
          <div className="flex flex-col items-center md:flex-row">
            <img
              src="images/icon.png"
              alt="Servana Logo"
              className="w-24 h-24 md:w-32 md:h-32 mb-4 md:mb-0 md:mr-4 drop-shadow-lg"
            />
            <span className="text-5xl sm:text-6xl font-semibold text-white font-baloo">
              servana
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
