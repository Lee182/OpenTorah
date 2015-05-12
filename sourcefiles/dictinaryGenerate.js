function removeEmptylines (array){
  var newarray = []
  for (var x= 0; x <array.length; x++){
    if (array[x] !== "") {
      newarray.push(array[x]);
    }
  }
  return newarray;
}
function isHebrew (str){
  return true
}

var fs = require('fs');
var dictionary = fs.readFileSync(__dirname + '/dictionary' + '.txt').toString().split('\n')
var dictArray = removeEmptylines(dictionary);
var str = 'LEAVE.IN.PLACE (Verb) Heb: יצג y.ts.g Def: To put something in a place. {Strong\'s: 3322}'
var entries = []

var template = {  
  dt:'LEAVE.IN.PLACE',
  type: {verb:true},
  heb: "יצג",
  translit: "y.ts.g", 
  dfn: 'To put something in a place.', 
  strongs: [ 3322 ]
}

for (var x=0; x < dictArray.length; x++){
  entry = {type:{}};

// Skip null uns
//  if (x === 2781 || 3467){
//    continue
//  }
// Set types 
  if (x < 2781){
    entry['type']['words'] = true
  }
  if (x > 2781 && x < 3467){
    entry['type']['names'] = true
  }
  if (x > 3467){
    entry['type']['fixes'] = true
  }

// Strongs Number Array generator  
  var strongs = dictArray[x].split(' {Strong\'s: ')
  var word = strongs.shift().split(' ');
  if (strongs[0] === 'n/a}') {
    strongs = ""
  }
  if (strongs.length === 1){
    var swingle = strongs[0].split('')
    swingle.pop()
    strongs[0] = swingle.join('')
  } else if ( strongs.length > 1){
    var swingle = strongs[strongs.length - 1]
    swingle.pop()
    strongs[strongs.length - 1] = swingle.join('')
  }
  var one = []
  for (var i=0; i<strongs.length;i++){
    var arry = strongs[i].split(', ');
    for (var j=0; j<arry.length;j++){
      arry[j] = Number(arry[j]);
    }
    one = arry
  }
  strongs = one;

  if (!(strongs[0] == null)) {
    entry['strongs'] = strongs
  }
  // word dt and hebrew value
  entry.dt = word[0]
  if (word[1] === '(Verb)'){
    entry['type']['verb'] = true
    if (word[2] === 'Heb:'){
      if ( isHebrew(word[3]) ) {
        entry.heb = []
        entry.heb.push({heb: word[3], translit: word[4]})

        if (word[5] === '\\') {
          entry.heb.push({heb: word[6], translit: word[7]})
        }
      }
    }
    for (var y=0; y<word.length; y++){
      if (word[y] === 'Def:'){
        var dfn = []
        for (var z = y + 1; z<word.length; z++){
          dfn.push(word[z])
        }
        entry.dfn = dfn.join(' ');
      }
    }
  }
  else if (word[1] === 'Heb:'){
    if ( isHebrew(word[2]) ) {
      entry.heb = []
      entry.heb.push({heb: word[2], translit: word[3]})

      if (word[4] === '\\') {
        entry.heb.push({heb: word[5], translit: word[6]})
      }
    }
  for (var y=0; y<word.length; y++){
    if (word[y] === 'Def:'){
      var dfn = []
      for (var z = y + 1; z<word.length; z++){
        dfn.push(word[z])
      }
      entry.dfn = dfn.join(' ')
    }
  }

  }
  else {
    for (var y=0; y<word.length; y++){
      if (word[y] === 'Def:'){
        var dfn = []
        for (var z = y + 1; z<word.length; z++){
          dfn.push(word[z])
        }
        entry.dfn = dfn.join(' ');
      }
    }
  }

  if (!(entry.dt === 'Prefixes and Suffixes'|| entry.dt === 'Words' || entry.dt === 'Names')){
      entries.push(entry)
  }
}

setTimeout(function() {

  fs.writeFile(__dirname + "/" + "dictionary" + ".json", JSON.stringify(entries), function(err) {
    if (err) throw err;
    console.log("wrote an dictionary")
  });

}, 10000)
