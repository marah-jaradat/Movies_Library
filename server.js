"use strict";

const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 3002;
// const Data = require("package.json");
// we go undefined becausewe insert object as json inside body, so we have to parse data
app.use(express.json());
//Routs

app.get("/", homeHandler);
app.get("/favorite", favHandler);
app.get("/user/:id", idHandler);
app.post("/info", infoHandler);

// Functions
// http://localhost:3000/
function homeHandler(req, res) {
  res.send("Hello there");
  // return res.status(200).send(movie);
}
// http://localhost:3000/favorite
function favHandler(req, res) {
  // http://localhost:3000/favorite?name=marah
  // console.log(req.query) as object, query is a keyword for the request
  return res.status(200).send("Welcome to Favorite Page");
}
// http://localhost:3000/user/:id
// req.params:is part of the req
function idHandler(req, res) {
  console.log(req.params);
  res.send("I'm there");
}
// req.body:is part of the req
function infoHandler(req, res) {
  console.log(req.body);
  res.send("I'm the body");
}

// const Data = require("./Movie data/data.json");
// const axios = require("axios");
// const dotenv = require("dotenv");

// dotenv.config();
// const APIKEY = process.env.APIKEY;
// const PORT = process.env.PORT;
// app.use(express.json());

// const pg = require("pg");
// const DATABASE_URL = process.env.DATABASE_URL;
// // const client = new pg.Client(DATABASE_URL);

// const client = new pg.Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false },
// });


//Get
app.get("/", getMovieHandler);
app.get("/favorite", getFavoriteHandler);
app.get("/trending", getTrendingHandler);
app.get("/search", getSearchHandler);
app.get("/search/company", getSearchCompanyHandler);
app.get("/watch/providers/regions", getWatchHandler);

// endpoint to insert
app.post("/addMovie", addMovieHandler);

// endpoint to get data
app.get("/getAllMovies", getAllMoviesHandler);

// Endpoint to get specific recorded data
app.get("/getSpecificMovie/id", getSpecificMovieHandler);

app.put("/updateSpecificMovie/id", updateSpecificMovieHandler);
app.delete("/deleteSpecificMovie/id", deleteSpecificMovieHandler);

// Endpoint to delete a specific record

// errors
app.use(errorHandler);
app.use("*", notFountHandler);

// Constructor
function Movie(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}

//

function getMovieHandler(req, res) {
  let movies = [];
  axios
    .get(
      "https://api.themoviedb.org/3/movie/550?api_key=44bca49a3851cf70a7904aeed9847745"
    )
    .then((value) => {
      value.data.movies.forEach((movie) => {
        let oneMovie = new Movie(
          movie.data.title,
          movie.data.poster_path,
          movie.data.overview
        );
        movies.push(oneMovie);
      });
      return res.status(200).json(movies);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
}

function getFavoriteHandler(req, res) {
  let favoriteQuery = req.query.favorite;
  let movies = [];

  axios
    .get(
      `https://api.themoviedb.org/3/movie/favorite/343611?api_key=${APIKEY}&append_to_response=videos`
    )
    .then((value) => {
      value.data.results.forEach((movie) => {
        movies.push(movie);
      });

      return res.status(200).json(movies);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
}

function getTrendingHandler(req, res) {
  let trendingQuery = req.query.trending;
  let movies = [];

  axios
    .get(`https://api.themoviedb.org/3/movie/trending/all/day?api_key${APIKEY}`)
    .then((value) => {
      value.data.results.forEach((movie) => {
        movies.push(movie);
      });

      return res.status(200).json(movies);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
}

function getSearchHandler(req, res) {
  let searchQuery = req.query.search;
  let movies = [];

  axios
    .get(`https://api.themoviedb.org/3/search/movie${APIKEY}&page=1`)
    .then((value) => {
      value.data.results.forEach((movie) => {
        movies.push(movie);
      });

      return res.status(200).json(movies);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
}

function getSearchCompanyHandler(req, res) {
  let companyhQuery = req.query.company;
  let movies = [];

  axios
    .get(`https://api.themoviedb.org/3/search/company?api_key=${APIKEY}&page=1`)
    .then((value) => {
      value.data.results.forEach((movie) => {
        movies.push(movie);
      });

      return res.status(200).json(movies);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
}

function getWatchHandler(req, res) {
  let watchQuery = req.query.watch;
  let movies = [];

  axios
    .get(
      `https://api.themoviedb.org/3/watch/providers/regions?api_key=${APIKEY}`
    )
    .then((value) => {
      value.data.results.forEach((movie) => {
        movies.push(movie);
      });

      return res.status(200).json(movies);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
}

function addMovieHandler(req, res) {
  let movie = req.body;

  const sql = `INSERT INTO addMovie(title, poster_path, overview) VALUES($1, $2, $3) RETURNING * ;`;

  let values = [movie.title, movie.poster_path, movie.overview];

  client
    .query(sql, values)
    .then((data) => {
      return res.status(201).json(data.rows[0]);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
}

function getAllMoviesHandler(req, res) {
  const sql = `SELECT * FROM addMovie`;
  client
    .query(sql)
    .then((data) => {
      return res.status(200).json(data.rows);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
}

function getSpecificMovieHandler(req, res) {
  const id = req.param.id;
  const sql = `SELECT *FROM addMovie WHERE id= ${id}`;

  client
    .query(sql)
    .then((data) => {
      res.status(200).json(data.rows);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
}

function updateSpecificMovieHandler(req, res) {
  const id = req.param.id;
  let movie = req.body;
  const sql = `UPDATE addMovie SET WHERE title=$1, poster_path= $2, overview=$3 WHERE id=${id}RETURNING `;
  let values = [movie.title, movie.poster_path, movie.overview];

  client
    .query(sql)
    .then((data) => {
      res.status(200).json(data.rows);
      res.status(2004).json([]);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
}

function deleteSpecificMovieHandler(req, res) {
  const id = req.param.id;
  const sql = `DELETE FROM addMovie WHERE id= ${id}`;

  client
    .query(sql)
    .then(() => {
      res.status(200).json(data.rows);
      res.status(2004).json([]);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
}

function notFountHandler(req, res) {
  res.status(404).send("No endpoint with this name");
}

function errorHandler(error, req, res) {
  const err = {
    status: 500,
    message: error,
  };

  res.status(500).send(err);
}

client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`server is listening to ${PORT}`);
  });
});
