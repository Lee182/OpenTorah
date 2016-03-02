function TransDao(db) {
  var trans = db.collection('trans');
  this.getEng = function(o) {
    trans.find({vowel:o.hebvowel}).toArray(function(err, arr){
      if (err) { o.callback(err, null)}
      else { o.callback(err,arr) }
    })
  }
}
module.exports = TransDao
