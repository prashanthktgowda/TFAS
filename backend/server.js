const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const routes = require('./routes');

// Middleware
app.use(express.json());
app.use(routes);

// Sample route
app.get('/', (req, res) => {
    res.send('Welcome to the backend!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
