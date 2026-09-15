import React, { useState } from "react";
import { CheckCircle2, Leaf, Save, Sprout, Sun } from "lucide-react";
import { motion } from "motion/react";
import { PageHeader, PageIntro } from "./PageChrome";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

function FarmingPreferences({ onBack }) {
  const [category, setCategory] = useState("");
  const [season, setSeason] = useState("");
  const [crop, setCrop] = useState("");
  const [saved, setSaved] = useState(false);

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

  const handleSave = () => {
    if (!category || !season || !crop) {
      alert("Please select Category, Season and Crop.");
      return;
    }

    setSaved(true);
  };

  return (
    <div className="fd-page">
      <PageHeader onBack={onBack} />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 md:py-12">
        <PageIntro
          eyebrow="Farm setup"
          title="Farming preferences"
          subtitle="Select your farming category, season and crop."
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <Card>
            <CardContent className="p-5 sm:p-8">
              <div className="mb-6">
                <label className="fd-label">
                  <span className="inline-flex items-center gap-2">
                    <Sprout className="h-4 w-4 text-farm-600" />
                    Farming Category
                  </span>
                </label>

                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setCrop("");
                    setSaved(false);
                  }}
                  className="fd-input"
                >
                  <option value="">Select Category</option>

                  {Object.keys(crops).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="fd-label">
                  <span className="inline-flex items-center gap-2">
                    <Sun className="h-4 w-4 text-farm-600" />
                    Farming Season
                  </span>
                </label>

                <select
                  value={season}
                  onChange={(e) => {
                    setSeason(e.target.value);
                    setSaved(false);
                  }}
                  className="fd-input"
                >
                  <option value="">Select Season</option>
                  <option value="Kharif">🌧️ Kharif</option>
                  <option value="Rabi">❄️ Rabi</option>
                  <option value="Zaid">☀️ Zaid</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="fd-label">
                  <span className="inline-flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-farm-600" />
                    Select Crop
                  </span>
                </label>

                <select
                  value={crop}
                  onChange={(e) => {
                    setCrop(e.target.value);
                    setSaved(false);
                  }}
                  disabled={!category}
                  className="fd-input"
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

              <Button type="button" className="w-full" size="lg" onClick={handleSave}>
                <Save />
                Save Farming Preferences
              </Button>

              {saved && (
                <div className="mt-6 rounded-2xl border border-farm-200 bg-farm-50 p-4 text-center">
                  <p className="inline-flex items-center gap-2 font-semibold text-farm-800">
                    <CheckCircle2 className="h-4 w-4" />
                    Preferences Saved Successfully!
                  </p>

                  <p className="mt-2 text-sm text-stone-600">
                    {category} • {season} • {crop}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default FarmingPreferences;
