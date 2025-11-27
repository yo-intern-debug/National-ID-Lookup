// seedAdmin.js
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  let connection;

  try {
    // 1. Establish Connection
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "fayda_db",
    });

    console.log("🔌 Connected to MySQL...");

    //  Admin Credentials
    const adminEmail = "admin@fayda.com";
    const adminPassword = "admin123";
    const adminName = "Super Admin";
    const adminRole = "ADMIN";

    //  Check if Admin already exists
    const [existingUsers] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [adminEmail]
    );

    if (existingUsers.length > 0) {
      console.log("⚠️  Admin user already exists. Skipping...");
    } else {
      // 4. Hash the password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // 5. Insert the Admin
      await connection.execute(
        "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
        [adminEmail, hashedPassword, adminName, adminRole]
      );

      console.log("✅ Super Admin created successfully!");
      console.log("-----------------------------------");
      console.log(`📧 Email:    ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log("-----------------------------------");
    }
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    if (connection) {
      await connection.end();
      console.log("👋 Connection closed.");
    }
    process.exit();
  }
};

seedAdmin();
