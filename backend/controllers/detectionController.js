const DetectionReport = require("../models/DetectionReport");
const { predictImage } = require("../services/aiService");

exports.predict = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Please upload a crop image." });

  try {
    const prediction = await predictImage(req.file);
    if (prediction.status === "model_not_configured") {
      return res.status(503).json({ message: "AI model is not trained or configured yet." });
    }

    const confidence = Number(prediction.confidence);
    if (!prediction.crop || !prediction.disease || !Number.isFinite(confidence)) {
      return res.status(502).json({ message: "AI returned an invalid prediction." });
    }

    const report = await DetectionReport.create({
      userId: req.userId,
      imageUrl: "",
      crop: String(prediction.crop),
      disease: String(prediction.disease),
      confidence,
      severity: String(prediction.severity || "Unknown"),
      recommendation: String(prediction.recommendation || "Follow local agricultural guidance."),
    });

    res.json({
      reportId: report._id,
      crop: report.crop,
      disease: report.disease,
      confidence: report.confidence,
      severity: report.severity,
      recommendation: report.recommendation,
    });
  } catch (error) {
    console.error("Detection failed:", error.message);
    res.status(error.name === "AbortError" ? 504 : error.status || 502).json({
      message: error.name === "AbortError" ? "AI service timed out." : error.message || "Detection failed.",
    });
  }
};

exports.history = async (req, res) => {
  const reports = await DetectionReport.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(50);
  res.json({ reports });
};
