'use strict';

/////// SETUP ////////
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const data = require('./data/weather.json');
const { query, response } = require('express');

const getForecast = require('./modules/weather')
const getMovies = require('./modules/movies')
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

app.get('/weather', getForecast)

app.get('/movies', getMovies)

//-----catch all-------
app.get('*', (req, res)=>{
  res.status(404).send('bruh, that aint exsist');
})