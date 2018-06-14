const fetch = require('node-fetch');
const qs = require('query-string');

const baseUrl = 'http://www.omdbapi.com';
const apikey = process.env.OMDB_ACCESS_KEY;

function getMovie(id) {
  return fetch(`${baseUrl}/?apikey=${apikey}&i=${id}`)
    .then(data => data.json());
}

function getMovieByTitle(title) {
  return fetch(`${baseUrl}/?apikey=${apikey}&t=${title}`)
    .then(data => data.json());
}

function getRating(event, context, callback) {
  
  console.log('Incoming event:', event);

  // grab the title out of the URL encoded body
  const title = qs.parse(event.body).text;
  
  console.log(`Extracted title: ${title}`);
  
  getMovieByTitle(title).then((movie) => {
    console.log(movie);
    const message = {
      response_type: 'in_channel',
      text: `Metascore: ${movie.Metascore}`,
    };
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(message)
    });
  });
}

module.exports = {
  getRating
};