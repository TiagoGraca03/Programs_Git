const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

const genres = [  { id: 1, name: "Action" },  { id: 2, name: "Comedy" },  { id: 3, name: "Drama" },];

const movies = [  { id: 1, title: "The Dark Knight", genre: "Action" },  { id: 2, title: "The Hangover", genre: "Comedy" },  { id: 3, title: "The Shawshank Redemption", genre: "Drama" },];

function validateGenre(genre) {
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
    });
    return schema.validate(genre);
  }
  
  function validateMovie(movie) {
    const schema = Joi.object({
      title: Joi.string().min(3).required(),
      genre: Joi.string().required(),
    });
    return schema.validate(movie);
  }
  

// Get all genres
app.get("/api/genres", (req, res) => {
  res.send(genres);
});

// Get all movies
app.get("/api/movies", (req, res) => {
    res.send(movies);
  });

// Create a new genre
app.post("/api/genres", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };
  genres.push(genre);
  res.send(genre);
});

// Create a new movie and add it to a genre
app.post("/api/movies", (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = genres.find((g) => g.name === req.body.genre);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = {
    id: movies.length + 1,
    title: req.body.title,
    genre: genre.name,
  };
  movies.push(movie);
  res.send(movie);
});

// Update a genre or movie
app.put("/api/:type/:id", (req, res) => {
  const type = req.params.type.toLowerCase();
  const id = parseInt(req.params.id);

  let data;
  let error;

  if (type === "genres") {
    data = genres.find((g) => g.id === id);
    if (!data) return res.status(404).send("The genre with the given ID was not found.");
    const { error: genreError } = validateGenre(req.body);
    if (genreError) error = genreError.details[0].message;
    data.name = req.body.name;
  } else if (type === "movies") {
    data = movies.find((m) => m.id === id);
    if (!data) return res.status(404).send("The movie with the given ID was not found.");
    const { error: movieError } = validateMovie(req.body);
    if (movieError) error = movieError.details[0].message;
    const genre = genres.find((g) => g.name === req.body.genre);
    if (!genre) return res.status(400).send("Invalid genre.");
    data.title = req.body.title;
    data.genre = genre.name;
  } else {
    return res.status(400).send("Invalid type.");
  }

  if (error) return res.status(400).send(error);

  res.send(data);
});

// Delete a genre or movie
app.delete("/api/:type/:id", (req, res) => {
    const type = req.params.type.toLowerCase();
    const id = parseInt(req.params.id);
  
    let data;
    let index;
  
    if (type === "genres") {
      data = genres.find((g) => g.id === id);
      if (!data) return res.status(404).send("The genre with the given ID was not found.");
      index = genres.indexOf(data);
      genres.splice(index, 1);
    } else if (type === "movies") {
      data = movies.find((m) => m.id === id);
      if (!data) return res.status(404).send("The movie with the given ID was not found.");
      index = movies.indexOf(data);
      movies.splice(index, 1);
    } else {
      return res.status(400).send("Invalid type.");
    }
  
    res.send(data);
  });
  
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening on port ${port}...`));