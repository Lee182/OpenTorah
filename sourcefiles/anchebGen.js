var MongoClient = require('mongodb').MongoClient;
var heb2anc = require('../heb2anc.js');

MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
  if(err) throw err;
  var query = {};
  var cursor = db.collection('tank').find(query);
  cursor.each(function(err, doc) {
    if(err) throw err;
    var set = {};
    var id = 1093819038;
    if(doc) {
      var heb = doc.heb;
      id = doc['_id'];
      var anc = heb2anc(heb,'anc');
      var constant = heb2anc(heb,'constants');
      var vowel = heb2anc(heb,'vowel');
      var cantnovowel = heb2anc(heb,'cantnovowel');
      set = {
        "$set": {
          anc: anc,
          constant: constant,
          vowel: vowel,
          cantnovowel: cantnovowel
        }
      };
      if (doc.morphArray){
        ancmorph = []
        morph = doc.morphArray
        for (var i =0; i< morph.length; i++){
          ancmorph[i] = heb2anc(morph[i],'anc');
        }
        set['$set'].ancmorph = ancmorph;
      }
     console.log(set);
     db.collection('tank').update({_id: id}, set,function(err, updated) {
        if(err) throw err;
        console.log("Successfully updated " + updated + " document!");
      });
    }
    
 
  });
});
