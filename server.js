const express = require('express');
const app = express();

const cors = require("cors");
require('dotenv').config();

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/api/movies", (req, res) => {
  db.addNewMovie(req.body)
    .then((movie) => res.status(201).json(movie))
    .catch((err) => res.status(500).json({ message: `Error: ${err}` }));
});

app.get("/api/movies", (req, res) => {
  const { page, perPage, title } = req.query;

  db.getAllMovies(page, perPage, title)
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ message: `Error: ${err}` }));
});

app.get("/api/movies/:id", (req, res) => {
  db.getMovieById(req.params.id)
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ message: `Error: ${err}` }));
});

app.put("/api/movies/:id", (req, res) => {
  db.updateMovieById(req.body, req.params.id)
    .then(() => res.json({ message: `Movie ${req.params.id} successfully updated` }))
    .catch(err => res.status(500).json({ message: `Error: ${err}` }));
});

app.delete("/api/movies/:id", (req, res) => {
  db.deleteMovieById(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({ message: `Error: ${err}` }));
});

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`Server listening on: http://localhost:${HTTP_PORT}`);
  });
}).catch((err) => console.error(err));