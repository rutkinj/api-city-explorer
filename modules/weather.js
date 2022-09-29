'use strict';

const axios = require('axios');

async function getForecast(req, res) {
  let lat = req.query.lat;
  let lon = req.query.lon;
  let API = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&days=7&units=I&lat=${lat}&lon=${lon}`;
  try {
    let forecast = await axios.get(API);
    res.status(200).send(formatWeather(forecast.data.data));
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

module.exports = {getForecast};
