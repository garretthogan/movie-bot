const fetch = require('node-fetch');
const qs = require('query-string');

const baseUrl = 'http://www.omdbapi.com';
const apikey = process.env.OMDB_ACCESS_KEY;

function getMovie(id) {
  return fetch(`${baseUrl}/?apikey=${apikey}&i=${id}`)
    .then(data => data.json());
}

function getMovieByTitle(title) {
  return fetch(`${baseUrl}/?apikey=${apikey}&t=${title.trim()}`)
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

function compareMovies(event, context, callback) {
  
  console.log('Incoming event:', event);

  // grab the title out of the URL encoded body
  const movies = qs.parse(event.body).text.split(',');
  
  console.log(`Extracted titles: ${movies}`);
  
  Promise.all([getMovieByTitle(movies[0]), getMovieByTitle(movies[1])])
  .then((movies) => {
    console.log(movies);

    // remove any movies that weren't found
    const filteredMovies = movies.filter(movie => !!movie.Metascore);

    // if we are left with fewer than 2 movies, bail out early
    if (filteredMovies.length < 2) {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          response_type: 'in_channel',
          text: 'You need to supply two valid movies',
        })
      });
    }

    // sort movies in descending order
    const orderedMovies = filteredMovies.sort((a, b) => parseInt(b.Metascore) - parseInt(a.Metascore));


    const message = {
      response_type: 'in_channel',
      text: `*The winner is:* ${orderedMovies[0].Title}  \n\n  *Scores:*\n  ${orderedMovies[0].Title} - ${orderedMovies[0].Metascore} \n  ${orderedMovies[1].Title} - ${orderedMovies[1].Metascore}`,
    };

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(message)
    });
  })
  .catch((err) => console.log('Caught exception', err));
}



module.exports = {
  getRating,
  compareMovies
};