// backend/controllers/restaurantController.js
const Restaurant = require('../models/Restaurant');

// Get Restaurant by ID
exports.getRestaurantById = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get List of Restaurants
exports.getRestaurants = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const restaurants = await Restaurant.find()
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// backend/controllers/restaurantController.js
exports.searchByLocation = async (req, res) => {
    const { latitude, longitude, distance } = req.query;
    const maxDistance = distance || 3000; // Default 3km
    try {
      const restaurants = await Restaurant.find({
        location: {
          $nearSphere: {
            $geometry: { type: 'Point', coordinates: [longitude, latitude] },
            $maxDistance: maxDistance,
          },
        },
      });
      res.json(restaurants);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
