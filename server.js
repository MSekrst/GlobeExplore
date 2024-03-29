'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const exphbs = require('express-handlebars');
const mongo = require('./backend/resources');
var ObjectID = require('mongodb').ObjectID;

var dbConnection = true;

mongo.connectToServer(function (err) { //  Initialize database connection
  if (err) {
    console.log('Database connection failed!', err);
    dbConnection = false;
  }

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

  app.get('/home', function (req, res) {
    res.render('home');
  });

  app.get('/learning', function (req, res) {
    res.render('learning');
  });

  app.post('/state', function (req, res) {
    mongo.getDb(function (db) {
      db.collection('states').find({state: req.body.state}).toArray(function (err, data) {
        if (data.length === 0) {  //  database doesn't contain selected state -> use wiki API
          res.status(201).json(null);
        } else {  //  return html for given state -> avoid wiki API
          res.status(200).json(data[0].html);
        }
      });
    });
  });

  app.post('/newState', function (req, res) {
    mongo.getDb(function (db) {
      db.collection('states').insertOne({state: req.body.state, html: req.body.html});
    });
    res.status(200).json('State added!');
  });

  app.get('/play', function (req, res) {
    res.render('play');
  });

  app.get('/login', function (req, res) {
    if (dbConnection) {
      res.render('login');
    } else {
      res.render('home', {noMultiplayer: true});
    }
  });

  app.post('/challange', function (req, res) {
    mongo.getDb(function (db) {
      db.collection('users').find({
        username: req.body.username,
        password: req.body.password
      }).toArray(function (err, data) {
        if (data.length !== 0) {
          res.render('challange', {username: req.body.username});
        } else {  //  duplicated
          console.log(data);
          res.status(403);
          res.render('login', {noLogin: true});
        }
      });
    });
  });

  app.get('/challangeReturn/:username', function (req, res) {
    if (req.headers.referer) {
      res.render('challange', {username: req.params.username});
    } else {
      res.render('404');
    }
  });

  app.get('/getPlayers', function (req, res) {
    mongo.getDb(function (db) {
      db.collection('users').find({}).toArray(function (err, data) {
        res.status(200).json(data);
      });
    });
  });

  app.post('/getChallanges', function (req, res) {
    mongo.getDb(function (db) {
      db.collection('pending').find({challenger: req.body.username}).toArray(function (err, data) {
        // console.log(data);
        db.collection('pending').find({challanged: req.body.username}).toArray(function (err, data2) {

          for (var i = 0; i < data2.length; i++)
            data.push(data2[i]);

          res.status(200).json(data);
        });
      });
    });
  });

  app.post('/getChallenge', function (req, res) {
    mongo.getDb(function (db) {
      db.collection('pending').find({_id: ObjectID(req.body.id)}).toArray(function (err, data) {
        res.status(200).json(data[0]);
      });
    });
  });

  app.post('/updateChallange', function (req, res) {
    mongo.getDb(function (db) {
      db.collection('pending').find({_id: ObjectID(req.body._id)}).toArray(function (err, data) {
        data[0].challengedTime=req.body.challengedTime;
        data[0].challengedScore=req.body.challengedScore;
        db.collection('pending').updateOne({ _id: data[0]._id },data[0],function(){
          res.status(200).json(data[0]);
        });
      });
    });
  });

  app.post('/saveWinner', function (req, res) {
    mongo.getDb(function (db) {
      db.collection('pending').find({_id: ObjectID(req.body._id)}).toArray(function (err, data) {
        data[0].winner=req.body.winner;
        db.collection('pending').updateOne({ _id: data[0]._id },data[0]);
        res.status(200).json(data[0]);
      });
    });
  });

  app.post('/deleteChallange',function(req,res){
    mongo.getDb(function (db) {
      db.collection('pending').removeOne({_id: ObjectID(req.body._id)});
      res.status(200);
    });
  });

  app.get('/registration', function (req, res) {
    res.render('registration');
  });

  app.post('/register', function (req, res) {
    if (!req.body.username || !req.body.password) {
      res.render('registration', {noRegistration: true, message: "Enter username and password!"});
    } else {
      mongo.getDb(function (db) {
        db.collection('users').find({username: req.body.username}).toArray(function (err, data) {
          if (data.length === 0) {
            db.collection('users').insertOne(req.body);
            res.render('challange');
          } else {
            res.render('registration', {noRegistration: true, message: "Username already taken!"});
          }
        });
      })
    }
  });

  app.post('/saveChallange', function (req, res) {
    mongo.getDb(function (db) {
      db.collection('pending').insertOne(req.body);
    });
    res.status(200);
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
});