var TransDao = require('../dao/trans')
var useApi = require('../modules/n/useApi.js')

function jsonCb(req,res,next) {
  return function(err, items) {
    if (err) return next(err);
    return res.json(items)
  }
}

function TransHandle(db) {

var trans = new TransDao(db)

this.getOneEng = function(req,res,next) {
  var vowel = req.params.vowel
  var callback;
  callback = function(err, items) {
    if (err) { return next(err) }
    else { res.render('reader', {words: items}) }
  }
  if ( useApi(req) ) { callback = jsonCb(req,res,next)  }
  trans.getEng({
    hebvowel: vowel,
    callback: callback
  })
}

}
module.exports = TransHandle
