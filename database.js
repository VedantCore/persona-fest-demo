const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// MongoDB connection string
mongoose.connect('mongodb+srv://admin:v4326@persona-fest.cuqev0t.mongodb.net/personaFest', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Enhanced User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

// Event Registration Schema
const eventRegistrationSchema = new mongoose.Schema({
    personalInfo: {
        name: String,
        email: String,
        phone: String
    },
    eventCategory: String,
    event: String,
    team: {
        name: String,
        members: [String]
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    }
});

const User = mongoose.model('User', userSchema);
const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'persona-fest-secret-key-2025';

// Routes

// User Registration
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters' 
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered' 
            });
        }
        
        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        
        await user.save();
        
        console.log(`New user registered: ${email}`);
        
        res.status(201).json({ 
            success: true, 
            message: 'User registered successfully',
            user: { id: user._id, name: user.name, email: user.email }
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration' 
        });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password, remember } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }
        
        // Find user
        const user = await User.findOne({ email, isActive: true });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
        
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }
        
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        
        // Generate JWT token
        const tokenExpiry = remember ? '30d' : '24h';
        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email, 
                isAdmin: user.isAdmin 
            },
            JWT_SECRET,
            { expiresIn: tokenExpiry }
        );
        
        console.log(`User logged in: ${email}`);
        
        res.json({ 
            success: true, 
            message: 'Login successful',
            token,
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                isAdmin: user.isAdmin 
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
});

// Event Registration
app.post('/api/register-event', async (req, res) => {
    try {
        const registrationData = req.body;
        
        // Validation
        if (!registrationData.personalInfo || !registrationData.eventCategory || !registrationData.event) {
            return res.status(400).json({ 
                success: false, 
                message: 'Required fields are missing' 
            });
        }
        
        const registration = new EventRegistration(registrationData);
        await registration.save();
        
        console.log(`New event registration: ${registrationData.personalInfo.email} for ${registrationData.event}`);
        
        res.status(201).json({ 
            success: true, 
            message: 'Event registration successful',
            registration: registration
        });
        
    } catch (error) {
        console.error('Event registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during event registration' 
        });
    }
});

// Get all event registrations (Admin only)
app.get('/api/registrations', async (req, res) => {
    try {
        const registrations = await EventRegistration.find().sort({ timestamp: -1 });
        res.json({ 
            success: true, 
            data: registrations 
        });
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching registrations' 
        });
    }
});

// Get all users (Admin only)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ createdAt: -1 });
        res.json({ 
            success: true, 
            data: users 
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching users' 
        });
    }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

// Protected route example
app.get('/api/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Login page: http://localhost:${PORT}/login`);
    console.log(`🏠 Home page: http://localhost:${PORT}`);
});

module.exports = app;