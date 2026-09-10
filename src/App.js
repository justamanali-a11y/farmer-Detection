import React, { useState } from "react";
import Login from "./Login";
import FarmerProfile from "./components/FarmerProfile";
import FarmingPreferences from "./components/FarmingPreferences";
import DetectDisease from "./components/DetectDisease";

function App() {
  // ================= LOGIN SESSION =================

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  // ================= CURRENT PAGE =================

  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem("currentPage") || "home";
  });

  // ================= PROFILE =================

  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem("farmerProfile");

    if (!savedProfile) return null;

    try {
      const data = JSON.parse(savedProfile);

      return {
        ...data,
        password: undefined,
      };
    } catch (error) {
      console.error("Profile loading error:", error);
      return null;
    }
  });

  // ================= MOBILE MENU =================

  const [mobileMenu, setMobileMenu] = useState(false);

  // ================= TOAST =================

  const [toast, setToast] = useState("");

  // ================= TOAST FUNCTION =================

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  // ================= NAVIGATION =================

  const navigateTo = (page) => {
    setCurrentPage(page);

    localStorage.setItem("currentPage", page);

    setMobileMenu(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= LOGIN =================

  const handleLogin = (loginEmail, loginPassword) => {
    const email = loginEmail.trim().toLowerCase();

    if (!email || !loginPassword) {
      showToast("⚠️ Please enter email and password.");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(email)) {
      showToast("⚠️ Please enter a valid email.");
      return;
    }

    const savedProfile =
      localStorage.getItem("farmerProfile");

    if (!savedProfile) {
      showToast(
        "🌱 No account found. Create your profile first."
      );
      return;
    }

    let farmer;

    try {
      farmer = JSON.parse(savedProfile);
    } catch (error) {
      console.error("Profile parsing error:", error);

      showToast(
        "❌ Profile data is corrupted. Please create it again."
      );

      return;
    }

    const savedEmail = String(farmer.email || "")
      .trim()
      .toLowerCase();

    const savedPassword = String(
      farmer.password || ""
    );

    // Email check

    if (email !== savedEmail) {
      showToast(
        "❌ Email is not registered."
      );
      return;
    }

    // Password check

    if (loginPassword !== savedPassword) {
      showToast(
        "❌ Incorrect password."
      );
      return;
    }

    // Login successful

    setProfile({
      ...farmer,
      password: undefined,
    });

    setIsLoggedIn(true);
    setCurrentPage("home");

    localStorage.setItem(
      "isLoggedIn",
      "true"
    );

    localStorage.setItem(
      "currentPage",
      "home"
    );

    showToast(
      "🌾 Welcome back to FarmerDetect!"
    );
  };

  // ================= DEMO LOGIN =================

  const handleDemoAccount = () => {
    const demoProfile = {
      name: "Demo Farmer",
      email: "demo@gmail.com",
      password: "Demo1234",
      phone: "9876543210",
      location: "Jaipur, Rajasthan",
      farmSize: "5",
      crop: "Tomato",
      category: "🥬 Vegetables",
      season: "Kharif",
      profileImage: "",
    };

    localStorage.setItem(
      "farmerProfile",
      JSON.stringify(demoProfile)
    );

    setProfile({
      ...demoProfile,
      password: undefined,
    });

    setIsLoggedIn(true);
    setCurrentPage("home");

    localStorage.setItem(
      "isLoggedIn",
      "true"
    );

    localStorage.setItem(
      "currentPage",
      "home"
    );

    showToast(
      "🚜 Demo account logged in!"
    );
  };

  // ================= LOGOUT =================

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("home");
    setProfile(null);
    setMobileMenu(false);

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentPage");

    showToast(
      "👋 Logged out successfully."
    );
  };

  // =====================================================
  // NEW PROFILE
  // =====================================================

  if (
    currentPage === "profile" &&
    !isLoggedIn
  ) {
    return (
      <>
        <FarmerProfile
          onBack={() => {
            setCurrentPage("home");

            localStorage.setItem(
              "currentPage",
              "home"
            );
          }}
          onProfileCreated={(newProfile) => {
            localStorage.setItem(
              "farmerProfile",
              JSON.stringify(newProfile)
            );

            setProfile({
              ...newProfile,
              password: undefined,
            });

            setIsLoggedIn(true);
            setCurrentPage("home");

            localStorage.setItem(
              "isLoggedIn",
              "true"
            );

            localStorage.setItem(
              "currentPage",
              "home"
            );

            showToast(
              "🌾 Profile created! Welcome to FarmerDetect."
            );
          }}
        />
      </>
    );
  }

  // ================= LOGIN =================

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={handleLogin}
        onDemoLogin={handleDemoAccount}
        onCreateProfile={() => {
          setCurrentPage("profile");

          localStorage.setItem(
            "currentPage",
            "profile"
          );
        }}
      />
    );
  }

  // ================= PROFILE =================

  if (currentPage === "profile") {
    return (
      <FarmerProfile
        onBack={() => navigateTo("home")}
        onProfileCreated={(updatedProfile) => {
          localStorage.setItem(
            "farmerProfile",
            JSON.stringify(updatedProfile)
          );

          setProfile({
            ...updatedProfile,
            password: undefined,
          });

          setIsLoggedIn(true);
          setCurrentPage("home");

          localStorage.setItem(
            "isLoggedIn",
            "true"
          );

          localStorage.setItem(
            "currentPage",
            "home"
          );

          showToast(
            "✅ Profile updated successfully!"
          );
        }}
      />
    );
  }

  // ================= PREFERENCES =================

  if (currentPage === "preferences") {
    return (
      <FarmingPreferences
        onBack={() => navigateTo("home")}
      />
    );
  }

  // ================= DETECTION =================

  if (currentPage === "detect") {
    return (
      <DetectDisease
        onBack={() => navigateTo("home")}
      />
    );
  }

  // =====================================================
  // HOME PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-green-950/20 to-gray-950 text-white">

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
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-10px);
            }
          }

          .page-enter {
            animation: fadeIn 0.5s ease-out;
          }

          .slide-up {
            animation: slideUp 0.6s ease-out;
          }

          .float {
            animation: float 3s ease-in-out infinite;
          }
        `}
      </style>

      {/* ================= TOAST ================= */}

      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">

          <div className="bg-gray-900/95 backdrop-blur-xl border border-green-700/50 shadow-2xl rounded-2xl px-5 py-4 text-center font-medium animate-[slideUp_.3s_ease-out]">
            {toast}
          </div>

        </div>
      )}

      {/* ================= NAVBAR ================= */}

      <nav className="sticky top-0 z-50 bg-gray-950/85 backdrop-blur-xl border-b border-green-900/40">

        <div className="max-w-7xl mx-auto px-4 py-3">

          <div className="flex items-center justify-between">

            {/* LOGO */}

            <button
              onClick={() => navigateTo("home")}
              className="flex items-center gap-3 group"
            >

              <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-2xl group-hover:scale-105 group-hover:bg-green-500/20 transition-all duration-300">
                🌾
              </div>

              <div className="text-left">

                <h1 className="text-xl font-extrabold tracking-tight">
                  Farmer
                  <span className="text-green-400">
                    Detect
                  </span>
                </h1>

                <p className="text-[9px] tracking-[0.2em] text-gray-500">
                  SMART FARMING
                </p>

              </div>

            </button>

            {/* DESKTOP NAV */}

            <div className="hidden md:flex items-center gap-1">

              <NavButton
                active={currentPage === "home"}
                onClick={() => navigateTo("home")}
              >
                🏠 Home
              </NavButton>

              <NavButton
                active={currentPage === "profile"}
                onClick={() => navigateTo("profile")}
              >
                👨‍🌾 Profile
              </NavButton>

              <NavButton
                active={
                  currentPage === "preferences"
                }
                onClick={() =>
                  navigateTo("preferences")
                }
              >
                🌱 Preferences
              </NavButton>

              <NavButton
                active={currentPage === "detect"}
                onClick={() => navigateTo("detect")}
              >
                🔬 Detect
              </NavButton>

              <button
                onClick={handleLogout}
                className="ml-3 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                Logout
              </button>

            </div>

            {/* MOBILE MENU BUTTON */}

            <button
              onClick={() =>
                setMobileMenu(!mobileMenu)
              }
              className="md:hidden w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 hover:border-green-700 transition-all"
            >
              {mobileMenu ? "✕" : "☰"}
            </button>

          </div>

          {/* MOBILE MENU */}

          {mobileMenu && (
            <div className="md:hidden mt-4 pb-3 space-y-2 animate-[slideUp_.3s_ease-out]">

              <MobileNavButton
                onClick={() => navigateTo("home")}
              >
                🏠 Home
              </MobileNavButton>

              <MobileNavButton
                onClick={() => navigateTo("profile")}
              >
                👨‍🌾 Profile
              </MobileNavButton>

              <MobileNavButton
                onClick={() =>
                  navigateTo("preferences")
                }
              >
                🌱 Farming Preferences
              </MobileNavButton>

              <MobileNavButton
                onClick={() => navigateTo("detect")}
              >
                🔬 Disease Detection
              </MobileNavButton>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
              >
                🚪 Logout
              </button>

            </div>
          )}

        </div>

      </nav>

      {/* ================= MAIN ================= */}

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-14 page-enter">

        {/* ================= HERO ================= */}

        <section className="relative overflow-hidden rounded-3xl border border-green-800/40 bg-gradient-to-br from-green-900/30 via-gray-900/90 to-gray-900 p-6 md:p-12">

          {/* Glow */}

          <div className="absolute -top-32 -right-20 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />

          <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">

            {/* LEFT */}

            <div className="slide-up">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs md:text-sm mb-5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Smart Agriculture Platform
              </div>

              <h1 className="text-4xl md:text-6xl font-black leading-[1.08]">

                Grow Smarter.
                <br />

                <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                  Farm Better.
                </span>

              </h1>

              <p className="text-gray-400 mt-5 text-base md:text-lg leading-relaxed max-w-xl">
                Detect crop diseases, manage your
                farming preferences and make smarter
                decisions for healthier crops.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-7">

                <button
                  onClick={() =>
                    navigateTo("detect")
                  }
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 font-bold shadow-xl shadow-green-900/30 transition-all duration-300 hover:-translate-y-1"
                >
                  🔬 Detect Crop Disease
                </button>

                <button
                  onClick={() =>
                    navigateTo("preferences")
                  }
                  className="px-6 py-3.5 rounded-xl bg-gray-800/80 border border-gray-700 hover:border-green-600 hover:bg-green-950/30 font-semibold transition-all duration-300"
                >
                  🌱 Preferences
                </button>

              </div>

            </div>

            {/* RIGHT */}

            <div className="flex justify-center">

              <div className="relative float">

                <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">

                  <div className="w-44 h-44 md:w-56 md:h-56 rounded-full bg-green-600/10 border border-green-500/20 flex items-center justify-center">

                    <span className="text-8xl md:text-9xl">
                      👨‍🌾
                    </span>

                  </div>

                </div>

                <div className="absolute -top-3 right-0 px-3 py-2 rounded-xl bg-gray-900/95 border border-green-800 text-green-400 text-xs md:text-sm shadow-xl">
                  🌿 Healthy Crops
                </div>

                <div className="absolute bottom-4 -left-6 px-3 py-2 rounded-xl bg-gray-900/95 border border-green-800 text-green-400 text-xs md:text-sm shadow-xl">
                  🤖 AI Detection
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ================= WELCOME ================= */}

        <section className="mt-10 slide-up">

          <p className="text-green-400 text-sm font-semibold">
            Welcome back, Farmer 👋
          </p>

          <h2 className="text-3xl md:text-4xl font-extrabold mt-1">
            Hello, {profile?.name || "Farmer"}!
          </h2>

          <p className="text-gray-500 mt-2">
            What would you like to do today?
          </p>

        </section>

        {/* ================= FEATURE CARDS ================= */}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-7">

          <FeatureCard
            icon="🔬"
            title="Crop Disease Detection"
            description="Upload a crop image and identify possible diseases with AI-powered detection."
            button="Start Detection"
            color="green"
            onClick={() => navigateTo("detect")}
          />

          <FeatureCard
            icon="👨‍🌾"
            title="Farmer Profile"
            description="Manage your personal and farming details in one secure place."
            button="View Profile"
            color="emerald"
            onClick={() => navigateTo("profile")}
          />

          <FeatureCard
            icon="🌱"
            title="Farming Preferences"
            description="Select crop category, crop and season for personalized results."
            button="Set Preferences"
            color="lime"
            onClick={() =>
              navigateTo("preferences")
            }
          />

        </section>

        {/* ================= QUICK STATS ================= */}

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

          <StatCard
            icon="🌱"
            title="Main Crop"
            value={profile?.crop || "Not set"}
          />

          <StatCard
            icon="📐"
            title="Farm Size"
            value={
              profile?.farmSize
                ? `${profile.farmSize} Acres`
                : "Not set"
            }
          />

          <StatCard
            icon="☀️"
            title="Season"
            value={profile?.season || "Not set"}
          />

          <StatCard
            icon="📍"
            title="Location"
            value={profile?.location || "Not set"}
          />

        </section>

        {/* ================= FARM OVERVIEW ================= */}

        <section className="mt-8">

          <div className="bg-gray-900/80 backdrop-blur-xl border border-green-900/40 rounded-3xl p-6 md:p-7">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold">
                  🌾 Farm Overview
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Your current farming information
                </p>

              </div>

              <button
                onClick={() =>
                  navigateTo("profile")
                }
                className="text-green-400 text-sm font-semibold hover:text-green-300 transition"
              >
                Edit →
              </button>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

              <OverviewItem
                icon="📍"
                label="LOCATION"
                value={
                  profile?.location || "Not set"
                }
              />

              <OverviewItem
                icon="🌱"
                label="MAIN CROP"
                value={
                  profile?.crop || "Not set"
                }
              />

              <OverviewItem
                icon="📐"
                label="FARM SIZE"
                value={
                  profile?.farmSize
                    ? `${profile.farmSize} Acres`
                    : "Not set"
                }
              />

              <OverviewItem
                icon="☀️"
                label="SEASON"
                value={
                  profile?.season || "Not set"
                }
              />

            </div>

          </div>

        </section>

        {/* ================= CTA ================= */}

        <section className="mt-8">

          <div className="relative overflow-hidden rounded-3xl border border-green-800/40 bg-gradient-to-r from-green-900/30 to-emerald-900/20 p-6 md:p-8">

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">

              <div>

                <p className="text-green-400 text-sm font-semibold">
                  🌿 Smart Farming Starts Here
                </p>

                <h2 className="text-2xl md:text-3xl font-bold mt-1">
                  Ready to check your crop?
                </h2>

                <p className="text-gray-400 mt-2 text-sm">
                  Upload your crop image and start
                  disease detection.
                </p>

              </div>

              <button
                onClick={() =>
                  navigateTo("detect")
                }
                className="shrink-0 px-6 py-3.5 rounded-xl bg-green-600 hover:bg-green-500 font-bold shadow-lg shadow-green-900/30 transition-all duration-300 hover:-translate-y-1"
              >
                Start Detection →
              </button>

            </div>

          </div>

        </section>

      </main>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-green-900/30 mt-10">

        <div className="max-w-7xl mx-auto px-4 py-8 text-center">

          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-xl">
              🌾
            </span>

            <span className="font-bold">
              Farmer
              <span className="text-green-400">
                Detect
              </span>
            </span>
          </div>

          <p className="text-gray-500 text-sm">
            Smart technology for modern farming
          </p>

          <p className="text-gray-700 text-xs mt-2">
            Built for farmers • Powered by technology
          </p>

          <p className="text-gray-700 text-xs mt-1">
            © 2026 FarmerDetect • Hackathon MVP
          </p>

        </div>

      </footer>

    </div>
  );
}

// =====================================================
// NAV BUTTON
// =====================================================

function NavButton({
  children,
  onClick,
  active,
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
        active
          ? "bg-green-500/10 text-green-400 border border-green-500/20"
          : "text-gray-400 hover:text-green-400 hover:bg-green-900/20"
      }`}
    >
      {children}
    </button>
  );
}

