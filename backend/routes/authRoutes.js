const express = require("express");
const authController = require("../controllers/authController");
const requireAuth = require("../middleware/auth");
const multer = require("multer");

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 2 * 1024 * 1024 },
	fileFilter: (req, file, callback) => {
		callback(null, file.mimetype.startsWith("image/"));
	},
});

const router = express.Router();
router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);
router.put("/profile", requireAuth, authController.updateProfile);
router.post("/profile/image", requireAuth, upload.single("image"), authController.uploadProfileImage);
router.get("/preferences", requireAuth, authController.getPreferences);
router.put("/preferences", requireAuth, authController.updatePreferences);

module.exports = router;
