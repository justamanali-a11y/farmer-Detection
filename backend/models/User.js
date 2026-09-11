const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 40 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    farmSize: { type: Number, required: true, min: 0.1, max: 10000 },
    crop: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    season: { type: String, required: true, trim: true },
    profileImage: { type: String, default: "" },
    emailVerified: { type: Boolean, default: false },
    resetPasswordTokenHash: { type: String, select: false },
    resetPasswordExpiresAt: { type: Date, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
