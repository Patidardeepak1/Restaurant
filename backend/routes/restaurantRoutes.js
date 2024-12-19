const express = require("express");
const multer = require("multer");
const axios = require("axios"); // For calling external API
const router = express.Router();
const Restaurant = require("../models/Restaurant");
const fs = require("fs"); // For file system operations
const path = require("path"); // For handling file paths

// Get list of restaurants with pagination
router.get("/restaurants", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Pagination
    const restaurants = await Restaurant.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get restaurants by location and radius
router.get("/location", async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;

    if (!latitude || !longitude || !radius) {
      return res.status(400).json({ message: "Missing query parameters" });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const rad = parseFloat(radius);

    if (isNaN(lat) || isNaN(lon) || isNaN(rad)) {
      return res.status(400).json({ message: "Invalid query parameters" });
    }

    // Convert radius to degrees
    const earthRadius = 6371; // Earth radius in kilometers
    const radInDegrees = (rad / earthRadius) * (180 / Math.PI);

    const maxLat = lat + radInDegrees;
    const minLat = lat - radInDegrees;
    const maxLon = lon + radInDegrees / Math.cos((lat * Math.PI) / 180);
    const minLon = lon - radInDegrees / Math.cos((lat * Math.PI) / 180);

    const restaurants = await Restaurant.find({
      latitude: { $gte: minLat.toString(), $lte: maxLat.toString() },
      longitude: { $gte: minLon.toString(), $lte: maxLon.toString() },
    });

    if (restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: "No restaurants found in this location" });
    }

    res.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants by location:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create upload directory if it does not exist
const uploadDirectory = "uploads";
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Image search endpoint
router.post("/image-search", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Replace this URL with the path to your uploaded image
    const imageUrl = `http://localhost:5000/${req.file.path}`;
    const apiKey = "acc_65918b79eec9928";
    const apiSecret = "bd1eecd6095a5a405a21eae88143c117";
    const url =
      "https://api.imagga.com/v2/tags?image_url=" +
      encodeURIComponent(imageUrl);

    console.log("Request URL:", url); // Log the URL being requested

    const response = await axios.get(url, {
      auth: {
        username: apiKey,
        password: apiSecret,
      },
    });

    console.log("API Response:", response.data); // Log the API response

    // Process tags and respond
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error processing image:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      message: "Server error",
      error: error.response ? error.response.data : error.message,
    });
  }
});

// Get restaurant by ID
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
