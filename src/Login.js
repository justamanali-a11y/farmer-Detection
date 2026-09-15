import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  MapPin,
  Sprout,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    crop: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    if (mode === "signup") {
      if (!form.name || !form.location || !form.crop) {
        setError("Please fill all required fields.");
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (form.password.length < 6) {
        setError("Password must contain at least 6 characters.");
        return;
      }

      // Signup successful
      // Existing login flow remains unchanged
      localStorage.setItem("farmerName", form.name);
      localStorage.setItem("farmerEmail", form.email);
      localStorage.setItem("farmerLocation", form.location);
      localStorage.setItem("farmerCrop", form.crop);

      onLogin();
      return;
    }

    // Existing login flow
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-700 lg:flex">
          
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-white/10" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                <Sprout className="h-7 w-7" />
              </div>

              <div>
                <h1 className="text-xl font-bold">
                  FarmerDetect
                </h1>

                <p className="text-sm text-green-100">
                  Smart Farming Assistant
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-xl text-white">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                AI Powered Agriculture
              </div>

              <h2 className="text-5xl font-bold leading-tight xl:text-6xl">
                Smarter Farming.
                <br />
                Healthier Crops.
              </h2>

              <p className="mt-6 max-w-lg text-lg leading-8 text-green-100">
                Detect crop diseases, monitor crop health and get
                useful farming insights with FarmerDetect.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-4">

                <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-bold">AI</p>
                  <p className="mt-1 text-xs text-green-100">
                    Disease Detection
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="mt-1 text-xs text-green-100">
                    Crop Assistance
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-bold">Smart</p>
                  <p className="mt-1 text-xs text-green-100">
                    Farming Insights
                  </p>
                </div>

              </div>
            </div>

            <p className="text-sm text-green-100">
              © 2026 FarmerDetect. Smart technology for modern farmers.
            </p>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-4 py-8 sm:px-8">
          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-white">
                <Sprout className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  FarmerDetect
                </h1>

                <p className="text-xs text-gray-500">
                  Smart Farming Assistant
                </p>
              </div>

            </div>

            {/* Heading */}
            <div className="mb-8">

              <h2 className="text-3xl font-bold text-gray-900">
                {mode === "login"
                  ? "Welcome back"
                  : "Create your account"}
              </h2>

              <p className="mt-2 text-gray-500">
                {mode === "login"
                  ? "Login to continue to your farming dashboard."
                  : "Join FarmerDetect and manage your farm smarter."}
              </p>

            </div>

            {/* Tabs */}
            <div className="mb-7 grid grid-cols-2 rounded-xl bg-gray-100 p-1">

              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-white text-green-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError("");
                }}
                className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                  mode === "signup"
                    ? "bg-white text-green-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Sign Up
              </button>

            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              {mode === "signup" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />
                </div>
              </div>

              {/* Location */}
              {mode === "signup" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Location
                  </label>

                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="City, State"
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    />
                  </div>
                </div>
              )}

              {/* Crop */}
              {mode === "signup" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Primary Crop
                  </label>

                  <div className="relative">
                    <Sprout className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <select
                      name="crop"
                      value={form.crop}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-gray-700 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    >
                      <option value="">Select crop</option>
                      <option value="Wheat">Wheat</option>
                      <option value="Rice">Rice</option>
                      <option value="Tomato">Tomato</option>
                      <option value="Potato">Potato</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Maize">Maize</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-12 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              {mode === "signup" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-12 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 hover:shadow-green-600/30"
              >
                {mode === "login"
                  ? "Login to FarmerDetect"
                  : "Create Farmer Account"}

                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </button>

            </form>

            {/* Bottom */}
            <p className="mt-7 text-center text-sm text-gray-500">

              {mode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}

              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setError("");
                }}
                className="font-semibold text-green-600 hover:text-green-700"
              >
                {mode === "login" ? "Sign Up" : "Login"}
              </button>

            </p>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="h-4 w-4" />
              Your farming information is kept secure.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;