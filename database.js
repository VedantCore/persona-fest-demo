const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

// Load environment variables from a .env file
require('dotenv').config();

const app = express();

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// --- MongoDB Connection ---
const connectDB = async () => {
  try {
    // Retrieve the MongoDB connection string from environment variables
    const dbURI = process.env.MONGO_URI;

    if (!dbURI) {
      console.error('❌ MONGO_URI not found in environment variables.');
      process.exit(1); // Exit the process with an error code
    }

    // Connect to MongoDB using the URI
    await mongoose.connect(dbURI);

    console.log('✅ Successfully connected to MongoDB Atlas!');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    // Exit the process with an error code if the connection fails
    process.exit(1);
  }
};

// --- Mongoose Schema and Model ---
const FormDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no two users can have the same email
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Automatically set the current date and time
  },
});

const FormData = mongoose.model('FormData', FormDataSchema);

// --- API Routes ---
// POST route to handle form submissions
app.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create a new document using the FormData model
    const newSubmission = new FormData({
      name,
      email,
      message,
    });

    // Save the new document to the database
    await newSubmission.save();

    console.log('📥 Form data saved:', newSubmission);
    res.status(201).json({ message: 'Form data submitted successfully!' });
  } catch (error) {
    console.error('🔥 Error saving form data:', error.message);
    res.status(500).json({ error: 'Failed to submit form data.' });
  }
});

// GET route to retrieve all form submissions
app.get('/submissions', async (req, res) => {
  try {
    const submissions = await FormData.find();
    res.status(200).json(submissions);
  } catch (error) {
    console.error('🔥 Error retrieving submissions:', error.message);
    res.status(500).json({ error: 'Failed to retrieve submissions.' });
  }
});


// --- Export necessary modules ---
// Export the connectDB function to be called from your main server file
// Export the app to be used in your server's entry point
module.exports = { app, connectDB };