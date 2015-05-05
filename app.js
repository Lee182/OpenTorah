var express = require('express');
  var stylus = require('stylus');
    var nib = require('nib');
  //var cookieParser = require('cookie-parser');
  //var bodyParser = require('body-parser');
var app = express();

var routes = require('./routes'); 
var MongoClient = require('mongodb').MongoClient 

MongoClient.connect('mongodb://localhost:27017/reader', function(err, db) {
  // Styles
      function compile(str, path) {
        return stylus(str)
          .set('filename', path)
          .use(nib());
      }
      app.use(stylus.middleware(
        { 
         src: __dirname + '/public', 
         compile: compile
        }
      ))
      app.use(express.static(__dirname + '/public'))
  // Views
    app.set('views', __dirname + '/views')
    app.set('view engine', 'jade')
  
  // Middleware
    //app.use(cookieParser())     // Express middleware to populate 'req.cookies' so we can access cookies
    //app.use(bodyParser.urlencoded({ extended: false }))  // Express middleware to populate 'req.body' so we can access POST variables
    //app.use(bodyParser.json());

  // Routes
    routes(app, db);

  app.listen(5775)
  console.log("Express server running at http://localhost:5775")
});
 
