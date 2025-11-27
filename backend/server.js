const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const dotenv = require("dotenv");
const uploadRoutes = require("./routes/uploadRoutes");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
const PORT = process.env.PORT || 3000;
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(400).json({
    status: "error",
    message: err.message || "Something went wrong",
  });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
