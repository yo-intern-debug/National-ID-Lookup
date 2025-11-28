const express = require("express");
const { fetchNationalIdDetails } = require("../controllers/idController");
const { scanIdImage } = require("../controllers/scanController");
const router = express.Router();
const upload = require("../middleware/upload");

// Route: GET /api/national-id/:id
router.get("/national-id/:id", fetchNationalIdDetails);

// POST — OCR scan the image
router.post("/scan-id", upload.single("idImage"), scanIdImage);


module.exports = router;
