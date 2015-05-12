var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/reader', function(err, db) {
  if(err) throw err;
  var query = {};
  var cursor = db.collection('torah').find(query);
  cursor.each(function(err, doc) {
    if(err) throw err;
    var ancheb = heb2anc(doc.heb)
    var id = doc._id
    db.collection('torah').update({_id:id}, {$set:{anc: ancheb}},function(err, updated) {
        if(err) throw err;
        console.log("Successfully updated " + updated + " documents!");
    });
  });
});

function heb2anc(heb){
  heb = shintoSamek(heb);
  var characters = heb.split('');
  for (var x = 0; x < characters.length; x++){
    characters[x] = finalLetterConvertor( characters[x] );
    characters[x] = removeCantilation( characters[x]);
    characters[x] = removeVowels( characters[x]);
  }
  heb = characters.join('');
  heb = holamhiriqConvertor(heb);
  return heb;

  function holamhiriqConvertor(heb) {
    heb = heb.split('');
    for (var i=0; i<heb.length; i++){
      // holam
      if (heb[i] === "ֹ") {
        if (heb[i-1] === "ו" ) {heb[i] = "";}
        else heb[i] = "ו";
      }
      // hireq
      if (heb[i] === "ִ") {
        if (heb[i+1] === "י") {heb[i] = "";}
        else heb[i] = "י";
      }
    }
    return heb.join('');
  }

  function removeVowels(char) {
    var vowels = { 
      "Sheva":" ְ",
      "Segol":" ֶ",
      "Hatef Segol":" ֱ",
      "Patah":" ַ",
      "Hatef Patah":" ֲ",
      "Qamats":" ָ",
      "Hatef Qamats":" ֳ",
      "Tsere":" ֵ",
      "Qubuts":" ֻ",
      "Dagesh":" ּ",
      "Meteg":" ֽ",
      "Rafe":" ֿ",
      "Shin Dot":" ׁ",
      "Sin Dot":" ׂ"
      //"Hiriq":" ִ",
      //"Holam":" ֹ"
    };
    for (var property in vowels) {
        if (vowels.hasOwnProperty(property)) {
            if (char.charCodeAt() === vowels[property].charCodeAt(1)){ 
              return '';
            }
        }
    }
    return char;
  }


  function removeCantilation(char) {
    var cantillation = " ׄ, ֑, ֒, ֓, ֔, ֕, ֖, ֗, ֘, ֙, ֚, ֛, ֜, ֝, ֞, ֟, ֠, ֡, ֢, ֣, ֤, ֥, ֦, ֧, ֨, ֩, ֪, ֫, ֬, ֭, ֮, ֯".split(',');
    for (var i=0; i < cantillation.length; i++){
      if (char === cantillation[i]){
        return '';
      }
    }
    return char;
  }
  
  function shintoSamek(heb) {
    heb = heb.split('');
    for (var x = 0; x < heb.length; x++){   
      if ((x !== heb.length - 1) && (heb[x] == 'ש')  && (heb[x+1].charCodeAt() == 1474)) {
        heb[x] = 'ס';
        heb[x+1] = '';
     }
    }
    return heb.join('');
  }

  function finalLetterConvertor (char) {
    // calf
    if (char === 'ך'){
      return 'כ';
    }
    // mem
    if (char === 'ם'){
      return 'מ';
    }
    // nun
    if (char === 'ן'){
      return 'נ';
    }
    // Pe
    if (char === 'ף'){
      return 'פ';
    }
    // Tsadi
    if (char === 'ץ'){
      return 'צ';
    }
    return char;
    // letters form http://www.i18nguy.com/unicode/hebrew.html
  }
}
