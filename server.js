'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const exphbs = require('express-handlebars');
const mongo = require('./backend/resources');

// mongo.connectToServer(function (err) { //  Initialize database connection
//   if (err) {
//     console.log('Database connection failed!', err);
//     throw err;
//   }

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

  app.get('/play', function (req, res) {
    res.render('play');
  });

  app.get('/login', function (req, res) {
    res.render('login');
  });

  app.post('/challange', function (req, res) {
    mongo.getDb(function (db) {
      db.collection('users').find({username: req.body.username, password: req.body.password}).toArray(function(err, data) {
        if (data.length !== 0) {  //  unique username
          res.render('challange');
        } else {  //  duplicated username
          res.status(403);
          res.render('login', {noLogin: true});
        }
      });
    });
  });

  app.use(function (req, res) {
    res.type('text/html');
    res.status(404);
    res.render('404');
  });

  app.use(function (req, res) {
    res.type('text/html');
    res.status(500);
    res.render('500');
  });

  app.listen(app.get('port'), function () {
    console.log('Server is up and running\nURL: http://localhost:' + app.get('port') + '\nTo quit press Ctrl-C');
  });
// });  