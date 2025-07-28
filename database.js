const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// MongoDB connection string
mongoose.connect('mongodb+srv://admin:v4326@persona-fest.cuqev0t.mongodb.net/personaFest', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define schema and model
const userSchema = new mongoose.Schema({
    Username: String,
    Password: String
});
const User = mongoose.model('User', userSchema);

// Route to store Username & Password
app.post('/add-user', async (req, res) => {
    const { Username, Password } = req.body;
    try {
        const user = new User({ Username, Password });
        await user.save();
        res.status(201).json({ message: 'User saved successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save user' });
    }
});

// To start the server (optional):
// app.listen(3000, () => console.log('Server running on port 3000'));