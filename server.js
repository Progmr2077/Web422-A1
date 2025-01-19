
/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Jacob Rivera Student ID: 109641233 Date: Jan. 18th, 2025
* Vercel Link: _______________________________________________________________
*
********************************************************************************/

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const MoviesDB = require("./modules/moviesDB.js");

dotenv.config();

const app = express();
const db = new MoviesDB();

const HTTP_PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

// Add Routes
app.post("/api/movies", (req, res) => {
  db.addNewMovie(req.body)
    .then((movie) => res.status(201).json(movie))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.get("/api/movies", (req, res) => {
  const { page, perPage, title } = req.query;
  db.getAllMovies(page, perPage, title)
    .then((movies) => res.json(movies))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.get("/api/movies/:id", (req, res) => {
  db.getMovieById(req.params.id)
    .then((movie) => {
      if (movie) res.json(movie);
      else res.status(404).json({ error: "Movie not found" });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.put("/api/movies/:id", (req, res) => {
  db.updateMovieById(req.body, req.params.id)
    .then(() => res.status(204).send())
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.delete("/api/movies/:id", (req, res) => {
  db.deleteMovieById(req.params.id)
    .then(() => res.status(204).send())
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Initialize DB and Start Server
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });