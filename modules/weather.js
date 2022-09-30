'use strict';

const axios = require('axios');
const cache = require('./cache');

async function getForecast(req, res) {
  let lat = req.query.lat;
  let lon = req.query.lon;
  let key = req.query.searchQuery + 'forecast'
  let API = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&days=7&units=I&lat=${lat}&lon=${lon}`;
  try {
    // CHECK CACHE
    if (cache[key] && Date.now() - cache[key].timeStamp < 5000){
      console.log('got weather from cache');
      res.status(200).send(cache[key].data);
    } else { // GET DATA FROM API
      let apiResp = await axios.get(API);
      let forecast = formatWeather(apiResp.data.data);
      // SAVE TO CACHE
      console.log('caching weather')
      cache[key]={
        data : forecast,
        timeStamp : Date.now()
      }
      
      res.status(200).send(forecast);
    }
  } catch (error) {
    console.log("weather problem!!!!!", error.message);
  }
}

function formatWeather(arr) {
  return arr.map((data) => {
    return new Forecast(data);
  });
}

class Forecast {
  constructor(data) {
    this.id = String(data.moonset_ts) + String(data.moonrise_ts);
    this.date = data.datetime.slice(5);
    this.desc = data.weather.description;
    this.min = data.low_temp;
    this.max = data.max_temp;
  }
};

module.exports = getForecast;
