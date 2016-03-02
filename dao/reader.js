function ReaderDao(db) {
var self = this
var tank = db.collection('tank');

this.getChapter = function(o) {
  tank.find(o.query, o.infolimit).sort({_id:1}).toArray(function(err, words){
    if (err) {o.callback(err, null)}
    else {o.callback(err,words)}
  });
}

this.getParasha = function(o) {
  if (o.p === 'all') {
    db.collection('p').find({
      book: o.book,
    },o.infolimit).sort({_id:1}).toArray( function(err, arr){
      dbParshatoArray(err, arr, o)
    });
  }
  else {
    db.collection('p').find({
      book: o.book,
      p: o.p
    },o.infolimit).sort({_id:1}).toArray(function(err, arr){
      dbParshatoArray(err, arr, o)
    });
  }
}
function dbParshatoArray(err, arr, o){
  if (err) {
    o.callback(err, null)
  }
  if (o.options.words) { self.getParashaWords(o, arr) }
  else {
    o.callback(err, arr)
  }
};

this.getParashaWords = function(o,pLoci) {
  var q = { _id:{  } }
  if (pLoci[0]) {
    q._id.$gte = Math.ceil(pLoci[0]._id)
  }
  var limit = pLoci.reduce(function (all,cur,i) {
    all += cur.wordcount
    return all
  },0)
  q.book = pLoci[0].book
  tank.find(q).sort({_id:1}).limit(limit).toArray(function(err, words){
    if (err) { o.callback(err, null) }
    else { o.callback(err, words) }
  });
}

}
module.exports = ReaderDao
