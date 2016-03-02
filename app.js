var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var directions = require('./directions');
var wsdirect = require('./directions/ws');
var MongoClient = require('mongodb').MongoClient
var path = require('path');

var port =   process.argv[2] !== undefined ? process.argv[2] : 5775;
var app = express()

MongoClient.connect('mongodb://localhost:27017/opent', function(err, db) {
  app.use( stylus.middleware({
     src: __dirname + '/public',
     compile: function compile(str, path) {
       return stylus(str).set('filename', path).use(nib());
     }
   }) )
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(express.static(__dirname + '/public'));

  directions(app, db);

  app.listen(port)
  console.log("Server started at " + "http://localhost:"+ port)
});

// MongoClient.connect('mongodb://localhost:27017/opent', function(err, db) {
//   wsdirect(db)
// });
