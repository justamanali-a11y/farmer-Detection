import React, { useState } from "react";

function DetectDisease({ onBack }) {
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
      setImageName(file.name);
      setResult(null);
    }
  };

  const detectCrop = () => {
    if (!image) return;

    setLoading(true);

    setTimeout(() => {
      setResult({
        crop: "Tomato",
        disease: "Early Blight",
        confidence: "94%",
        severity: "Moderate",
        recommendation:
          "Remove infected leaves, improve air circulation and avoid overhead watering. Use suitable fungicide if required.",
      });

      setLoading(false);
    }, 1500);
  };

  const removeImage = () => {
    setImage(null);
    setImageName("");
    setResult(null);
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
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800">
            🌿 Detect Crop Disease
          </h2>

          <p className="text-gray-600 mt-2">
            Upload a crop leaf image to detect possible diseases.
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <label className="block border-2 border-dashed border-green-400 rounded-xl p-10 text-center cursor-pointer hover:bg-green-50">
            <div className="text-5xl mb-4">📷</div>

            <p className="text-lg font-semibold text-gray-700">
              Click to upload crop image
            </p>

            <p className="text-sm text-gray-500 mt-2">
              JPG, PNG or JPEG
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
          </label>

          {/* Image Preview */}
          {image && (
            <div className="mt-6 text-center">
              <img
                src={image}
                alt="Crop Preview"
                className="mx-auto w-72 h-64 object-cover rounded-xl shadow"
              />

              <p className="mt-3 text-gray-600">
                📄 {imageName}
              </p>

              <div className="flex justify-center gap-3 mt-5">
                <button
                  onClick={detectCrop}
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? "🔍 Detecting..." : "🔍 Detect Disease"}
                </button>

                <button
                  onClick={removeImage}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-green-700 mb-5">
                ✅ Detection Result
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-gray-500">Crop</p>
                  <p className="font-bold text-lg">🌱 {result.crop}</p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-gray-500">Disease</p>
                  <p className="font-bold text-lg text-red-600">
                    🦠 {result.disease}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-gray-500">Confidence</p>
                  <p className="font-bold text-lg">
                    {result.confidence}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-gray-500">Severity</p>
                  <p className="font-bold text-lg">
                    ⚠️ {result.severity}
                  </p>
                </div>
              </div>

              <div className="mt-5 bg-white p-5 rounded-lg">
                <p className="font-bold text-gray-700 mb-2">
                  💡 Recommendation
                </p>

                <p className="text-gray-600">
                  {result.recommendation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetectDisease;