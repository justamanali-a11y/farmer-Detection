const bcrypt = require("bcryptjs");     // it will hash passwords
const jwt = require("jsonwebtoken");    // provide a token , used in login
const crypto = require("node:crypto");
const User = require("../models/User");
const EmailVerification = require("../models/EmailVerification");
const { sendVerificationOtp, sendPasswordResetEmail } = require("../services/emailService");
const { uploadProfileImage } = require("../services/cloudinaryService");

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  location: user.location,
  farmSize: user.farmSize,
  crop: user.crop,
  category: user.category,
  season: user.season,
  profileImage: user.profileImage,
  emailVerified: user.emailVerified,
});

const createToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const validateProfile = (body, requirePassword) => {
  const { name, email, password, phone, location, farmSize, crop, category, season } = body;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!name || !email || !phone || !location || !farmSize || !crop || !category || !season) return "All profile fields are required.";
  if (!emailPattern.test(String(email).trim())) return "Enter a valid email address.";
  if (!/^[6-9]\d{9}$/.test(String(phone).trim())) return "Enter a valid 10-digit Indian mobile number.";
  if (Number(farmSize) <= 0 || Number(farmSize) > 10000) return "Farm size must be between 0.1 and 10000 acres.";
  if (requirePassword && !passwordPattern.test(password || "")) return "Password should be at least 8 characters with uppercase, lowercase and number.";
  return null;
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

exports.sendOtp = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }
  if (await User.exists({ email })) {
    return res.status(409).json({ message: "This email is already registered." });
  }

  const existingVerification = await EmailVerification.findOne({ email });
  if (existingVerification?.lastSentAt && Date.now() - existingVerification.lastSentAt.getTime() < 60 * 1000) {
    return res.status(429).json({ message: "Please wait 60 seconds before requesting another OTP." });
  }

  const otp = crypto.randomInt(100000, 1000000).toString();
  const otpHash = await bcrypt.hash(otp, 12);
  await EmailVerification.findOneAndUpdate(
    { email },
    { email, otpHash, expiresAt: new Date(Date.now() + 10 * 60 * 1000), verified: false, attempts: 0, lastSentAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  try {
    await sendVerificationOtp(email, otp);
    res.json({ message: "OTP sent to your email." });
  } catch (error) {
    await EmailVerification.deleteOne({ email });
    console.error("Email delivery failed:", error.message);
    res.status(502).json({ message: "Could not send OTP. Please try again later." });
  }
};

exports.verifyOtp = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const otp = String(req.body.otp || "").trim();
  const verification = await EmailVerification.findOne({ email });
  if (!verification || verification.expiresAt < new Date()) {
    return res.status(400).json({ message: "email not valid" });
  }
  if (verification.attempts >= 5) {
    await EmailVerification.deleteOne({ email });
    return res.status(429).json({ message: "Too many OTP attempts. Please request a new OTP." });
  }
  const validOtp = await bcrypt.compare(otp, verification.otpHash);
  if (!validOtp) {
    verification.attempts += 1;
    await verification.save();
    return res.status(400).json({ message: "email not valid" });
  }
  verification.verified = true;
  await verification.save();
  res.json({ message: "Email verified successfully." });
};

exports.register = async (req, res) => {
  const validationError = validateProfile(req.body, true);
  if (validationError) return res.status(400).json({ message: validationError });
  const email = normalizeEmail(req.body.email);
  if (await User.findOne({ email })) return res.status(409).json({ message: "This email is already registered." });
  const verification = await EmailVerification.findOne({ email, verified: true });
  if (!verification || verification.expiresAt < new Date()) {
    return res.status(403).json({ message: "Please verify your email before creating your profile." });
  }
  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const user = await User.create({
    ...req.body,
    email,
    farmSize: Number(req.body.farmSize),
    passwordHash,
    emailVerified: true,
  });
  await EmailVerification.deleteOne({ email });
  setAuthCookie(res, createToken(user._id.toString()));
  res.status(201).json({ user: publicUser(user) });
};

exports.login = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (!email || !password) return res.status(400).json({ message: "Email and password are required." });
  if (password.length < 8) return res.status(400).json({ message: "Password should be at least 8 characters." });
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) return res.status(401).json({ message: "This email is not registered." });
  if (!(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: "Incorrect password." });
  if (!user.emailVerified) return res.status(403).json({ message: "Please verify your email before logging in." });
  setAuthCookie(res, createToken(user._id.toString()));
  res.json({ user: publicUser(user) });
};

exports.forgotPassword = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const user = await User.findOne({ email }).select("+resetPasswordTokenHash +resetPasswordExpiresAt");
  const response = { message: "If an account exists for this email, a reset link has been sent." };
  if (!user) return res.json(response);

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordTokenHash = crypto.createHash("sha256").update(token).digest("hex");
  user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/?resetToken=${token}`;
  try {
    await sendPasswordResetEmail(email, resetUrl);
  } catch (error) {
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    console.error("Password reset email failed:", error.message);
  }
  res.json(response);
};

exports.resetPassword = async (req, res) => {
  const token = String(req.body.token || "");
  const password = String(req.body.password || "");
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordPattern.test(password)) {
    return res.status(400).json({ message: "Password should be at least 8 characters with uppercase, lowercase and number." });
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpiresAt: { $gt: new Date() },
  }).select("+resetPasswordTokenHash +resetPasswordExpiresAt");
  if (!user) return res.status(400).json({ message: "Reset link is invalid or expired." });

  user.passwordHash = await bcrypt.hash(password, 12);
  user.resetPasswordTokenHash = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();
  res.json({ message: "Password reset successfully." });
};

exports.me = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json({ user: publicUser(user) });
};

exports.updateProfile = async (req, res) => {
  const validationError = validateProfile(req.body, false);
  if (validationError) return res.status(400).json({ message: validationError });
  const { name, location, farmSize, crop, category, season, profileImage } = req.body;
  const user = await User.findByIdAndUpdate(
    req.userId,
    { name, location, farmSize: Number(farmSize), crop, category, season, profileImage },
    { new: true, runValidators: true }
  );
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json({ user: publicUser(user) });
};

exports.uploadProfileImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Please select an image." });
  try {
    const result = await uploadProfileImage(req.file.buffer, req.userId);
    if (!result?.secure_url) {
      return res.status(502).json({ message: "Cloudinary did not return an image URL." });
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      { profileImage: result.secure_url },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user: publicUser(user), imageUrl: result.secure_url });
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message, error.http_code || "");
    res.status(502).json({ message: error.message || "Could not upload profile image." });
  }
};

exports.getPreferences = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json({ preferences: { category: user.category, season: user.season, crop: user.crop } });
};

exports.updatePreferences = async (req, res) => {
  const { category, season, crop } = req.body;
  if (!category || !season || !crop) return res.status(400).json({ message: "Category, season and crop are required." });
  const user = await User.findByIdAndUpdate(req.userId, { category, season, crop }, { new: true, runValidators: true });
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json({ preferences: { category: user.category, season: user.season, crop: user.crop } });
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully." });
};
