'use strict';

/////// SETUP ////////
require('dotenv').config();
const express = require('express');
const cors = require('cors');
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

app.get('/weather', (req,res)=>{
  console.log(req.query);
  let place = data.find(location => location.city_name.toLowerCase() === req.query.searchQuery.toLowerCase())
  try{
    res.send(formatWeather(place.data));
  } catch (error){
    res.status(500).send(handleError(error));
  }
})

//-----catch all-------
app.get('*', (req, res)=>{
  res.status(404).send('bruh, that aint exsist');
})

function handleError(error){
  return `We had a problem: ${error.message}`
}

function formatWeather(arr){
  return arr.map(data => {
    return new Forecast(data.datetime, data.weather.description)
  })
}

class Forecast {
  constructor(date, desc){
    this.date = date;
    this.desc = desc;
  }
};
