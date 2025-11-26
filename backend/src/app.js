const express = require("express");
const cors = require("cors");

const idRoutes = require("./routes/idRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", idRoutes);

module.exports = app;
