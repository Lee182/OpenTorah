
var trans = document.querySelectorAll('.trans')
for (var i = 0;i < trans.length; i++){
  trans[i].childNodes[0].textContent = removeswigles(trans[i].childNodes[0].textContent);
}

// var heb = document.querySelectorAll('.heb')
// for (var i = 0;i < heb.length; i++){
//   heb[i].childNodes[0].textContent = heb2anc(heb[i].childNodes[0].textContent);
// }

function removeswigles(transStr){
  var words = transStr.split('~')
  var output = []
  for (var x=0; x < words.length; x++) {
    if (words[x] == words[x].toUpperCase()) {
      dotsplit = words[x].split('.')
      for (var y = 0; y < dotsplit.length; y++) {
        dotsplit[y] = Uc2c(dotsplit[y])
      }
      output.push( dotsplit.join('.') )
    }
    else output.push(words[x])
  }
  console.log(output.join(' '))
  return output.join(' ')
}

function Uc2c(str){
  lc = str.toLowerCase().split('')
  lc[0] = lc[0].toUpperCase()
  return ( lc.join('') )
}




function heb2anc(heb){
  heb = shintoSamek(heb);
  var characters = heb.split('');
  for (var x = 0; x < characters.length; x++){
    characters[x] = finalLetterConvertor( characters[x] );
    characters[x] = removeCantilation( characters[x]);
    characters[x] = removeVowels( characters[x]);
  }
  return characters.join('');

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
      "Sin Dot":" ׂ",

      "Hiriq":" ִ",
      "Holam":" ֹ",
    };
    console.log(vowels["Qamats"]);
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
  


  function shintoSamek(heb){
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
