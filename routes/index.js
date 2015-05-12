module.exports = function(app, db) {

  var torah = db.collection('torah');
  var dfn = db.collection('dfn');
  app.get('/', function (req, res) {
    res.render('howto.jade');
  });

  app.get('/ancConcord/:heb', function(req,res){
    var hebtype = "heb"
    if (req.query.hebtype) {
      hebtype = req.query.hebtype
    }
    var anc = req.params.heb
    torah.find({anc: {$regex: anc}},function(err, docs){
      if (err) throw err;
      docs.toArray(function(err, items){
        if (items) {
          res.render('reader.jade', {words: items, hebtype: hebtype} )
        }
      });
    });
  });

  app.get('/EngConcord/:eng', function(req, res){
    var eng = req.params.eng;
    console.log(eng)
    var reg = new RegExp("\\b" + eng + "()?\\b","g")
    var matcher = {$match: {eng: {$regex: reg}}}
    var grouper = { 
      $group: {
        _id:{eng:"$eng"}, heb: {$addToSet: "$heb"}, where: {$push: {book: "$book",c:"$c",v:"$v",w:"$w"}}
      }
    }
    torah.aggregate([matcher, grouper], function(err,docs){
      if (err) throw err
      if (docs) {
        console.log(docs[0])
        res.render('EngConcord.jade', {occurs: docs, eng: eng} )
      }
    });
  });

  app.get('/HebConcord/:heb', function(req, res){
    var eng = req.params.heb;
    console.log(eng)
    var reg = new RegExp("\\b" + eng + "()?\\b","g")
    var matcher = {$match: {heb: eng}}
    var grouper = { 
      $group: {
        _id:{eng:"$heb"}, heb: {$addToSet: "$eng"}, where: {$push: {book: "$book",c:"$c",v:"$v",w:"$w"}}
      }
    }
    torah.aggregate([matcher, grouper], function(err,docs){
      if (err) throw err
      if (docs) {
        console.log(docs[0])
        res.render('EngConcord.jade', {occurs: docs, eng: eng} )
      }
    });
  });

  app.get('/dfn', function(req,res){
    dfn.find({},function(err, dfns){
      if (err) throw err;
      if (dfns) {
        dfns.toArray(function(err, items){
          if (items){
            res.render('dictionary.jade', {dfns: items})
          }
        });
      }
    });
  });
  app.get('/dfn/:word', function(req,res){
    var word = req.params.word
    dfn.find({dt:word},function(err, dfns){
      if (err) throw err;
      if (dfns) {
        dfns.toArray(function(err, items){
          if (items){
            res.render('dictionary1.jade', {dfns: items})
          }
        });
      }
    });
  });
/*
    torah.find(matcher, function(err, docs) {
      if(err) throw err;
      words = docs.sort({_id:1}).toArray(function(err,items) {
        if (err) return callback(err, null);
        if (items) {
          res.render('reader.jade', {words: items} )
          console.log('I got ' + items[0] + ' words for you')
        }
      });
    });
*/

  app.get('/:book', function (req,res) {
    var book = req.params.book;
    var c = 1;
    res.redirect('/'+ book + '/' + c);
    if (req.query.hebtype) {
      res.redirect('/'+ book + '/' + c + '?hebtype=' + req.query.hebtype);
    }
  });

  app.get('/:book/:chapter', function (req,res) {
    var hebtype = "heb"
    if (req.query.hebtype) {
      hebtype = req.query.hebtype
    }
    var book = req.params.book;
    var c = req.params.chapter;
    var v = req.query.v;
    if (req.query.c) {
      res.redirect('/'+ book + '/'+req.query.c);
    }
    var query = {book: book, c: Number(c)}
    if (v) {
      query.v = Number(v)
    }
    torah.find(query, function(err, docs) {
      if(err) throw err;
      words = docs.sort({_id:1}).toArray(function(err,items) {
        if (err) return callback(err, null);
        if (items.length > 0) {
          res.render('reader.jade', {words: items, verse:v, hebtype: hebtype} )
        }
        else  res.status(404).send("Opps we couldn't find book " + book)
      });
    });
  });
}
