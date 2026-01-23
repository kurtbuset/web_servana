import { useState, useEffect } from "react";
import { Eye, EyeOff, Shield, CheckCircle, AlertCircle } from "react-feather";
import { useAuth } from "../../hooks/useAuth";
import { useUser } from "../../../src/context/UserContext";
import ResponsiveContainer from "../../components/responsive/ResponsiveContainer";

/**
 * LoginScreen - Premium authentication screen for mobile, tablet, and desktop
 * 
 * Features:
 * - Advanced responsive design with micro-interactions
 * - Professional animations and transitions
 * - Enhanced security indicators
 * - Premium visual design elements
 * - Optimized for all device types
 * - Advanced accessibility features
 */
export default function LoginScreen() {
  const { login, loading, error } = useAuth();
  const { refreshUserData } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Animation on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    setFormTouched(true);
    try {
      await login(email, password);
      console.log("🔄 Login successful - refreshing user data...");
      await refreshUserData();
      localStorage.setItem("showLoginToast", "true");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const isEmailValid = email.includes('@') && email.includes('.');
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  return (
    <ResponsiveContainer>
      {({ isMobile, isTablet, isDesktop, screenSize }) => (
        <div className={`
          min-h-screen flex items-center justify-center 
          bg-gradient-to-br from-[#F7F5FB] via-[#FDFCFF] to-[#F0EBFF]
          responsive-p-4 relative overflow-hidden
          ${mounted ? 'animate-fade-in' : 'opacity-0'}
        `}>
          
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-[#6237A0]/10 to-[#7A4ED9]/5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-[#7A4ED9]/10 to-[#6237A0]/5 rounded-full blur-3xl animate-float-delayed"></div>
            {!isMobile && (
              <>
                <div className="absolute top-16 left-16 w-1.5 h-1.5 bg-[#6237A0]/20 rounded-full animate-pulse"></div>
                <div className="absolute top-32 right-24 w-1 h-1 bg-[#7A4ED9]/30 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-24 left-32 w-1 h-1 bg-[#6237A0]/25 rounded-full animate-pulse delay-2000"></div>
              </>
            )}
          </div>

          <div className={`
            w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20
            overflow-hidden flex relative z-10
            ${isMobile ? 'flex-col max-w-sm min-h-[500px] shadow-xl' : 
              isTablet ? 'flex-col-reverse max-w-2xl min-h-[420px] shadow-2xl' : 
              'flex-col-reverse md:flex-row max-w-[900px] min-h-[520px] shadow-2xl'}
            ${mounted ? 'animate-slide-up' : 'translate-y-8 opacity-0'}
            transition-all duration-700 ease-out
          `}>

            {/* Login Form Section */}
            <div className={`
              ${isMobile ? 'w-full order-2' : 'w-full md:w-2/5'} 
              flex items-center justify-center relative
              ${isMobile ? 'p-4' : isTablet ? 'p-5' : 'p-6 sm:p-8'}
            `}>
              
              {/* Security Badge */}
              <div className={`
                absolute top-3 right-3 flex items-center space-x-1 
                bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium
                ${isMobile ? 'hidden' : ''}
              `}>
                
              </div>

              <div className={`
                w-full space-y-4
                ${isMobile ? 'max-w-sm' : isTablet ? 'max-w-sm' : 'max-w-md'}
              `}>

                {/* Header */}
                <div className={`space-y-2 ${isMobile ? 'text-center' : ''}`}>
                  <div className="flex items-center space-x-2 justify-center md:justify-start">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#6237A0] to-[#7A4ED9] rounded-lg flex items-center justify-center">
                    </div>
                    <h1 className={`
                      font-bold text-[#2E1065] leading-tight
                      ${isMobile ? 'text-xl' : 
                        isTablet ? 'text-xl' : 
                        'text-3xl'}
                    `}>
                      Welcome back
                    </h1>
                  </div>
                  <p className={`
                    text-gray-600 font-medium
                    ${isMobile ? 'text-xs' : isTablet ? 'text-xs' : 'text-sm'}
                  `}>
                    Log In
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-3">

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className={`
                      font-semibold text-gray-700 flex items-center space-x-1
                      ${isMobile ? 'text-sm' : 'text-sm'}
                    `}>
                      <span>Email Address</span>
                      {formTouched && isEmailValid && (
                        <CheckCircle size={14} className="text-green-500" />
                      )}
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        placeholder="Enter your email address"
                        className={`
                          w-full rounded-xl border-2 text-sm font-medium
                          transition-all duration-300 ease-out
                          ${emailFocused ? 
                            'border-[#6237A0] ring-4 ring-[#6237A0]/10 shadow-lg' : 
                            formTouched && !isEmailValid ? 
                            'border-red-300 ring-4 ring-red-100' :
                            'border-gray-200 hover:border-gray-300'}
                          ${isMobile ? 'px-3 py-3 text-base' : 
                            isTablet ? 'px-3 py-2 text-sm' : 
                            'px-4 py-2.5'}
                          focus:outline-none bg-white/50 backdrop-blur-sm
                          touch-target placeholder:text-gray-400
                        `}
                        disabled={loading}
                        autoComplete="email"
                        inputMode="email"
                      />
                      {formTouched && !isEmailValid && email.length > 0 && (
                        <AlertCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400" />
                      )}
                    </div>
                    {formTouched && !isEmailValid && email.length > 0 && (
                      <p className="text-xs text-red-500 font-medium">Please enter a valid email address</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className={`
                      font-semibold text-gray-700 flex items-center space-x-1
                      ${isMobile ? 'text-sm' : 'text-sm'}
                    `}>
                      <span>Password</span>
                      {formTouched && isPasswordValid && (
                        <CheckCircle size={14} className="text-green-500" />
                      )}
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        placeholder="Enter your password"
                        className={`
                          w-full rounded-xl border-2 text-sm font-medium
                          transition-all duration-300 ease-out
                          ${passwordFocused ? 
                            'border-[#6237A0] ring-4 ring-[#6237A0]/10 shadow-lg' : 
                            formTouched && !isPasswordValid ? 
                            'border-red-300 ring-4 ring-red-100' :
                            'border-gray-200 hover:border-gray-300'}
                          ${isMobile ? 'px-3 py-3 pr-12 text-base' : 
                            isTablet ? 'px-3 py-2 pr-10 text-sm' : 
                            'px-4 py-2.5 pr-12'}
                          focus:outline-none bg-white/50 backdrop-blur-sm
                          touch-target placeholder:text-gray-400
                        `}
                        disabled={loading}
                        autoComplete="current-password"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !loading && isFormValid) {
                            handleLogin();
                          }
                        }}
                      />
                      {password.length > 0 && (
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className={`
                            absolute top-1/2 -translate-y-1/2 text-gray-400 
                            hover:text-[#6237A0] transition-all duration-200
                            touch-target flex items-center justify-center
                            rounded-lg hover:bg-gray-50
                            ${isMobile ? 'right-2 w-10 h-10' : 
                              isTablet ? 'right-2 w-8 h-8' : 
                              'right-2 w-8 h-8'}
                          `}
                          disabled={loading}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <Eye size={isMobile ? 20 : isTablet ? 16 : 18} strokeWidth={1.5} />
                          ) : (
                            <EyeOff size={isMobile ? 20 : isTablet ? 16 : 18} strokeWidth={1.5} />
                          )}
                        </button>
                      )}
                      {formTouched && !isPasswordValid && password.length > 0 && (
                        <AlertCircle size={16} className="absolute right-12 top-1/2 -translate-y-1/2 text-red-400" />
                      )}
                    </div>
                    {formTouched && !isPasswordValid && password.length > 0 && (
                      <p className="text-xs text-red-500 font-medium">Password must be at least 6 characters</p>
                    )}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className={`
                      p-4 rounded-xl bg-red-50 border-2 border-red-100
                      ${isMobile ? 'text-sm' : 'text-sm'}
                      animate-shake
                    `}>
                      <div className="flex items-center space-x-2">
                        <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                        <p className="text-red-700 font-medium">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Login Button */}
                  <button
                    onClick={handleLogin}
                    disabled={loading || !isFormValid}
                    className={`
                      w-full rounded-xl font-bold text-white
                      transition-all duration-300 ease-out
                      flex items-center justify-center space-x-2
                      focus:outline-none focus:ring-4 focus:ring-[#6237A0]/20
                      ${loading || !isFormValid ? 
                        'bg-gray-300 cursor-not-allowed' : 
                        'bg-gradient-to-r from-[#6237A0] to-[#7A4ED9] hover:from-[#552C8C] hover:to-[#6B46C1] active:scale-[0.98] shadow-lg hover:shadow-xl'}
                      ${isMobile ? 'py-3 text-base' : 
                        isTablet ? 'py-2 text-sm' : 
                        'py-2.5 text-sm'}
                      touch-target transform
                    `}
                    type="button"
                  >
                    {loading ? (
                      <>
                        <svg
                          className={`animate-spin ${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`}
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
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        
                        <span>Log In</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Security Info */}
                <div className={`
                  text-center pt-2 space-y-1
                  ${isMobile ? '' : 'border-t border-gray-100'}
                `}>
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                    
                    
                  </div>
                  {isMobile && (
                    <p className="text-xs text-gray-400">
                      Powered by Servana
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className={`
              ${isMobile ? 'w-full order-1 py-6' : 'w-full md:w-3/5'} 
              bg-gradient-to-br from-[#6237A0] via-[#7A4ED9] to-[#8B5CF6]
              flex items-center justify-center relative overflow-hidden
              ${isMobile ? 'p-4' : isTablet ? 'p-4' : 'p-6'}
            `}>
              
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-8 left-8 w-16 h-16 border border-white rounded-full"></div>
                <div className="absolute top-24 right-16 w-12 h-12 border border-white rounded-full"></div>
                <div className="absolute bottom-16 left-16 w-10 h-10 border border-white rounded-full"></div>
                <div className="absolute bottom-24 right-24 w-6 h-6 border border-white rounded-full"></div>
              </div>

              <div className={`
                flex items-center justify-center relative z-10
                ${isMobile ? 'flex-col space-y-3' : 
                  isTablet ? 'flex-col space-y-2' : 
                  'flex-col md:flex-row md:space-y-0 md:space-x-4'}
              `}>
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
                  <img
                    src="images/icon.png"
                    alt="Servana Logo"
                    className={`
                      relative z-10 drop-shadow-2xl
                      ${isMobile ? 'w-20 h-20' : 
                        isTablet ? 'w-24 h-24' : 
                        'w-28 h-28 md:w-36 md:h-36'}
                    `}
                  />
                </div>
                
                <div className={`
                  text-center ${isDesktop ? 'md:text-left' : ''}
                `}>
                  <div className={`
                    text-white font-bold font-baloo
                    ${isMobile ? 'text-3xl' : 
                      isTablet ? 'text-3xl' : 
                      'text-5xl sm:text-6xl'}
                    drop-shadow-lg
                  `}>
                    servana
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    <p className={`
                      text-white/90 font-semibold
                      ${isMobile ? 'text-sm' : 
                        isTablet ? 'text-sm' : 
                        'text-lg'}
                    `}>
                      Customer Service Platform
                    </p>
                    <p className={`
                      text-white/70
                      ${isMobile ? 'text-xs' : 
                        isTablet ? 'text-xs' : 
                        'text-base'}
                    `}>
                    
                    </p>
                    
                    {!isMobile && (
                      <div className="flex items-center justify-center md:justify-start space-x-4 mt-3">
                        <div className="flex items-center space-x-1 text-white/80 text-xs">
                          <CheckCircle size={10} />
                          <span>Secure</span>
                        </div>
                        <div className="flex items-center space-x-1 text-white/80 text-xs">
                          <CheckCircle size={10} />
                          <span>Fast</span>
                        </div>
                        <div className="flex items-center space-x-1 text-white/80 text-xs">
                          <CheckCircle size={10} />
                          <span>Reliable</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ResponsiveContainer>
  );
}
