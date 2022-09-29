'use strict';

const axios = require('axios')

async function getMovies(req, res) {
  let searchQuery = req.query.searchQuery;
  // let searchQuery = 'seattle'
  let API = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&pages=1&include_adult=false&query=${searchQuery}`;
  try {
    let movies = await axios.get(API);
    let movieArr = formatMovies(movies.data.results);
    console.log(movieArr);
    res.status(200).send(movieArr);
  } catch (error) {
    console.log("this aint like in the movies!!!!", error.message);
  }
}

function formatMovies(arr) {
  let filteredData = arr.filter((movie) => {
    if (movie.vote_count > 10) {
      return new MovieInfo(movie);
    }
  });
  return filteredData.map((mov) => new MovieInfo(mov));
}

class MovieInfo {
  constructor(data) {
    this.title = data.original_title;
    this.desc = data.overview;
    this.releaseDate = data.release_date;
  }
}

module.exports = {getMovies};