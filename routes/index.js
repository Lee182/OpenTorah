// Dao = "Data Acess Object"
var readerHandle = require('./reader')
var transHandle = require('./trans')

var concordHandle = require('./concord')
var dfnHandle = require('./dfn')
var statsHandle = require('./stats')
var errorHandle = require('./err').errorHandler

var GET = require('../public/js/utils/get.js')
// used by proxy
var tankQuery = require('../modules/n/tankQuery.js')

module.exports = function(app, db) {

  app.use(function (req, res, next) {
    console.log(req.originalUrl)
    // if (req.headers.referer) {console.log(req.headers.referer)}
    next()
  })
  app.get('/', function(req, res, next){
    res.redirect('/reader/amos.c1')
  })

  var concord = new concordHandle(db)
  app.get('/concord/anc/:search', concord.anc)
  app.get('/concord/ancmorph/:search', concord.ancmorph) // not stable need to batch
  // app.get('/concord/eng/:search', concord.eng)
  // app.get('/concord/heb/:search', concord.heb)

  var reader = new readerHandle(db)
  app.get('/reader/:q', [reader.query, reader.parasha, reader.chapter])
  // app.get('/reader/:book', reader.getParasha)
  // app.get('/parasha/:book/:p', reader.getParasha)
  // app.get('/reader/:book/:chapter', reader.chapter)

  var dfn = new dfnHandle(db)
  app.get('/dfn', function(req,res,next){
    res.redirect('/dfn/page/1')
  })
  app.get('/dfn/page/:pnum', dfn.pagenum)
  app.get('/dfn/:word', dfn.oneword)
  app.get('/dfn/count', dfn.count)


  var trans = new transHandle(db)
  app.get('/trans/:vowel', trans.getOneEng)


  app.get('/bibleApi/:path', function(req,res,next){
    var pathe = tankQuery(req.params.path)
    console.log(pathe)
    switch (pathe.book) {
      case 'onesamuel':
        pathe.book = '1 samuel'
      case 'twosamuel':
        pathe.book = '2 samuel'
      case 'twosamuel':
        pathe.book = '2 samuel'
      case 'onekings':
        pathe.book = '1 kings'
      case 'twokings':
        pathe.book = '2 kings'
      case 'onechron':
        pathe.book = '1 chronicles'
      case 'twochron':
        pathe.book = '2 chronicles'
    }
     GET('http://bible-api.com/' + pathe.book + ' ' + pathe.c ).then(function(data) {
       return res.json(data)
     })
  })
  app.get('/*', function(req,res){
    res.status(404).send('I cannot find o\'t about ' + req.originalUrl)
  })

  app.use(errorHandle)

}
