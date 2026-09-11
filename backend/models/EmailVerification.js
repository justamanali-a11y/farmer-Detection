const mongoose = require("mongoose");

const emailVerificationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    verified: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
    lastSentAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailVerification", emailVerificationSchema);
