import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function FarmerProfile({
  onBack,
  onProfileCreated,
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    farmSize: "",
    crop: "",
    category: "",
    season: "",
  });

  const [profileImage, setProfileImage] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // ================= LOCATION OPTIONS =================

  const locations = [
    "Jaipur, Rajasthan",
    "Jodhpur, Rajasthan",
    "Kota, Rajasthan",
    "Udaipur, Rajasthan",
    "Delhi, Delhi",
    "Mumbai, Maharashtra",
    "Pune, Maharashtra",
    "Ahmedabad, Gujarat",
    "Lucknow, Uttar Pradesh",
    "Bhopal, Madhya Pradesh",
    "Indore, Madhya Pradesh",
    "Chandigarh, Punjab",
    "Patna, Bihar",
    "Kolkata, West Bengal",
    "Bengaluru, Karnataka",
    "Hyderabad, Telangana",
    "Chennai, Tamil Nadu",
  ];

  // ================= CATEGORY =================

  const categories = [
    "🌾 Anaj / Grains",
    "🥬 Vegetables",
    "🍎 Fruits",
    "🌱 Pulses",
    "🌻 Oilseeds",
  ];

  // ================= CROPS =================

  const crops = {
    "🌾 Anaj / Grains": [
      "Wheat",
      "Rice",
      "Maize",
      "Bajra",
      "Barley",
    ],

    "🥬 Vegetables": [
      "Tomato",
      "Potato",
      "Onion",
      "Brinjal",
      "Cauliflower",
      "Chilli",
      "Cabbage",
    ],

    "🍎 Fruits": [
      "Mango",
      "Apple",
      "Guava",
      "Papaya",
      "Banana",
      "Orange",
    ],

    "🌱 Pulses": [
      "Gram",
      "Moong",
      "Urad",
      "Masoor",
      "Arhar",
    ],

    "🌻 Oilseeds": [
      "Mustard",
      "Groundnut",
      "Soybean",
      "Sunflower",
    ],
  };

  const seasons = [
    "Kharif",
    "Rabi",
    "Zaid",
  ];

  // ================= LOAD PROFILE =================

  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, { credentials: "include" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data?.user) return;
        const user = data.user;
        setProfile(user);
        setFormData({
          name: user.name || "",
          email: user.email || "",
          password: "",
          phone: user.phone || "",
          location: user.location || "",
          farmSize: user.farmSize || "",
          crop: user.crop || "",
          category: user.category || "",
          season: user.season || "",
        });
        setProfileImage(user.profileImage || "");
      })
      .catch((error) => console.error("Profile loading error:", error));
  }, []);

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while user types
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (name === "email" && isCreating) {
      setEmailVerified(false);
      setOtp("");
      setOtpMessage("");
    }

    setSaved(false);
  };

  const showOtpToast = (message) => {
    setOtpMessage(message);
    window.setTimeout(() => setOtpMessage(""), 3000);
  };

  const sendOtp = async () => {
    const email = formData.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Enter a valid email address." }));
      showOtpToast("email not valid");
      return;
    }

    setOtpLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not send OTP.");
      setOtpMessage(data.message);
    } catch (error) {
      showOtpToast(error.message === "Enter a valid email address." ? "email not valid" : error.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email.trim().toLowerCase(), otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "email not valid");
      setEmailVerified(true);
      setOtpMessage(data.message);
    } catch (error) {
      setEmailVerified(false);
      setFormData((prev) => ({ ...prev, email: "" }));
      setOtp("");
      showOtpToast("email not valid");
    }
  };

  // ================= IMAGE =================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        profileImage: "Please select a valid image.",
      }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profileImage: "Image size should be less than 2MB.",
      }));
      return;
    }

    setSelectedImageFile(file);
    setProfileImage(URL.createObjectURL(file));
    setErrors((prev) => ({
      ...prev,
      profileImage: "",
    }));
  };

  // ================= VALIDATION =================

  const validateForm = () => {
    const newErrors = {};

    // Name
    const nameRegex = /^[A-Za-z ]{3,40}$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (!nameRegex.test(formData.name.trim())) {
      newErrors.name =
        "Name should contain only letters and spaces.";
    }

    // Email
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    if (isCreating && !emailVerified) {
      newErrors.email = "Please verify your email first.";
    }

    // Password
    if (isCreating) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      if (!formData.password) {
        newErrors.password = "Password is required.";
      } else if (!passwordRegex.test(formData.password)) {
        newErrors.password =
          "Password should be at least 8 characters with uppercase, lowercase and number.";
      }
    }

    // Phone
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!formData.phone.trim()) {
      newErrors.phone = "Mobile number is required.";
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone =
        "Enter a valid 10-digit Indian mobile number.";
    }

    // Location
    if (!formData.location) {
      newErrors.location = "Please select your location.";
    }

    // Farm Size
    const farmSize = Number(formData.farmSize);

    if (!formData.farmSize) {
      newErrors.farmSize = "Farm size is required.";
    } else if (
      isNaN(farmSize) ||
      farmSize <= 0 ||
      farmSize > 10000
    ) {
      newErrors.farmSize =
        "Enter a valid farm size between 0.1 and 10000 acres.";
    }

    // Category
    if (!formData.category) {
      newErrors.category = "Please select a crop category.";
    }

    // Crop
    if (!formData.crop) {
      newErrors.crop = "Please select your crop.";
    }

    // Season
    if (!formData.season) {
      newErrors.season = "Please select a farming season.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ================= SAVE PROFILE =================

  const uploadSelectedImage = async () => {
    setImageUploading(true);
    const imageData = new FormData();
    imageData.append("image", selectedImageFile);
    try {
      const imageResponse = await fetch(`${API_URL}/api/auth/profile/image`, {
        method: "POST",
        credentials: "include",
        body: imageData,
      });
      const imageResult = await imageResponse.json();
      if (!imageResponse.ok || !imageResult.imageUrl) {
        throw new Error(imageResult.message || "Could not upload profile image.");
      }
      return imageResult.imageUrl;
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async () => {
    setSaved(false);

    if (imageUploading) return;

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    let uploadedImageUrl = profileImage;
    if (!isCreating && selectedImageFile) {
      try {
        uploadedImageUrl = await uploadSelectedImage();
      } catch (error) {
        setErrors({ profileImage: error.message });
        return;
      }
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      location: formData.location,
      farmSize: Number(formData.farmSize),
      crop: formData.crop,
      category: formData.category,
      season: formData.season,
      profileImage: uploadedImageUrl,
    };

    if (isCreating) {
      payload.password = formData.password;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/${isCreating ? "register" : "profile"}`,
        {
          method: isCreating ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setErrors({ form: data.message || "Could not save profile." });
        return;
      }

      let profileForState = data.user;

      if (isCreating && selectedImageFile) {
        try {
          const imageUrl = await uploadSelectedImage();
          const refreshedProfile = await fetch(`${API_URL}/api/auth/me`, { credentials: "include" });
          const refreshedData = await refreshedProfile.json();
          if (refreshedProfile.ok && refreshedData.user.profileImage === imageUrl) profileForState = refreshedData.user;
        } catch (error) {
          setErrors({ profileImage: error.message });
          return;
        }
      }

      setProfile(profileForState);
      setSelectedImageFile(null);

      setFormData({
        name: profileForState.name,
        email: profileForState.email,
        password: "",
        phone: profileForState.phone,
        location: profileForState.location,
        farmSize: profileForState.farmSize,
        crop: profileForState.crop,
        category: profileForState.category,
        season: profileForState.season,
      });

      setIsCreating(false);
      setIsEditing(false);
      setSaved(true);

      if (onProfileCreated) onProfileCreated(profileForState);
    } catch (error) {
      setErrors({ form: "Backend se connection nahi ho paya." });
    }
  };

  // ================= CREATE PROFILE =================

  const startCreating = () => {
    setIsCreating(true);
    setIsEditing(false);
    setEmailVerified(false);
    setOtp("");
    setOtpMessage("");
    setShowPassword(false);

    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      location: "",
      farmSize: "",
      crop: "",
      category: "",
      season: "",
    });

    setProfileImage("");
    setSelectedImageFile(null);
    setErrors({});
    setSaved(false);
  };

  // ================= EDIT PROFILE =================

  const startEditing = () => {
    if (!profile) return;

    setFormData({
      name: profile.name || "",
      email: profile.email || "",
      password: "",
      phone: profile.phone || "",
      location: profile.location || "",
      farmSize: profile.farmSize || "",
      crop: profile.crop || "",
      category: profile.category || "",
      season: profile.season || "",
    });

    setProfileImage(profile.profileImage || "");
    setSelectedImageFile(null);

    setIsCreating(false);
    setIsEditing(true);
    setEmailVerified(true);
    setOtp("");
    setOtpMessage("");
    setShowPassword(false);
    setErrors({});
    setSaved(false);
  };

  // ================= CANCEL =================

  const handleCancel = () => {
    if (profile) {
      setIsCreating(false);
      setIsEditing(false);
      setOtpMessage("");
      setErrors({});
      setSaved(false);
    } else {
      if (onBack) {
        onBack();
      }
    }
  };

  // ================= CREATE / EDIT FORM =================

  if (isCreating || isEditing) {
    const availableCrops =
      crops[formData.category] || [];

    return (
      <div className="min-h-screen bg-gray-950 text-white px-4 py-8">

        {otpMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-gray-900 border border-green-700 px-5 py-3 text-sm text-green-300 shadow-xl">
            {otpMessage}
          </div>
        )}
        <div className="max-w-3xl mx-auto">

          {/* Header */}

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">
                {isCreating
                  ? "Create Farmer Profile"
                  : "Edit Farmer Profile"}
              </h1>

              <p className="text-gray-400 mt-2">
                Enter your farming details carefully.
              </p>
            </div>

            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700"
            >
              Back
            </button>
          </div>

          {/* Form Card */}

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

            {/* Profile Image */}

            <div className="flex flex-col items-center mb-8">

              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-gray-700"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-800 flex items-center justify-center text-4xl">
                  👨‍🌾
                </div>
              )}

              <label className="mt-4 cursor-pointer px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700">
                {imageUploading ? "Uploading Photo..." : "Upload Photo"}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {errors.profileImage && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.profileImage}
                </p>
              )}

            </div>

            {/* Name */}

            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              error={errors.name}
            />

            {/* Email */}

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              disabled={!isCreating}
              error={errors.email}
            />

            {isCreating && (
              <>
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={otpLoading || emailVerified}
                  className="w-full mt-2 py-2.5 rounded-lg bg-green-700 hover:bg-green-600 disabled:opacity-60 font-semibold"
                >
                  {emailVerified ? "Email Verified" : otpLoading ? "Sending OTP..." : "Send OTP"}
                </button>

                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter OTP"
                    className="flex-1 rounded-lg bg-gray-900 border border-gray-700 px-3 py-2.5 text-white outline-none focus:border-green-500"
                  />
                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={otp.length !== 6 || emailVerified}
                    className="px-4 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 font-semibold"
                  >
                    Verify OTP
                  </button>
                </div>
              </>
            )}

            {/* Password only during create */}

            {isCreating && (
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                error={errors.password}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword((current) => !current)}
              />
            )}

            {/* Phone */}

            <Input
              label="Mobile Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10);

                setFormData((prev) => ({
                  ...prev,
                  phone: value,
                }));

                setErrors((prev) => ({
                  ...prev,
                  phone: "",
                }));
              }}
              placeholder="9876543210"
              maxLength="10"
              disabled={!isCreating}
              error={errors.phone}
            />

            {/* Location */}

            <Select
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              options={locations}
              placeholder="Select your location"
              error={errors.location}
            />

            {/* Farm Size */}

            <Input
              label="Farm Size (Acres)"
              name="farmSize"
              type="number"
              min="0.1"
              max="10000"
              step="0.1"
              value={formData.farmSize}
              onChange={handleChange}
              placeholder="Example: 5"
              error={errors.farmSize}
            />

            {/* Category */}

            <Select
              label="Crop Category"
              name="category"
              value={formData.category}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  category: e.target.value,
                  crop: "",
                }));

                setErrors((prev) => ({
                  ...prev,
                  category: "",
                  crop: "",
                }));
              }}
              options={categories}
              placeholder="Select crop category"
              error={errors.category}
            />

            {/* Crop */}

            <Select
              label="Main Crop"
              name="crop"
              value={formData.crop}
              onChange={handleChange}
              options={availableCrops}
              placeholder={
                formData.category
                  ? "Select your crop"
                  : "First select category"
              }
              disabled={!formData.category}
              error={errors.crop}
            />

            {/* Season */}

            <Select
              label="Farming Season"
              name="season"
              value={formData.season}
              onChange={handleChange}
              options={seasons}
              placeholder="Select season"
              error={errors.season}
            />

            {/* Buttons */}

            <div className="flex gap-4 mt-8">

              <button
                onClick={handleCancel}
                className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 font-semibold"
              >
                {isCreating
                  ? "Create Profile"
                  : "Save Changes"}
              </button>

            </div>

          </div>
        </div>
      </div>
    );
  }

  // ================= NO PROFILE =================

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">

        <div className="max-w-md w-full text-center">

          <div className="text-7xl mb-6">
            👨‍🌾
          </div>

          <h1 className="text-3xl font-bold mb-3">
            Create Your Farmer Profile
          </h1>

          <p className="text-gray-400 mb-8">
            Add your farming details to get personalized
            crop disease recommendations.
          </p>

          <button
            onClick={startCreating}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 font-semibold"
          >
            Create Profile
          </button>

          {onBack && (
            <button
              onClick={onBack}
              className="w-full mt-3 py-3 rounded-xl bg-gray-800 hover:bg-gray-700"
            >
              Back
            </button>
          )}

        </div>

      </div>
    );
  }

  // ================= PROFILE VIEW =================

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">

      <div className="max-w-3xl mx-auto">

        {/* Header */}

        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              Farmer Profile
            </h1>

            <p className="text-gray-400 mt-2">
              Your farming information
            </p>
          </div>

          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700"
          >
            Back
          </button>

        </div>

        {/* Success Message */}

        {saved && (
          <div className="mb-6 p-4 rounded-xl bg-green-900/40 border border-green-700 text-green-300">
            ✅ Profile saved successfully.
          </div>
        )}

        {/* Profile Card */}

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

          {/* Top */}

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">

            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Farmer"
                className="w-28 h-28 rounded-full object-cover border-4 border-gray-700"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-800 flex items-center justify-center text-5xl">
                👨‍🌾
              </div>
            )}

            <div className="text-center sm:text-left">

              <h2 className="text-2xl font-bold">
                {profile.name}
              </h2>

              <p className="text-gray-400">
                {profile.email}
              </p>

            </div>

          </div>

          {/* Profile Details */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <ProfileItem
              label="Full Name"
              value={profile.name}
            />

            <ProfileItem
              label="Email"
              value={profile.email}
            />

            <ProfileItem
              label="Mobile Number"
              value={profile.phone}
            />

            <ProfileItem
              label="Location"
              value={profile.location}
            />

            <ProfileItem
              label="Farm Size"
              value={`${profile.farmSize} Acres`}
            />

            <ProfileItem
              label="Category"
              value={profile.category}
            />

            <ProfileItem
              label="Main Crop"
              value={profile.crop}
            />

            <ProfileItem
              label="Season"
              value={profile.season}
            />

          </div>

          {/* Edit */}

          <button
            onClick={startEditing}
            className="w-full mt-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold"
          >
            ✏️ Edit Profile
          </button>

        </div>

      </div>

    </div>
  );
}

// ================= INPUT COMPONENT =================

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  min,
  max,
  step,
  disabled = false,
  showPassword,
  onTogglePassword,
}) {
  return (
    <div className="mb-5">

      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>

      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`w-full px-4 ${onTogglePassword ? "pr-12" : "pr-4"} py-3 rounded-xl bg-gray-800 border ${
            error
              ? "border-red-500"
              : "border-gray-700"
          } text-white outline-none focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-60`}
        />

        {onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-sm mt-1">
          ⚠️ {error}
        </p>
      )}

    </div>
  );
}

// ================= SELECT COMPONENT =================

function Select({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled = false,
}) {
  return (
    <div className="mb-5">

      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl bg-gray-800 border ${
          error
            ? "border-red-500"
            : "border-gray-700"
        } text-white outline-none focus:border-green-500 disabled:opacity-50`}
      >

        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

      {error && (
        <p className="text-red-400 text-sm mt-1">
          ⚠️ {error}
        </p>
      )}

    </div>
  );
}

// ================= PROFILE ITEM =================

function ProfileItem({ label, value }) {
  return (
    <div className="bg-gray-800/60 rounded-xl p-4">

      <p className="text-sm text-gray-400 mb-1">
        {label}
      </p>

      <p className="font-medium break-words">
        {value || "Not provided"}
      </p>

    </div>
  );
}

export default FarmerProfile;