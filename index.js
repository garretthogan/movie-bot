const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const env = process.env.NODE_ENV;

const baseUrl = 'http://www.omdbapi.com';

const PORT = process.env.PORT || 8080;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const apikey = env === 'production' ? process.env.OMDB_ACCESS_KEY : require('./.env.json').OMDB_ACCESS_KEY;
function getMovie(id) {
  return fetch(`${baseUrl}/?apikey=${apikey}&i=${id}`)
    .then(data => data.json());
}

function getMovieByTitle(title) {
  return fetch(`${baseUrl}/?apikey=${apikey}&t=${title}`)
    .then(data => data.json());
}

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.post('/slack', (req, res) => {
  console.log(req.body);
  const title = req.body.text;
  getMovieByTitle(title).then((movie) => {
    console.log(movie);
    res.send(movie.Metascore);
  });
});

app.listen(PORT, () => {
  console.log('Listening on port ', PORT);
});
