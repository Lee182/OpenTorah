module.exports = function(app, db) {

  var torah = db.collection('torah');
  app.get('/', function (req, res) {
    res.send("This is the root page");
  });

  app.get('/:book', function (req,res) {
    var book = req.params.book;

    torah.find({book: book, c:1}, function(err, docs) {
      if(err) throw err;
      words = docs.sort({_id:1}).toArray(function(err,items) {
        if (err) return callback(err, null);
        if (items) {
          res.render('reader.jade', {words: items} )
          console.log('I got ' + items.length + ' words for you')
        }
      });
    });
  });

  app.get('/:book/:chapter', function (req,res) {
    var book = req.params.book;
    var c = req.params.chapter;
    var v = req.query.v;
    
    var query = {book: book, c: Number(c)}
    if (v) {
      query.v = Number(v)
    }
    torah.find(query, function(err, docs) {
      if(err) throw err;
      words = docs.sort({_id:1}).toArray(function(err,items) {
        if (err) return callback(err, null);
        if (items) {
          res.render('reader.jade', {words: items} )
          console.log('I got ' + items.length + ' words for you')
        }
      });
    });
    //res.send("Sending a request  for " + book + " book" + ". chapter: "+ chap  +" " + v + " word" + w);
  });
  // Error handling middleware

  app.get('*', function(req, res){
      res.send('Page Not Found', 404);
  });
  // app.use(ErrorHandler);
}
