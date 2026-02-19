import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import LoginHeader from "./components/LoginHeader";
import LoginForm from "./components/LoginForm";
import AnimatedBackground from "./components/AnimatedBackground";
import BrandingPanel from "./components/BrandingPanel";
import LoginAnimations from "./components/LoginAnimations";

/**
 * LoginScreen - Authentication screen
 * 
 * Features:
 * - Email/password authentication
 * - Password visibility toggle
 * - Loading states with spinner
 * - Error message display
 * - Responsive design
 * - Animated background and branding
 */
export default function LoginScreen() {
  const { login, loading, error } = useAuth();
  const { refreshUserData } = useUser();
  const { isDark } = useTheme();
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
    } catch (err) {
      // Error is already handled by useAuth hook (toast notification)
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-4 sm:py-6 relative overflow-hidden" style={{ background: isDark ? 'linear-gradient(to bottom right, #1e1e1e, #2a2a2a, #1e1e1e)' : 'linear-gradient(to bottom right, #F7F5FB, #E8E4F3, #F0EBFF)' }}>
      {/* Animated background elements */}
      <AnimatedBackground isDark={isDark} />

      <div className="w-full max-w-[1200px] backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col-reverse lg:flex-row min-h-[600px] sm:min-h-[650px] lg:min-h-[700px] relative z-10" style={{ 
        backgroundColor: isDark ? 'rgba(42, 42, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        border: `1px solid ${isDark ? 'rgba(74, 74, 74, 0.2)' : 'rgba(255, 255, 255, 0.2)'}`
      }}>

        {/* Left side – Login form */}
        <div className="w-full lg:w-2/5 flex items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12 relative">
          {/* Decorative corner elements */}
          <div className={`absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 rounded-tl-2xl ${isDark ? 'border-purple-500/30' : 'border-purple-200'}`}></div>
          <div className={`absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 rounded-br-2xl ${isDark ? 'border-purple-500/30' : 'border-purple-200'}`}></div>
          
          <div className="w-full max-w-md space-y-6 sm:space-y-8 relative z-10">
            {/* Header with animated gradient text */}
            <LoginHeader />

            {/* Form */}
            <LoginForm
              email={email}
              password={password}
              showPassword={showPassword}
              loading={loading}
              error={error}
              isDark={isDark}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onTogglePassword={togglePasswordVisibility}
              onLogin={handleLogin}
            />

            {/* Decorative dots */}
            <div className="flex justify-center gap-2 pt-4">
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-[#8B5CF6]/30' : 'bg-[#6237A0]/20'}`}></div>
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-[#8B5CF6]/50' : 'bg-[#6237A0]/40'}`}></div>
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-[#8B5CF6]/70' : 'bg-[#6237A0]/60'}`}></div>
            </div>
          </div>
        </div>

        {/* Right side – Branding with enhanced design */}
        <BrandingPanel />
      </div>

      {/* Animations */}
      <LoginAnimations />
    </div>
  );
}
