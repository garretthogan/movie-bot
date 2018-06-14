const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const baseUrl = 'http://www.omdbapi.com';

const PORT = process.env.PORT || 8080;
const app = express();

function getMovie(id) {
  return fetch(`${baseUrl}/?apikey=${apikey}&i=${id}`)
    .then(data => data.json());
}

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.post('/slack', (req, res) => {
  const imdbId = req.text;
  getMovie(imdbId).then((movie) => {
    res.send(movie.Metascore);
  });
});

app.listen(PORT, () => {
  console.log('Listening on port ', PORT);
});
