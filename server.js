
/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Jacob Rivera Student ID: 109641233 Date: Jan. 18th, 2025
* Vercel Link: https://web422-a1-one.vercel.app/
*
********************************************************************************/

const express = require('express');
const cors = require("cors");
require('dotenv').config();

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: "API listening" });
});

app.post("/api/movies", (req, res) => {
  db.addNewMovie(req.body)
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      res.status(500).json({ message: `An error occurred: ${err.message || err}` });
    });
});

app.get("/api/movies", (req, res) => {
  const { page, perPage, title } = req.query;
  const pageNum = parseInt(page) || 1;
  const perPageNum = parseInt(perPage) || 10;

  db.getAllMovies(pageNum, perPageNum, title)
    .then(data => res.json(data))
    .catch((err) => res.status(500).json({ message: `An error occurred: ${err.message || err}` }));
});

app.get("/api/movies/:id", (req, res) => {
  db.getMovieById(req.params.id)
    .then(data => {
      if (!data) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json(data);
    })
    .catch((err) => res.status(500).json({ message: `An error occurred: ${err.message || err}` }));
});

app.put("/api/movies/:id", (req, res) => {
  const { id } = req.params;

  db.updateMovieById(req.body, id)
    .then((updated) => {
      if (!updated) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json({ message: `Movie ${id} successfully updated` });
    })
    .catch((err) => res.status(500).json({ message: `An error occurred: ${err.message || err}` }));
});

app.delete("/api/movies/:id", (req, res) => {
  db.deleteMovieById(req.params.id)
    .then((deleted) => {
      if (!deleted) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.status(204).end();
    })
    .catch((err) => res.status(500).json({ message: `An error occurred: ${err.message || err}` }));
});

// Ensure MongoDB connection string exists before initializing
if (!process.env.MONGODB_CONN_STRING) {
  console.error("Missing MONGODB_CONN_STRING in environment variables");
  process.exit(1);
}

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on port ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });