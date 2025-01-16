// moviesAPI/server.js

const express = require('express');
const dotenv = require('dotenv');
const MoviesDB = require('./modules/moviesDB');

// Load environment variables
dotenv.config();

const app = express();
const db = new MoviesDB();
const HTTP_PORT = process.env.PORT || 8080;

// Routes
app.get('/', (req, res) => {
    res.json({ message: "API Listening" });
});

// Start the server
app.listen(HTTP_PORT, () => {
    console.log(`Server listening on port: ${HTTP_PORT}`);
});
