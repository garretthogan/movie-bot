const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
require('dotenv').config();

const baseUrl = 'http://www.omdbapi.com';

const PORT = process.env.PORT || 8080;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const apikey = process.env.OMDB_ACCESS_KEY;
function getMovie(id) {
  return fetch(`${baseUrl}/?apikey=${apikey}&i=${id}`)
    .then(data => data.json());
}

function getMovieByTitle(title) {
  return fetch(`${baseUrl}/?apikey=${apikey}t=${title}`)
    .then(data => data.json());
}

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.post('/slack', (req, res) => {
  console.log(req.body);
  const title = req.body.text;
  getMovieByTitle(title).then((results) => {
    res.send(results.Search[0].Metascore);
  });
});

app.listen(PORT, () => {
  console.log('Listening on port ', PORT);
});
