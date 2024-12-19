// backend/app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const restaurantRoutes = require("./routes/restaurantRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Routes
app.use("/api/restaurants", restaurantRoutes);

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Database connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
