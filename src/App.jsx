import React, { useState } from "react";

import {
  Activity,
  ArrowRight,
  Home,
  Leaf,
  LogOut,
  Menu,
  ScanSearch,
  Settings2,
  ShieldAlert,
  Sprout,
  UserRound,
  Wheat,
  X,
  LayoutDashboard,
} from "lucide-react";

import { motion } from "framer-motion";

import Login from "./Login";

import FarmerDashboard from "./components/FarmerDashboard";
import FarmerProfile from "./components/FarmerProfile";
import FarmingPreferences from "./components/FarmingPreferences";
import DetectDisease from "./components/DetectDisease";
import DashboardChart from "./components/DashboardChart";

// UI Components
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("farmerLoggedIn") === "true"
  );

  const [currentPage, setCurrentPage] = useState("home");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");

  // ================= PROFILE =================

  const [profile, setProfile] = useState({
    name: localStorage.getItem("farmerName") || "Farmer",
    location:
      localStorage.getItem("farmerLocation") || "Jaipur, Rajasthan",
    crop: localStorage.getItem("farmerCrop") || "Wheat",
    farmSize:
      localStorage.getItem("farmerFarmSize") || "5 Acres",
  });

  // ================= TOAST =================

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  // ================= NAVIGATION =================

  const navigateTo = (page) => {
    setCurrentPage(page);
    setMobileMenu(false);
  };

  // ================= LOGIN =================

  const handleLogin = () => {
    localStorage.setItem("farmerLoggedIn", "true");

    // Load saved farmer data
    const savedProfile = {
      name: localStorage.getItem("farmerName") || "Farmer",
      location:
        localStorage.getItem("farmerLocation") ||
        "Jaipur, Rajasthan",
      crop: localStorage.getItem("farmerCrop") || "Wheat",
      farmSize:
        localStorage.getItem("farmerFarmSize") || "5 Acres",
    };

    setProfile(savedProfile);
    setIsLoggedIn(true);
    setCurrentPage("home");

    showToast("Welcome to FarmerDetect!");
  };

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("farmerLoggedIn");

    setIsLoggedIn(false);
    setCurrentPage("home");

    showToast("Logged out successfully");
  };

  // ================= UPDATE PROFILE =================

  const handleProfileUpdate = (updatedProfile) => {
    const newProfile = {
      ...profile,
      ...updatedProfile,
    };

    setProfile(newProfile);

    // Save profile data
    if (newProfile.name) {
      localStorage.setItem("farmerName", newProfile.name);
    }

    if (newProfile.location) {
      localStorage.setItem(
        "farmerLocation",
        newProfile.location
      );
    }

    if (newProfile.crop) {
      localStorage.setItem("farmerCrop", newProfile.crop);
    }

    if (newProfile.farmSize) {
      localStorage.setItem(
        "farmerFarmSize",
        newProfile.farmSize
      );
    }

    showToast("Profile updated successfully");
  };

  // ================= LOGIN PAGE =================

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={handleLogin}
        onNavigate={navigateTo}
      />
    );
  }

  // ================= PROFILE PAGE =================

  if (currentPage === "profile") {
    return (
      <>
        <PageChrome
          currentPage={currentPage}
          navigateTo={navigateTo}
          onLogout={handleLogout}
          mobileMenu={mobileMenu}
          setMobileMenu={setMobileMenu}
          profile={profile}
        />

        <main className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
          <FarmerProfile
            profile={profile}
            onSave={handleProfileUpdate}
            onBack={() => navigateTo("home")}
          />
        </main>

        <Toast message={toast} />
      </>
    );
  }

  // ================= DASHBOARD PAGE =================

  if (currentPage === "dashboard") {
    return (
      <>
        <PageChrome
          currentPage={currentPage}
          navigateTo={navigateTo}
          onLogout={handleLogout}
          mobileMenu={mobileMenu}
          setMobileMenu={setMobileMenu}
          profile={profile}
        />

        <main className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
          <FarmerDashboard
            profile={profile}
            navigateTo={navigateTo}
            showToast={showToast}
          />
        </main>

        <Toast message={toast} />
      </>
    );
  }

  // ================= FARMING PREFERENCES =================

  if (currentPage === "preferences") {
    return (
      <>
        <PageChrome
          currentPage={currentPage}
          navigateTo={navigateTo}
          onLogout={handleLogout}
          mobileMenu={mobileMenu}
          setMobileMenu={setMobileMenu}
          profile={profile}
        />

        <main className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
          <FarmingPreferences
            profile={profile}
            onSave={handleProfileUpdate}
            onBack={() => navigateTo("home")}
          />
        </main>

        <Toast message={toast} />
      </>
    );
  }

  // ================= DISEASE DETECTION =================

  if (currentPage === "detect") {
    return (
      <>
        <PageChrome
          currentPage={currentPage}
          navigateTo={navigateTo}
          onLogout={handleLogout}
          mobileMenu={mobileMenu}
          setMobileMenu={setMobileMenu}
          profile={profile}
        />

        <main className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
          <DetectDisease
            profile={profile}
            showToast={showToast}
            onBack={() => navigateTo("home")}
          />
        </main>

        <Toast message={toast} />
      </>
    );
  }

  // ================= HOME PAGE =================

  return (
    <div className="min-h-screen bg-gray-50">
      <PageChrome
        currentPage={currentPage}
        navigateTo={navigateTo}
        onLogout={handleLogout}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
        profile={profile}
      />

      <main>

        {/* ================= HERO ================= */}

        <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-2">

              {/* LEFT */}

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-5">
                  <Sprout className="mr-2 h-4 w-4" />
                  Smart Farming Assistant
                </Badge>

                <h1 className="max-w-3xl text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
                  Protect Your Crops with{" "}
                  <span className="text-green-600">
                    AI-Powered Detection
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                  FarmerDetect helps farmers identify crop diseases
                  from images and provides useful information for
                  better farming decisions.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    onClick={() => navigateTo("detect")}
                  >
                    <ScanSearch className="mr-2 h-5 w-5" />
                    Detect Crop Disease
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigateTo("dashboard")}
                  >
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    View Dashboard
                  </Button>
                </div>

                <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-green-600" />
                    AI Disease Detection
                  </div>

                  <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    Crop Health
                  </div>

                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Smart Insights
                  </div>
                </div>
              </motion.div>

              {/* RIGHT */}

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="overflow-hidden border-green-100 shadow-xl">

                  <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-8 text-white">
                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-sm text-green-100">
                          Current Crop
                        </p>

                        <h2 className="mt-1 text-3xl font-bold">
                          {profile.crop}
                        </h2>
                      </div>

                      <div className="rounded-2xl bg-white/20 p-4">
                        <Wheat className="h-10 w-10" />
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="rounded-xl bg-white/10 p-4">
                        <p className="text-sm text-green-100">
                          Farm Size
                        </p>

                        <p className="mt-1 text-xl font-semibold">
                          {profile.farmSize}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/10 p-4">
                        <p className="text-sm text-green-100">
                          Location
                        </p>

                        <p className="mt-1 text-xl font-semibold">
                          {profile.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          Crop Health
                        </p>

                        <p className="mt-1 text-2xl font-bold text-gray-900">
                          Good
                        </p>
                      </div>

                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                        <Leaf className="h-7 w-7 text-green-600" />
                      </div>
                    </div>

                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full w-[85%] rounded-full bg-green-500" />
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      Your crop health score is currently 85%.
                    </p>
                  </CardContent>

                </Card>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ================= QUICK ACTIONS ================= */}

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
              Farmer Tools
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Everything you need in one place
            </h2>

            <p className="mt-3 max-w-2xl text-gray-600">
              Manage your farm information, detect crop diseases
              and monitor your farming activities from one simple
              dashboard.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <FeatureCard
              icon={<ScanSearch />}
              title="Disease Detection"
              description="Upload a crop image and check for possible diseases."
              buttonText="Start Detection"
              onClick={() => navigateTo("detect")}
            />

            <FeatureCard
              icon={<LayoutDashboard />}
              title="Dashboard"
              description="View your farming information and crop insights."
              buttonText="Open Dashboard"
              onClick={() => navigateTo("dashboard")}
            />

            <FeatureCard
              icon={<UserRound />}
              title="Farmer Profile"
              description="Manage your personal and farming information."
              buttonText="View Profile"
              onClick={() => navigateTo("profile")}
            />

            <FeatureCard
              icon={<Settings2 />}
              title="Preferences"
              description="Update crop and farming preferences."
              buttonText="Manage Preferences"
              onClick={() => navigateTo("preferences")}
            />

          </div>
        </section>

        {/* ================= STATISTICS ================= */}

        <section className="border-y bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
            <div className="grid gap-8 md:grid-cols-3">

              <KpiCard
                icon={<ScanSearch />}
                value="AI"
                label="Crop Disease Detection"
              />

              <KpiCard
                icon={<Leaf />}
                value="24/7"
                label="Crop Health Assistance"
              />

              <KpiCard
                icon={<ShieldAlert />}
                value="Smart"
                label="Farming Insights"
              />

            </div>
          </div>
        </section>

        {/* ================= RECENT ACTIVITY ================= */}

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <div className="grid gap-8 lg:grid-cols-2">

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Recent Activity
                  </CardTitle>

                  <Activity className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">

                  <ActivityRow
                    icon={<ScanSearch />}
                    title="Disease Detection"
                    description="Crop image analysis completed"
                    time="Today"
                  />

                  <ActivityRow
                    icon={<Leaf />}
                    title="Crop Health"
                    description="Health status updated"
                    time="Yesterday"
                  />

                  <ActivityRow
                    icon={<UserRound />}
                    title="Profile"
                    description="Farmer profile information"
                    time="Recently"
                  />

                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Crop Health Overview
                  </CardTitle>

                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>

              <CardContent>
                <DashboardChart />
              </CardContent>
            </Card>

          </div>
        </section>

        {/* ================= CTA ================= */}

        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-white md:p-12">

            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">

              <div>
                <h2 className="text-3xl font-bold">
                  Ready to check your crop?
                </h2>

                <p className="mt-3 max-w-2xl text-green-100">
                  Upload a crop image and use FarmerDetect to
                  identify possible crop diseases.
                </p>
              </div>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigateTo("detect")}
                className="border-white bg-white text-green-700 hover:bg-green-50"
              >
                <ScanSearch className="mr-2 h-5 w-5" />
                Detect Now
              </Button>

            </div>
          </div>
        </section>

      </main>

      <Toast message={toast} />
    </div>
  );
}

