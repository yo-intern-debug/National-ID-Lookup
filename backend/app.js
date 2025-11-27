// FOR TESTING SERVER SETUP AND UPLOAD FEATURES
const express = require("express");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
const port = 3000;

// Routes
app.use("/", uploadRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(400).json({
    status: "error",
    message: err.message || "Something went wrong",
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
