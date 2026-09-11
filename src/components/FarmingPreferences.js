import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function FarmingPreferences({ onBack }) {
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { category = "", season = "", crop = "" } = preferences;
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/auth/preferences`, { credentials: "include" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not load preferences.");
        setPreferences(data.preferences || {});
      })
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, []);

  const crops = {
    "🌾 Anaj / Grains": ["Wheat", "Rice", "Maize", "Bajra", "Barley"],
    "🥬 Vegetables": [
      "Tomato",
      "Potato",
      "Onion",
      "Brinjal",
      "Cauliflower",
    ],
    "🍎 Fruits": [
      "Mango",
      "Apple",
      "Guava",
      "Papaya",
      "Banana",
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

  const handleSave = async () => {
    if (!category || !season || !crop) {
      alert("Please select Category, Season and Crop.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/preferences`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ category, season, crop }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not save preferences.");
      setPreferences(data.preferences);
      setSaved(true);
      setError("");
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  const updatePreference = (name, value) => {
    setPreferences((current) => ({ ...current, [name]: value }));
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-700">
          🌾 FarmerDetect
        </h1>

        <button
          onClick={onBack}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
        >
          ← Back
        </button>
      </nav>

      {/* Main */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        {loading && <p className="text-center text-gray-600 mb-4">Loading preferences...</p>}
        {error && <p className="text-center text-red-600 mb-4">{error}</p>}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800">
            🌾 Farming Preferences
          </h2>

          <p className="text-gray-600 mt-2">
            Select your farming category, season and crop.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-8">

          {/* Category */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2">
              🌱 Farming Category
            </label>

            <select
              value={category}
              onChange={(e) => {
                setPreferences((current) => ({
                  ...current,
                  category: e.target.value,
                  crop: "",
                }));
                setSaved(false);
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Category</option>

              {Object.keys(crops).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Season */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2">
              ☀️ Farming Season
            </label>

            <select
              value={season}
              onChange={(e) => updatePreference("season", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Season</option>
              <option value="Kharif">🌧️ Kharif</option>
              <option value="Rabi">❄️ Rabi</option>
              <option value="Zaid">☀️ Zaid</option>
            </select>
          </div>

          {/* Crop */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2">
              🌾 Select Crop
            </label>

            <select
              value={crop}
              onChange={(e) => updatePreference("crop", e.target.value)}
              disabled={!category}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">
                {category
                  ? "Select Crop"
                  : "First select farming category"}
              </option>

              {category &&
                crops[category].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
            </select>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            💾 Save Farming Preferences
          </button>

          {/* Saved Message */}
          {saved && (
            <div className="mt-6 bg-green-100 border border-green-300 rounded-lg p-4 text-center">
              <p className="text-green-700 font-semibold">
                ✅ Preferences Saved Successfully!
              </p>

              <p className="text-gray-600 mt-2">
                {category} • {season} • {crop}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FarmingPreferences;