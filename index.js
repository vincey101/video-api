require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const videoRoutes = require('./routes/videoRoutes'); // Assuming your routes file is called videoRoutes.js
require('dotenv').config();

const app = express();


// Middleware
app.use(cors());
app.use(bodyParser.json()); // For parsing JSON requests

// Routes
app.use(videoRoutes); // Your video routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
