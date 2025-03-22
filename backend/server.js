// Import required modules
require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define a simple test route
app.get('/', (req, res) => {
  res.send('TFAS Backend is running on port 5000!');
});

// Start the server
const PORT = process.env.PORT || 5000; // Use port 5000 or fallback to 5000 if not defined
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});