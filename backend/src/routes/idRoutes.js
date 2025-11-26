const express = require("express");
const { fetchNationalIdDetails } = require("../controllers/idController");

const router = express.Router();

// Route: GET /api/national-id/:id
router.get("/national-id/:id", fetchNationalIdDetails);

module.exports = router;
