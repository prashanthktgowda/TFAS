require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User'); // Import the User model
const authRoutes = require('./routes/auth');
const feedbackRoutes = require('./routes/feedback');
const notificationRoutes = require('./routes/notification');
const { validateBlockchain } = require('./utils/blockchainUtils');

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);

// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/tfas';
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define a simple test route
app.get('/', (req, res) => {
  res.send('TFAS Backend is running on port 5000!');
});

// Routes
app.post('/api/signup', async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: 'Email and role are required.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const newUser = new User({ email, role, isApproved: false });
    await newUser.save();

    res.status(201).json({ message: 'Signup successful! Awaiting approval from officials.' });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/api/signin', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: 'Your account is not approved yet.' });
    }

    res.status(200).json({ message: 'Signin successful!', user });
  } catch (err) {
    console.error('Error during signin:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000; // Use port 5000 or fallback to 5000 if not defined

const startServer = async () => {
  try {
    await validateBlockchain(); // Validate blockchain connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();