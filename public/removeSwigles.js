var trans = document.querySelectorAll('.trans span a');
for (var i = 0;i < trans.length; i++){
  trans[i].innerHTML = removeswigles(trans[i].childNodes[0].textContent);
}

// var heb = document.querySelectorAll('.heb');
//for (var i = 0;i < heb.length; i++){
//   heb[i].childNodes[0].textContent = heb2anc(heb[i].childNodes[0].textContent);
//}

function removeswigles(transStr){
  var words = transStr.split('~');
  var href = words;
  var links = [];
  var output = [];
  for (var x=0; x < words.length; x++) {
    if (words[x] == words[x].toUpperCase()) {
      var dotsplit = words[x].split('.');
      for (var y = 0; y < dotsplit.length; y++) {
        dotsplit[y] = Uc2c(dotsplit[y]);
      }
      output.push( dotsplit.join('.') );
    }
    else output.push(words[x]);
  }
  console.log(output.join(' '));
 
  for (var j=0; j< href.length; j++){
     var htmla = '<a href="/dfn/' + href[j] + '">' + output[j] + "</a>";
     links.push(htmla);
  }
  console.log(links.join(' '));
  return links.join(' ');
}

function Uc2c(str){
  var lc = str.toLowerCase().split('');
  lc[0] = lc[0].toUpperCase();
  return ( lc.join('') );
}
