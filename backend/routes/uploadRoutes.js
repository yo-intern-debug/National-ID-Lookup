const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const uploadController = require("../controllers/uploadController");

const { authenticateToken } = require("../middleware/authMiddleware");

// All authenticated users can upload
router.post(
  "/",
  authenticateToken, // must be logged in
  upload.single("id_image"), // handle file upload
  uploadController.handleUpload // OCR + response
);

module.exports = router;
