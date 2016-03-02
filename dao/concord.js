function ConcordDao(db) {

var tank = db.collection('tank');
this.getConcordance = function(o) {
  tank.find(o.query, o.infoneeded).sort({'anc':1}).limit(o.limit).skip(o.skip).toArray(function(err, items){
    if (err) { o.callback(err, null)}
    else { o.callback(err,items) }
  });
}

this.getancmorph = function (o) {
  tank.find(o.query, o.infoneeded).toArray(function(err, items){
    if (err) { o.callback(err, null)}
    else { o.callback(err,items) }
  });
}

}
module.exports = ConcordDao
