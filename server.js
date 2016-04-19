'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoResources = require('./backend/resources').connectToServer(function (err) { //  Initialize database connection
  if (err) {
    console.log('Database connection failed!', err);
    throw err;
  }

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(cors());

  app.get('/', function (req, res) {
    res.send('GlobeExplore 2016');
  });

  app.listen(3000, function () {
    console.log('Server is up and running\nURL: http://localhost:3000\nTo quit press Ctrl-C');
  });
});