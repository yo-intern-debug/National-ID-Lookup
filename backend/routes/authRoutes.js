// src/routes/authRoutes.js
const express = require("express");
const { login, createUser, logout } = require("../controllers/authController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();
//login route
router.post("/login", login);

//logout route
router.post("/logout", authenticateToken, logout);
// Create User only admin can register users
router.post(
  "/create-user",
  authenticateToken,
  authorizeRoles("ADMIN"),
  createUser
);

module.exports = router;
