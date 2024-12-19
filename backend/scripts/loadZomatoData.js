// backend/scripts/loadZomatoData.js
const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const csv = require('csv-parser');
const fs = require('fs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

// Function to load data from CSV
async function loadData() {
  try {
    console.log('Clearing existing data...');
    await Restaurant.deleteMany({});  // Updated to use promise-based syntax

    console.log('Loading new data...');
    fs.createReadStream('zomato.csv')  // Update with the correct path
      .pipe(csv())
      .on('data', async (row) => {
        try {
          const restaurant = new Restaurant({
            restaurantID: row['Restaurant ID'],
            name: row['Restaurant Name'],
            countryCode: row['Country Code'],
            city: row['City'],
            address: row['Address'],
            locality: row['Locality'],
            localityVerbose: row['Locality Verbose'],
            longitude: row['Longitude'],
            latitude: row['Latitude'],
            cuisines: row['Cuisines'],
            averageCostForTwo: row['Average Cost for two'],
            currency: row['Currency'],
            hasTableBooking: row['Has Table booking'],
            hasOnlineDelivery: row['Has Online delivery'],
            isDeliveringNow: row['Is delivering now'],
            switchToOrderMenu: row['Switch to order menu'],
            priceRange: row['Price range'],
            aggregateRating: row['Aggregate rating'],
            ratingColor: row['Rating color'],
            ratingText: row['Rating text'],
            votes: row['Votes']
          });
          await restaurant.save();  // Save each restaurant
        } catch (error) {
          console.error('Error saving data:', error);
        }
      })
      .on('end', () => {
        console.log('Data loading complete');
        mongoose.connection.close();  // Close the connection after loading
      });
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Execute the data loading function
loadData();


