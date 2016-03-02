function DfnHandle(db) {

var DfnDao = require('../dao/dfn');
var dfn = new DfnDao(db);

function useApi(req) {
  return req.subdomains[1] === "api" || Boolean(req.query.json)
}

this.pagenum = function(req,res,next) {
  if ( ! Number(req.params.pnum) ) {res.redirect('/dfn/page/1'); return null;}
  var pnum =  Number(req.params.pnum)
  var callback;
  callback = function(err, items) {
    if (err) return next(err);
    return res.render('dictionary1.jade',{dfns: items})
  }
  if ( useApi(req) ) {
    callback = function (err,items) {
      if (err) return next(err);
      return res.json(items)
    }
  }

  dfn.getPage({
    pnum: pnum,
    callback: callback
  })
}

this.oneword = function(req,res,next){
  var word = req.params.word
  var callback;
  callback = function(err, items) {
    if (err) return next(err);
    return res.render('dictionary1.jade',{dfns: items})
  }
  if ( useApi(req) ) {
    callback = function (err,items) {
      if (err) return next(err);
      return res.json(items)
    }
  }

  dfn.oneword({
    word: word,
    callback: callback
  })

}

this.count = function(req,res,next) {
  dfn.count({
    callback: function(err,num) {
      if (err) return next(err);
      return res.send(num)
    }
  })
}

}

module.exports = DfnHandle
