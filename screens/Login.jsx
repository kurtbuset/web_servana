import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "react-feather";
import api from "../src/api";
import { useUser } from "../context/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const { fetchUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // <-- Loading state

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    setLoading(true); // Start loading
    setErrorMessage(""); // Clear previous errors

    try {
      await api.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );
      await fetchUser();
      navigate("/queues");
    } catch {
      setErrorMessage("Invalid credentials");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFfFf] p-4">
      <div className="w-full max-w-[1200px] bg-white rounded-lg overflow-hidden shadow-xl flex flex-col-reverse md:flex-row min-h-[700px]">
        {/* Left side - Login form */}
        <div className="w-full md:w-2/5 p-8 sm:p-10 flex items-center justify-center">
          <div className="w-full space-y-6 max-w-md">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-black-100">
                Welcome back
              </h1>
              <p className="text-gray-500 text-sm text-black-50">
                Please enter your details
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block font-medium text-sm text-black"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                  />
                  {password.length > 0 &&
                    (showPassword ? (
                      <Eye
                        size={18}
                        strokeWidth={1}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      />
                    ) : (
                      <EyeOff
                        size={18}
                        strokeWidth={1}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      />
                    ))}
                </div>
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
              <button
                className={`w-full bg-[#6237A0] hover:bg-[#5C2E90] text-white font-semibold py-2 px-4 rounded-md transition cursor-pointer flex items-center justify-center`}
                onClick={handleLogin}
                disabled={loading} // Disable button while loading
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : null}
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </div>
        </div>
        {/* Right side - Logo */}
        <div className="w-full md:w-3/5 bg-gray-50 flex items-center justify-center p-10 pt-28">
          <div className="flex flex-col items-center md:flex-row">
            <img
              src="images/icon.png"
              alt="Servana Logo"
              className="w-24 h-24 md:w-32 md:h-32 mb-4 md:mb-0 md:mr-4"
            />
            <span className="text-5xl sm:text-6xl font-medium text-[#6237A0] font-baloo text-center md:text-left">
              servana
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
