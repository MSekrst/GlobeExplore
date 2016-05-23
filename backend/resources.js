'use strict';

var MongoClient = require('mongodb').MongoClient;
var mongo = require('./mongo.json');
var db; //  Database connection -> Singleton design pattern

module.exports = {
  connectToServer: function(callback) {
    MongoClient.connect(mongo.mongoURL, function(err, dbConnection) {
      db = dbConnection;
      return callback(err);
    });
  },

  getDb: function(callback) { //  returns db connection -> always the same one
    MongoClient.connect(mongo.mongoURL, function (err, dbConnection) {
      callback(dbConnection);
    })
  }
};
