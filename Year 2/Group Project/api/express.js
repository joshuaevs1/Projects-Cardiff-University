require('dotenv').config();
const express = require('express');
const compression = require('compression');
const app = express();
const auth = require('./routes/auth.js');
const twitter = require('./routes/twitter.js');
const flickr = require('./routes/flickr.js');

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(compression());

app.use('/auth', auth);
app.use('/twitter', twitter);
app.use('/flickr', flickr);

module.exports = app;
