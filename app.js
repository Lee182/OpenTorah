var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var app = express();
var routes = require('./routes'); 
var MongoClient = require('mongodb').MongoClient 

MongoClient.connect('mongodb://localhost:27017/reader', function(err, db) {

// stylus set up
  function compile(str, path) {
    return stylus(str)
      .set('filename', path)
      .use(nib());
  }
  app.use( stylus.middleware({ 
     src: __dirname + '/public', 
     compile: compile
    }) )
  app.use(express.static(__dirname + '/public'))

// views
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')

// routes
  routes(app, db);

  app.listen(5775)
  console.log("Express server running at http://localhost:5775")
});
