// moviesAPI/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const MoviesDB = require('./modules/moviesDB');

// Load environment variables
dotenv.config();

require('dotenv').config();

const app = express();
const db = new MoviesDB();
const HTTP_PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database and start the server
db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server listening on port: ${HTTP_PORT}`);
    });
}).catch(err => {
    console.error(`Unable to start the server: ${err.message}`);
});

// Routes
app.get('/', (req, res) => {
    res.json({ message: "API Listening" });
});

// POST /api/movies
app.post('/api/movies', async (req, res) => {
    try {
        const newMovie = await db.addNewMovie(req.body);
        res.status(201).json(newMovie);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/movies
app.get('/api/movies', async (req, res) => {
    const { page, perPage, title } = req.query;

    try {
        const movies = await db.getAllMovies(parseInt(page), parseInt(perPage), title);
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/movies/:id
app.get('/api/movies/:id', async (req, res) => {
    try {
        const movie = await db.getMovieById(req.params.id);
        if (movie) {
            res.json(movie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/movies/:id
app.put('/api/movies/:id', async (req, res) => {
    try {
        const updatedMovie = await db.updateMovieById(req.body, req.params.id);
        if (updatedMovie) {
            res.json(updatedMovie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/movies/:id
app.delete('/api/movies/:id', async (req, res) => {
    try {
        await db.deleteMovieById(req.params.id);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});