const express = require("express");
const multer = require("multer");
const requireAuth = require("../middleware/auth");
const detectionController = require("../controllers/detectionController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      return callback(new Error("Only JPEG, PNG, and WebP images are supported."));
    }
    callback(null, true);
  },
});

const router = express.Router();
router.post("/predict", requireAuth, upload.single("image"), detectionController.predict);
router.get("/history", requireAuth, detectionController.history);

module.exports = router;
