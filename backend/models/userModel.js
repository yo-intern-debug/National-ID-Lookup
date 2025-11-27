const db = require("../config/database");

const User = {
  // Find user by email
  findByEmail: async (email) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },

  // Create a new user
  create: async (userData) => {
    const { email, password, name, role } = userData;
    const query =
      "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)";

    // Default to 'USER'
    const userRole = role || "USER";

    const [result] = await db.query(query, [email, password, name, userRole]);
    return result.insertId;
  },

  // Find user by ID
  findById: async (id) => {
    const [rows] = await db.query(
      "SELECT id, email, name, role FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  },
  addToBlacklist: async (token) => {
    const query = "INSERT INTO token_blacklist (token) VALUES (?)";
    await db.query(query, [token]);
  },

  // Check Blacklist
  isBlacklisted: async (token) => {
    const [rows] = await db.query(
      "SELECT * FROM token_blacklist WHERE token = ?",
      [token]
    );
    return rows.length > 0; // Returns true if found
  },
};

module.exports = User;
