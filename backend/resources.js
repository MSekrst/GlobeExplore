'use strict';

var MongoClient = require('mongodb').MongoClient;
var mongo = require('./mongo.json');
var ObjectId = require('mongodb').ObjectID;
var db; //  Database connection -> Singleton design pattern

module.exports = {
  connectToServer: function(callback) {
    MongoClient.connect(mongo.mongoURL, function(err, dbConnection) {
      db = dbConnection;
      return callback(err);
    });
  },

  getDb: function() { //  returns db connection -> always the same one
    return db;
  },

  getObjectId: function() { //  returns db connection -> always the same one
    return ObjectId;
  }
};
