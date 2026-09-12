const mongoose = require("mongoose");

const detectionReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    imageUrl: { type: String, default: "" },
    crop: { type: String, required: true },
    disease: { type: String, required: true },
    confidence: { type: Number, required: true, min: 0, max: 100 },
    severity: { type: String, required: true },
    recommendation: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DetectionReport", detectionReportSchema);