/* =====================================================
   PAGE CHROME
===================================================== */

function PageChrome({
  currentPage,
  navigateTo,
  onLogout,
  mobileMenu,
  setMobileMenu,
  profile,
}) {
  const navigation = [
    {
      name: "Home",
      page: "home",
      icon: Home,
    },
    {
      name: "Dashboard",
      page: "dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Detect Disease",
      page: "detect",
      icon: ScanSearch,
    },
    {
      name: "Profile",
      page: "profile",
      icon: UserRound,
    },
    {
      name: "Preferences",
      page: "preferences",
      icon: Settings2,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">

        {/* Logo */}

        <button
          type="button"
          onClick={() => navigateTo("home")}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white">
            <Sprout className="h-6 w-6" />
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-lg font-bold text-gray-900">
              FarmerDetect
            </p>

            <p className="text-xs text-gray-500">
              Smart Farming Assistant
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}

        <nav className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.page}
                type="button"
                onClick={() => navigateTo(item.page)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  currentPage === item.page
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* User */}

        <div className="hidden items-center gap-3 lg:flex">

          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <UserRound className="h-4 w-4 text-green-700" />
            </div>

            <div className="hidden xl:block">
              <p className="text-sm font-medium text-gray-900">
                {profile?.name || "Farmer"}
              </p>

              <p className="text-xs text-gray-500">
                {profile?.location || "India"}
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onLogout}
            title="Logout"
            className="rounded-lg p-2 text-gray-600 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
          </button>

        </div>

        {/* Mobile Menu Button */}

        <button
          type="button"
          onClick={() => setMobileMenu(!mobileMenu)}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
        >
          {mobileMenu ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

      </div>

      {/* Mobile Navigation */}

      {mobileMenu && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 lg:hidden">

          <div className="space-y-1">

            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => navigateTo(item.page)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-medium ${
                    currentPage === item.page
                      ? "bg-green-100 text-green-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </button>
              );
            })}

            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>

          </div>
        </div>
      )}
    </header>
  );
}

/* =====================================================
   KPI CARD
===================================================== */

function KpiCard({ icon, value, label }) {
  return (
    <div className="flex items-center gap-5 rounded-2xl border bg-white p-6 shadow-sm">

      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
        {React.cloneElement(icon, {
          className: "h-7 w-7",
        })}
      </div>

      <div>
        <p className="text-2xl font-bold text-gray-900">
          {value}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {label}
        </p>
      </div>

    </div>
  );
}

/* =====================================================
   ACTIVITY ROW
===================================================== */

function ActivityRow({
  icon,
  title,
  description,
  time,
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
        {React.cloneElement(icon, {
          className: "h-5 w-5",
        })}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900">
          {title}
        </p>

        <p className="truncate text-sm text-gray-500">
          {description}
        </p>
      </div>

      <span className="text-xs text-gray-400">
        {time}
      </span>

    </div>
  );
}

/* =====================================================
   FEATURE CARD
===================================================== */

function FeatureCard({
  icon,
  title,
  description,
  buttonText,
  onClick,
}) {
  return (
    <Card className="group transition hover:-translate-y-1 hover:shadow-lg">

      <CardContent className="p-6">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">
          {React.cloneElement(icon, {
            className: "h-6 w-6",
          })}
        </div>

        <h3 className="mt-5 text-lg font-semibold text-gray-900">
          {title}
        </h3>

        <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-500">
          {description}
        </p>

        <button
          type="button"
          onClick={onClick}
          className="mt-5 flex items-center text-sm font-semibold text-green-600 hover:text-green-700"
        >
          {buttonText}

          <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
        </button>

      </CardContent>
    </Card>
  );
}

/* =====================================================
   TOAST
===================================================== */

function Toast({ message }) {
  if (!message) {
    return null;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-xl"
    >
      {message}
    </motion.div>
  );
}

export default App;