'use strict';

/////// SETUP ////////

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const data = require('./data/data.json')
const app = express();

/////// MIDDLEWARE? ///////

app.use(cors());

/////// PORT ///////

const PORT = process.env.PORT || 3001;

/////// LISTEN //////

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
