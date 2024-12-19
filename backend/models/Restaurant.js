// backend/models/Restaurant.js
const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  restaurantID: { type: String, required: true },
  name: { type: String, required: true },
  countryCode: { type: String },
  city: { type: String },
  address: { type: String },
  locality: { type: String },
  localityVerbose: { type: String },
  longitude: { type: String },
  latitude: { type: String},
  cuisines: { type: String },
  averageCostForTwo: { type: String },
  currency: { type: String },
  hasTableBooking: { type: String },
  hasOnlineDelivery: { type: String },
  isDeliveringNow: { type: String },
  switchToOrderMenu: { type: String },
  priceRange: { type: String },
  aggregateRating: { type: String },
  ratingColor: { type: String },
  ratingText: { type: String },
  votes: { type: String }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
