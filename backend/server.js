require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
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

// Define a simple test route
app.get('/', (req, res) => {
  res.send('TFAS Backend is running on port 5000!');
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