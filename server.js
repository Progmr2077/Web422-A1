// Require dependencies
const express = require('express');
const cors = require('cors');
require('dotenv').config();  // To load environment variables from .env file

// Initialize the Express application
const app = express();

// Use middleware
app.use(cors());  // Enable CORS
app.use(express.json());  // Middleware to parse JSON bodies

// Define a simple GET route
app.get('/', (req, res) => {
  res.json({ message: "API Listening" });
});

// Set the server to listen on a port
const PORT = process.env.PORT || 8080;  // port 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});