// =====================================================
// MOBILE NAV BUTTON
// =====================================================

function MobileNavButton({
  children,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:border-green-700 hover:text-green-400 transition-all duration-300"
    >
      {children}
    </button>
  );
}

// =====================================================
// FEATURE CARD
// =====================================================

function FeatureCard({
  icon,
  title,
  description,
  button,
  onClick,
  color,
}) {
  const colorClasses = {
    green:
      "bg-green-600 hover:bg-green-500",
    emerald:
      "bg-emerald-700 hover:bg-emerald-600",
    lime:
      "bg-lime-700 hover:bg-lime-600",
  };

  return (
    <div className="group bg-gray-900/80 backdrop-blur-xl border border-green-900/40 hover:border-green-600/60 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-green-950/20">

      <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/10 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>

      <h3 className="text-xl font-bold">
        {title}
      </h3>

      <p className="text-gray-400 mt-2 text-sm leading-relaxed min-h-[60px]">
        {description}
      </p>

      <button
        onClick={onClick}
        className={`mt-6 w-full py-3 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 ${colorClasses[color]}`}
      >
        {button} →
      </button>

    </div>
  );
}

// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-4 hover:border-green-800 transition-all duration-300">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-lg">
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-gray-500 text-xs">
            {title}
          </p>

          <p className="font-bold mt-1 truncate">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}

// =====================================================
// OVERVIEW ITEM
// =====================================================

function OverviewItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl bg-gray-950/60 border border-gray-800 p-4 hover:border-green-800/60 hover:bg-green-950/10 transition-all duration-300">

      <div className="flex items-center gap-3">

        <span className="text-xl">
          {icon}
        </span>

        <div className="min-w-0">

          <p className="text-gray-500 text-[10px] tracking-wider">
            {label}
          </p>

          <p className="font-semibold mt-1 truncate">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}

export default App;