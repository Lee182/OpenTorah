var MongoClient = require('mongodb').MongoClient;
var heb2anc = require('../heb2anc.js');
MongoClient.connect('mongodb://localhost:27017/test', function(err, db){

  db.collection('tank').aggregate([{$group:{_id:{heb:"$heb",morphArray:"$morphArray"}}}], function(err,docs) {
    if (err) throw err
    var set = {}
    if (docs) {
      for (var x=0; x<docs.length; x++) {
        if (docs[x]._id.heb) {
          var heb = docs[x]._id.heb
          var find = {
            heb: heb
          };
          var set = {
            "$set": {
              anc: heb2anc(heb,'anc'),
              constant: heb2anc(heb,'constants'),
              vowel: heb2anc(heb,'vowel'),
              cantnovowel: heb2anc(heb,'cantnovowel')
            }
          };
          if (docs[x]._id.morphArray){
            var morph = docs[x]._id.morphArray
            var ancmorph = []
            for (var i =0; i< morph.length; i++){
              ancmorph[i] = heb2anc(morph[i],'anc');
            }
            find.morph = morph
            set['$set'].ancmorph = ancmorph;
          }
        
          db.collection('tank').update(find, set, {multi: true} ,callback)
        }
      }
    }
  });
});

function callback(err, updated) {
  if(err) throw err;
  console.log("Successfully updated " + updated + " document!");
}
