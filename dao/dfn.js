function DfnDao(db) {

var dfn = db.collection('dfn')
var numberperpage = 50

this.getPage = function(o) {
  dfn.find({}).sort({_id:1}).limit(numberperpage).skip(o.pnum * numberperpage).toArray(function(err,words){
    if (err) { o.callback(err, null)}
    else { o.callback(err,words) }
  })
}

this.count = function(o) {
  dfn.find({}).count(function(err, count){
    if (err) { o.callback(err, null)}
    else { o.callback(err,count) }
  })
}

this.oneword = function(o) {
  dfn.find({dt:o.word}).toArray(function(err, word){
    if (err) { o.callback(err, null)}
    else { o.callback(err,word) }
  });
}

}
module.exports = DfnDao
