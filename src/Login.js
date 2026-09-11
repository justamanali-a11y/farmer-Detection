import React, { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Login({ onLogin, onCreateProfile }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const resetToken = new URLSearchParams(window.location.search).get("resetToken");

  // ================= VALIDATION =================
  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password should be at least 8 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ================= LOGIN =================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoggingIn(true);

    Promise.resolve(onLogin?.(email.trim().toLowerCase(), password))
      .finally(() => setIsLoggingIn(false));
  };

  // ================= INPUT =================
  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    setErrors((prev) => ({
      ...prev,
      email: "",
    }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    setErrors((prev) => ({
      ...prev,
      password: "",
    }));
  };

  const requestPasswordReset = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage("Enter your email address first.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await response.json();
      setMessage(data.message || "Check your email for reset instructions.");
    } catch (error) {
      setMessage("Could not send reset email. Please try again.");
    }
  };

  const submitPasswordReset = async (e) => {
    e.preventDefault();
    if (resetPassword !== resetConfirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, password: resetPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setMessage(data.message);
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      setMessage(error.message || "Could not reset password.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-green-950/20 to-gray-950 text-white flex items-center justify-center px-4 py-8 relative overflow-hidden">
      
      {/* ================= BACKGROUND GLOW ================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />

        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      {/* ================= LOGIN CONTAINER ================= */}
      <div className="relative z-10 w-full max-w-md animate-[slideUp_.6s_ease-out]">

        {/* ================= BRAND ================= */}
        <div className="text-center mb-8">
          
          <div className="relative mx-auto w-20 h-20 mb-5">
            <div className="absolute inset-0 rounded-2xl bg-green-500/20 blur-xl animate-pulse" />

            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-green-700 to-emerald-700 border border-green-500/30 flex items-center justify-center text-4xl shadow-xl shadow-green-950/40">
              🌾
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Farmer<span className="text-green-400">Detect</span>
          </h1>

          <p className="text-gray-500 text-xs tracking-[0.25em] mt-2">
            SMART FARMING PLATFORM
          </p>
        </div>

        {/* ================= LOGIN CARD ================= */}
        <div className="bg-gray-900/80 backdrop-blur-xl border border-green-900/40 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/40">

          {/* Card Header */}
          <div className="mb-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold mb-4">
              🔐 Secure Login
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold">
              Welcome Back 👋
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Login to manage your farm and detect crop diseases.
            </p>
          </div>

          {resetToken ? (
            <form onSubmit={submitPasswordReset}>
              <h3 className="text-xl font-bold mb-5">Reset Password</h3>
              <input
                type="password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                placeholder="New password"
                className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-950/70 border border-gray-700 text-white outline-none focus:border-green-500"
                required
              />
              <input
                type="password"
                value={resetConfirmPassword}
                onChange={(e) => setResetConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-950/70 border border-gray-700 text-white outline-none focus:border-green-500"
                required
              />
              <button type="submit" className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-500 font-bold">
                Reset Password
              </button>
            </form>
          ) : forgotMode ? (
            <form onSubmit={requestPasswordReset}>
              <h3 className="text-xl font-bold mb-2">Forgot Password?</h3>
              <p className="text-gray-500 text-sm mb-5">Enter your email and we will send a reset link.</p>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="example@gmail.com"
                className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-950/70 border border-gray-700 text-white outline-none focus:border-green-500"
                required
              />
              <button type="submit" className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-500 font-bold">
                Send Reset Link
              </button>
              <button type="button" onClick={() => { setForgotMode(false); setMessage(""); }} className="w-full mt-3 text-green-400 font-semibold">
                Back to Login
              </button>
            </form>
          ) : (
          /* ================= FORM ================= */
          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email Address
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  📧
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="example@gmail.com"
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-950/70 border ${
                    errors.email
                      ? "border-red-500 focus:border-red-400"
                      : "border-gray-700 focus:border-green-500"
                  } text-white placeholder-gray-600 outline-none transition-all duration-300 focus:ring-2 ${
                    errors.email
                      ? "focus:ring-red-500/10"
                      : "focus:ring-green-500/10"
                  }`}
                />
              </div>

              {errors.email && (
                <p className="text-red-400 text-xs mt-2 animate-[fadeIn_.2s_ease-out]">
                  ⚠️ {errors.email}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Password
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  🔒
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  className={`w-full pl-11 pr-12 py-3.5 rounded-xl bg-gray-950/70 border ${
                    errors.password
                      ? "border-red-500 focus:border-red-400"
                      : "border-gray-700 focus:border-green-500"
                  } text-white placeholder-gray-600 outline-none transition-all duration-300 focus:ring-2 ${
                    errors.password
                      ? "focus:ring-red-500/10"
                      : "focus:ring-green-500/10"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-400 transition-colors"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-400 text-xs mt-2 animate-[fadeIn_.2s_ease-out]">
                  ⚠️ {errors.password}
                </p>
              )}
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed font-bold shadow-lg shadow-green-950/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              {isLoggingIn ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Login to FarmerDetect →"
              )}
            </button>
            <button type="button" onClick={() => { setForgotMode(true); setMessage(""); }} className="w-full mt-4 text-sm text-green-400 hover:text-green-300">
              Forgot Password?
            </button>
          </form>
          )}

          {message && <p className="mt-4 text-center text-sm text-green-300">{message}</p>}

          {/* ================= SIGN UP ================= */}
          <div className="mt-7 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?
            </p>

            <button
              type="button"
              onClick={onCreateProfile}
              className="mt-3 w-full py-3.5 rounded-xl bg-gray-800/80 border border-gray-700 hover:border-green-700 hover:bg-green-950/20 text-green-400 hover:text-green-300 font-bold transition-all duration-300 hover:-translate-y-0.5"
            >
              SignUp
            </button>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="text-center mt-7">
          <div className="flex items-center justify-center gap-2 text-gray-600 text-xs">
            <span>🌱</span>
            <span>Smart technology for modern farming</span>
          </div>

          <p className="text-gray-700 text-[11px] mt-2">
            © 2026 FarmerDetect • Hackathon MVP
          </p>
        </div>
      </div>

      {/* ================= ANIMATIONS ================= */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(25px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Login;