// reads in our .env file and makes those values available as environment variables
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes/main');
const secureRoutes = require('./routes/secure');

// setup mongo connection
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
mongoose.connection
  .on('error', (error) => {
    console.log(error);
    process.exit(1);
  })
  .on('connected', () => {
    console.log('connected to mongo');
  });

// create an instance of an express app
const app = express();

app.use(express.static(`${__dirname}/build`));

// update express settings
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

// main routes
app.use('/', routes);
app.use('/', secureRoutes);

// catch all other routes
app.use((req, res, next) => {
  res.status(404).json({ message: '404 - Not Found' });
});

// handle errors
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({ error: err });
});

// have the server start listening on the provided port
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
