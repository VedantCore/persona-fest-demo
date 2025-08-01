const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// This line loads your MONGO_URI from the .env.local file
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const connectDB = async () => {
  try {
    // IMPORTANT: Make sure your MONGO_URI in .env.local includes a database name
    // Example: mongodb+srv://user:pass@cluster.mongodb.net/MyOwnDatabase?retryWrites=true
    const dbURI = process.env.MONGO_URI;

    if (!dbURI) {
      console.error('❌ MONGO_URI not found. Make sure to set it in your .env.local file.');
      process.exit(1);
    }

    await mongoose.connect(dbURI);
    console.log('✅ Successfully connected to MongoDB!');

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// --- Mongoose Schema & Model for Your Form ---
// This defines the structure for the data you are actually submitting
const SubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

// We explicitly name the model 'Submission' and the collection 'submissions'
const Submission = mongoose.model('Submission', SubmissionSchema, 'submissions');


// --- API Route to Handle Form Submissions ---
app.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create a new document with the data from the form
    const newSubmission = new Submission({ name, email, message });

    // Save it to the 'submissions' collection
    await newSubmission.save();

    console.log('✅ Form data saved to the "submissions" collection:', newSubmission);
    res.status(201).json({ message: 'Form data received and saved!' });
  } catch (error) {
    console.error('🔥 Error saving form data:', error.message);
    res.status(500).json({ error: 'Failed to save form data.' });
  }
});

// --- Start the Server ---
// First, connect to the database. Then, start the server.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
});