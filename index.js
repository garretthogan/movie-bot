const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
require('dotenv').config();

const baseUrl = 'http://www.omdbapi.com';

const PORT = process.env.PORT || 8080;
const app = express();
app.use(bodyParser.json());

function getMovie(id) {
  return fetch(`${baseUrl}/?apikey=${process.env.OMDB_ACCESS_KEY}&i=${id}`)
    .then(data => data.json());
}

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.post('/slack', (req, res) => {
  console.log(req.body);
  const imdbId = req.body.text;
  getMovie(imdbId).then((movie) => {
    res.send(movie.Metascore);
  });
});

app.listen(PORT, () => {
  console.log('Listening on port ', PORT);
});
