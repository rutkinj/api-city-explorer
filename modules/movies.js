'use strict';

const axios = require('axios')
const cache = require('./cache')

async function getMovies(req, res) {
  let searchQuery = req.query.searchQuery;
  let key = searchQuery + 'movies';
  let API = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&pages=1&include_adult=false&query=${searchQuery}`;
  try {
    // CHECK CACHE
    if (cache[key] && Date.now() - cache[key].timeStamp < 500000000){
      console.log('grabbing movies from cache')
      res.status(200).send(cache[key].data);
    } else { // GET DATA FROM API
      let movies = await axios.get(API);
      let movieArr = formatMovies(movies.data.results);
      //SAVE TO CACHE
      console.log('caching movie list')
      cache[key]={
        data: movieArr,
        timeStamp: Date.now(),
      }
      res.status(200).send(movieArr);}
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

module.exports = getMovies;