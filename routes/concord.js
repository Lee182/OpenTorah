function ConcordHandle (db) {

var ConcordDao = require('../dao/concord');

var concord = new ConcordDao(db);

this.anc = function(req, res, next){
  var anc = req.params.search
  var query = {anc: {$regex: anc}}
  var regex = Boolean(req.query.regex)
  var infoneeded = {}
  if (req.query.infoneeded) {
    infoneeded = JSON.parse(req.query.infoneeded)
  }
  var limit = req.query.limit ? req.query.limit : 0
  var skip = req.query.skip ? req.query.skip : 0

  if (regex === false) {
    query = {anc: anc}
  }
  console.log(query)
  concord.getConcordance({
    query: query,
    infoneeded: infoneeded,
    limit: limit,
    skip: skip,
    callback: function(err, items){
      if (err) { next(err) }
      else { res.send(items) }
    }
  })
}

this.ancmorph = function(req, res, next){
  var anc = req.params.search
  var query = {ancmorph: anc}
  concord.getancmorph({
    query: query,
    infoneeded: {},
    callback: function(err, items){
      if (err) { next(err) }
      else { res.send(items) }
    }
  })
}

this.heb = function(req, res){
  var heb = req.params.search;
  var reg = new RegExp("\\b" + heb + "()?\\b","g")
  var matcher = {$match: {heb: heb}}
  var grouper = {
    $group: {
      _id:"$heb", heb: {$addToSet: "$eng"}, where: {$push: {book: "$book",c:"$c",v:"$v",w:"$w"}}
    }
  }
  torah.aggregate([matcher, grouper], function(err,docs){
    if (err) throw err
    if (docs) {
      console.log(docs[0])
      res.render('EngConcord.jade', {occurs: docs, eng: eng} )
    }
  });
}

this.eng = function(req, res){
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
}

}
module.exports = ConcordHandle;
