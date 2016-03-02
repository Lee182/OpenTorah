var ReaderDao = require('../dao/reader')
var tankQuery = require('../modules/n/tankQuery.js')
var useApi = require('../modules/n/useApi.js')
function ReaderHandle(db) {
var reader = new ReaderDao(db)

function jsonCb(req,res,next) {
  return function(err, items) {
    if (err) return next(err);
    return res.json(items)
  }
}
this.query = function(req,res,next) {
  req.q = tankQuery(req.params.q) // 'gen.c1' 'exo.p1'
  if (req.q.err) {
    return next(req.q.err)
  }
  // res.append('link', req.q.str)
  if (! useApi(req) ) {
    if (req.params.q !== req.q.str) {
      res.redirect(301, req.q.str)
      return null
    }
  }
  delete req.q.str
  return next()
}
this.parasha = function(req,res,next) {
  console.log(req.q)
  if (req.q.c) { return next() }
  var infolimit = {}
  var callback = function(err, items) {
    if (err) return next(err);
    return res.render('reader', {words: items})
  }
  if ( useApi(req) ) { callback = jsonCb(req,res,next)  }
  var words = req.query.words === 'false' ? false : true
  reader.getParasha({
    book: req.q.book,
    p: req.q.p,
    options: {
      words: words
    },
    infolimit: infolimit,
    callback: callback
  })
}

this.chapter = function(req,res,next) {
  if ( Number.isInteger(Number(req.query.v)) ) { req.q.v = Number(req.query.v)  }
  var infolimit = {}
  var callback;
  callback = function(err, items) {
    if (err) { return next(err) }
    else {res.render('reader', {words: items}); return null}
  }
  if ( useApi(req) ) { callback = jsonCb(req,res,next)  }
  reader.getChapter({
    query: req.q,
    infolimit: infolimit,
    callback: callback
  })
}


}

module.exports = ReaderHandle
