// src/routes/authRoutes.js
const express = require("express");
const { login, createUser, logout } = require("../controllers/authController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// --- PUBLIC ROUTES ---
// Only login is public now
router.post("/login", login);

// --- PROTECTED ROUTES ---
// 1. Logout
router.post("/logout", authenticateToken, logout);

// 2. Create New User (Admin Only)
// Replaces the old register route
router.post(
  "/create-user",
  authenticateToken,
  authorizeRoles("ADMIN"),
  createUser
);

// 3. Test Profile
router.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "This is your profile", user: req.user });
});

module.exports = router;
