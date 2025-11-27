const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const SECRET_KEY = process.env.JWT_SECRET || "secret_key";

//login function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "7d",
    });
    res.json({
      message: "Login successful",
      token,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

// create user function (user & admin)

const createUser = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validate inputs
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Email, password, and name are required" });
    }

    // Validate Role
    const validRoles = ["USER", "ADMIN"];
    const userRole = role ? role.toUpperCase() : "USER";

    if (!validRoles.includes(userRole)) {
      return res
        .status(400)
        .json({ message: "Invalid role. Choose USER, ADMIN" });
    }

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const userId = await User.create({
      email,
      password: hashedPassword,
      name,
      role: userRole,
    });

    res.status(201).json({
      message: `New ${userRole} created successfully`,
      userId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// logout function
const logout = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(400).json({ message: "Token required" });
    await User.addToBlacklist(token);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
};

module.exports = { login, createUser, logout };
