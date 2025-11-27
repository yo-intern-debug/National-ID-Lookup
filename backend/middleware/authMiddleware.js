// FAYDA/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Import the Model
const SECRET_KEY = process.env.JWT_SECRET || "secret_key";

// Authenticate Token Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. Unauthorized Access." });

  //  CHECK IF BLACKLISTED
  const isBlacklisted = await User.isBlacklisted(token);
  if (isBlacklisted) {
    return res
      .status(403)
      .json({ message: "Token is no longer valid (Logged out)" });
  }

  // VERIFY TOKEN
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

//  Role Authorization Middleware
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

// Export functions
module.exports = { authenticateToken, authorizeRoles };
