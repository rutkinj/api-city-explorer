'use strict';

/////// SETUP ////////
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const data = require('./data/weather.json');
const { query, response } = require('express');
// spin up
const app = express();

/////// MIDDLEWARE? ///////
app.use(cors());

/////// PORT ///////
const PORT = process.env.PORT || 3001;

/////// LISTEN //////
app.listen(PORT, () => console.log(`listening on port ${PORT}`))

///// ENDPOINTS //////
app.get('/',(request, response) => {
  response.send('hello from home');
})

///////////// WEATHER /////////////
app.get('/weather', getForecast)

async function getForecast (req,res){
  let lat = req.query.lat;
  let lon = req.query.lon;
  let API = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&days=7&units=I&lat=${lat}&lon=${lon}`;
  try {
    let forecast = await axios.get(API);
    res.status(200).send(formatWeather(forecast.data.data));
  } catch (error) {
    console.log('weather problem!!!!!', error.message);
  }
}

function formatWeather(arr){
  return arr.map(data => {
    return new Forecast(data)
  })
}

class Forecast {
  constructor(data){
    this.id = String(data.moonset_ts) + String(data.moonrise_ts)
    this.date = data.datetime.slice(5);
    this.desc = data.weather.description;
    this.min = data.low_temp;
    this.max = data.max_temp;
  }
};


////////////// MOVIES /////////////

app.get('/movies', getMovies)

async function getMovies (req,res){
  let searchQuery = req.query.searchQuery
  // let searchQuery = 'seattle'
  let API = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&pages=1&include_adult=false&query=${searchQuery}`;
  try{
    let movies = await axios.get(API)
    let movieArr = formatMovies(movies.data.results);
    console.log(movieArr);
    res.status(200).send(movieArr);
  } catch (error){
    console.log('this aint like in the movies!!!!', error.message)
  }
}

function formatMovies (arr){
  let filteredData = arr.filter(movie => {
    if (movie.vote_count > 10){
      return new MovieInfo(movie)
    }
  })
  return filteredData.map(mov => new MovieInfo(mov))
}

class MovieInfo{
  constructor(data){
    this.title = data.original_title;
    this.desc = data.overview;
    this.releaseDate = data.release_date;
  }
}

//-----catch all-------
app.get('*', (req, res)=>{
  res.status(404).send('bruh, that aint exsist');
})