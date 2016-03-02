tally2letters = function(text) {
  var tally2char = {}
  var words = text.split(' ')
  words.forEach(function(word){
    for (var i=0; i<word.length - 1; i++){
      var chars = word[i] + word[i+1]
      if ( tally2char.hasOwnProperty(chars) ) {
        tally2char[chars]++
      }
      else {
        tally2char[chars] = 1
      }
    }
  })
  return tally2char
}
