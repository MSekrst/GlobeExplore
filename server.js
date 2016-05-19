'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
var exphbs = require('express-handlebars');

//const mongoResources = require('./backend/resources').connectToServer(function (err) { //  Initialize database connection
//  if (err) {
//    console.log('Database connection failed!', err);
//    throw err;
//  }

app.disable('x-powerd-by'); //  block headers from giving away server data

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + "")); // reference directories on server

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/learning', function (req, res) {
  res.render('learning');
});

app.get('/play', function(req, res) {
  res.render('play');
});

app.get('/challange', function(req, res) {
  res.render('challange');
});

app.get('/login', function (req, res) {
  res.render('login');
});

app.use(function(req, res) {
  res.type('text/html');
  res.status(404);
  res.render('404');
});

app.use(function(req, res) {
  res.type('text/html');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  console.log('Server is up and running\nURL: http://localhost:' + app.get('port') + '\nTo quit press Ctrl-C');
});
//});