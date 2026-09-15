import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  MapPin,
  Pencil,
  UserRound,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

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
  const [errors, setErrors] = useState({});

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
    const savedProfile = localStorage.getItem("farmerProfile");

    if (savedProfile) {
      try {
        const data = JSON.parse(savedProfile);

        setProfile(data);

        setFormData({
          name: data.name || "",
          email: data.email || "",
          password: "",
          phone: data.phone || "",
          location: data.location || "",
          farmSize: data.farmSize || "",
          crop: data.crop || "",
          category: data.category || "",
          season: data.season || "",
        });

        setProfileImage(data.profileImage || "");
      } catch (error) {
        console.error("Profile data error:", error);
      }
    }
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

    setSaved(false);
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

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result);

      setErrors((prev) => ({
        ...prev,
        profileImage: "",
      }));
    };

    reader.readAsDataURL(file);
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

    // Password
    if (isCreating) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      if (!formData.password) {
        newErrors.password = "Password is required.";
      } else if (!passwordRegex.test(formData.password)) {
        newErrors.password =
          "Password must be 8+ characters with uppercase, lowercase and number.";
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

  const handleSave = () => {
    setSaved(false);

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const existingProfile = JSON.parse(
      localStorage.getItem("farmerProfile") || "null"
    );

    // Check duplicate email during new profile creation
    if (
      isCreating &&
      existingProfile &&
      existingProfile.email?.toLowerCase() ===
        formData.email.trim().toLowerCase()
    ) {
      setErrors({
        email:
          "This email is already registered. Please use another email.",
      });

      return;
    }

    // ================= IMPORTANT =================
    // Editing profile should NOT remove old password.

    const updatedProfile = {
      ...(existingProfile || {}),

      name: formData.name.trim(),

      email: formData.email.trim().toLowerCase(),

      // New profile -> new password
      // Edit profile -> old password
      password: isCreating
        ? formData.password
        : existingProfile?.password,

      phone: formData.phone.trim(),

      location: formData.location,

      farmSize: formData.farmSize,

      crop: formData.crop,

      category: formData.category,

      season: formData.season,

      profileImage: profileImage,
    };

    // Save in localStorage
    localStorage.setItem(
      "farmerProfile",
      JSON.stringify(updatedProfile)
    );

    // Password ko UI state mein hide rakho
    const profileForState = {
      ...updatedProfile,
      password: undefined,
    };

    setProfile(profileForState);

    setFormData({
      name: updatedProfile.name,
      email: updatedProfile.email,
      password: "",
      phone: updatedProfile.phone,
      location: updatedProfile.location,
      farmSize: updatedProfile.farmSize,
      crop: updatedProfile.crop,
      category: updatedProfile.category,
      season: updatedProfile.season,
    });

    setIsCreating(false);
    setIsEditing(false);
    setSaved(true);

    // App ko inform karo
    if (onProfileCreated) {
      onProfileCreated(profileForState);
    }
  };

  // ================= CREATE PROFILE =================

  const startCreating = () => {
    setIsCreating(true);
    setIsEditing(false);

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

    setIsCreating(false);
    setIsEditing(true);
    setErrors({});
    setSaved(false);
  };

  // ================= CANCEL =================

  const handleCancel = () => {
    if (profile) {
      setIsCreating(false);
      setIsEditing(false);
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
      <div className="fd-page px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-farm-900">
                {isCreating
                  ? "Create Farmer Profile"
                  : "Edit Farmer Profile"}
              </h1>

              <p className="text-stone-500 mt-2">
                Enter your farming details carefully.
              </p>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCancel}
              className="self-start"
            >
              <ArrowLeft />
              Back
            </Button>
          </div>

          <Card>
            <CardContent className="p-5 sm:p-8">

            <div className="flex flex-col items-center mb-8">

              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-farm-100 shadow-soft"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-farm-50 border border-farm-100 flex items-center justify-center text-farm-600 shadow-soft">
                  <UserRound className="h-10 w-10" />
                </div>
              )}

              <label className="mt-4 cursor-pointer">
                <span className="inline-flex h-10 items-center gap-2 rounded-xl bg-farm-600 px-4 text-sm font-semibold text-white shadow-soft hover:bg-farm-500">
                  <Camera className="h-4 w-4" />
                  Upload Photo
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {errors.profileImage && (
                <p className="text-red-600 text-sm mt-2 font-medium">
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
              error={errors.email}
            />

            {/* Password only during create */}

            {isCreating && (
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                error={errors.password}
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

            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8">

              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleSave}
                className="flex-1"
              >
                {isCreating
                  ? "Create Profile"
                  : "Save Changes"}
              </Button>

            </div>

            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ================= NO PROFILE =================

  if (!profile) {
    return (
      <div className="fd-page flex items-center justify-center px-4 py-10">

        <motion.div
          className="max-w-md w-full"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
        <Card>
          <CardContent className="p-8 sm:p-10 text-center">

          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-farm-100 bg-farm-50 text-farm-600 shadow-soft">
            <UserRound className="h-10 w-10" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-farm-900 mb-3">
            Create Your Farmer Profile
          </h1>

          <p className="text-stone-500 mb-8 leading-relaxed">
            Add your farming details to get personalized
            crop disease recommendations.
          </p>

          <Button
            type="button"
            onClick={startCreating}
            className="w-full"
            size="lg"
          >
            Create Profile
          </Button>

          {onBack && (
            <Button
              type="button"
              variant="secondary"
              onClick={onBack}
              className="w-full mt-3"
              size="lg"
            >
              Back
            </Button>
          )}

          </CardContent>
        </Card>
        </motion.div>

      </div>
    );
  }

  // ================= PROFILE VIEW =================

  return (
    <div className="fd-page px-4 py-8 md:py-12">

      <div className="max-w-3xl mx-auto">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-farm-900">
              Farmer Profile
            </h1>

            <p className="text-stone-500 mt-2">
              Your farming information
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onBack}
            className="self-start"
          >
            <ArrowLeft />
            Back
          </Button>

        </div>

        {saved && (
          <div className="mb-6 p-4 rounded-2xl bg-farm-50 border border-farm-200 text-farm-800 font-medium flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Profile saved successfully.
          </div>
        )}

        <Card>
          <CardContent className="p-5 sm:p-8">

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">

            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Farmer"
                className="w-28 h-28 rounded-full object-cover border-4 border-farm-100 shadow-soft"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-farm-50 border border-farm-100 flex items-center justify-center text-farm-600 shadow-soft">
                <UserRound className="h-12 w-12" />
              </div>
            )}

            <div className="text-center sm:text-left">

              <h2 className="text-2xl font-extrabold text-farm-900">
                {profile.name}
              </h2>

              <p className="text-stone-500 mt-1">
                {profile.email}
              </p>

              {profile.location && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-farm-700">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </p>
              )}

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

          <Button
            type="button"
            onClick={startEditing}
            className="w-full mt-8"
            size="lg"
          >
            <Pencil />
            Edit Profile
          </Button>

          </CardContent>
        </Card>

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
}) {
  return (
    <div className="mb-5">

      <label className="fd-label">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className={`fd-input ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
            : ""
        }`}
      />

      {error && (
        <p className="text-red-600 text-sm mt-1 font-medium">
          {error}
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

      <label className="fd-label">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`fd-input ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
            : ""
        }`}
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
        <p className="text-red-600 text-sm mt-1 font-medium">
          {error}
        </p>
      )}

    </div>
  );
}

// ================= PROFILE ITEM =================

function ProfileItem({ label, value }) {
  return (
    <div className="bg-farm-50/80 border border-farm-100 rounded-xl p-4">

      <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-1">
        {label}
      </p>

      <p className="font-semibold text-farm-900 break-words">
        {value || "Not provided"}
      </p>

    </div>
  );
}

export default FarmerProfile;