
/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Jacob Rivera Student ID: 109641233 Date: Jan. 18th, 2025
* Vercel Link: https://web422-a1-5np0iaots-progmr2077s-projects.vercel.app/
*
********************************************************************************/

const express = require('express');
const app = express();

const cors = require("cors");
require('dotenv').config();


const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({message: "API listening"});
});

app.post("/api/movies", (req,res) => {
  db.addNewMovie(req.body)
      .then((movie) => {
          res.status(201).json(movie);
      }).catch((err) => {
          res.status(500).json({message: `an error occurred: ${err}`});
      });
});

app.get("/api/movies", (req, res) => {
  const { page, perPage, title } = req.query;

  db.getAllMovies(page, perPage, title)
    .then(data => {
      res.json(data);
    }).catch((err) => {
      res.status(500).json({ message: `an error occurred: ${err}` });
    });
}
);

app.get("/api/movies/:id",(req,res) => {
  db.getMovieById(req.params.id)
      .then(data => {
          res.json(data);
      }).catch((err)=>{
          res.status(500).json({message: `an error occurred: ${err}`});
      });
});

app.put("/api/movies/:id", (req,res) => {
  const id = req.params.id;

  db.updateMovieById(req.body, id)
      .then(() => {
          res.json({message: `movie ${id} successfully updated`});
      }).catch((err)=>{
          res.status(500).json({message: `an error occurred: ${err}`});
      });
});

app.delete("/api/movies/:id", (req,res)=>{
  db.deleteMovieById(req.params.id)
      .then(() => {
          res.status(204).end();
      }).catch((err)=>{
          res.status(500).json({message: `an error occurred: ${err}`});
      });
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
      console.log(`server listening on: ${HTTP_PORT}`);
  });
}).catch((err) => {
  console.error(err);
});