var fs = require('fs');
var books = ["genesis", "exodus", "leviticus", "numbers","deuteronomy"]

var book = [];
var versedb = [];
// {_id: "1:1", words: [0,10]}
// {_id: {book: 1, c: 1, v: 2}, start: 9830, end: 2319}


var wordcount = 0;
for (var u = 0; u < books.length; u++) {

  var bookName = books[u]

  var text = fs.readFileSync(__dirname + '/booksTxt/' + bookName + '.txt').toString()
  var verses = text.split("\n");

  // {id : {book: "Lev", verseName:"1:1", wordNum:{1}}, heb: "", eng: ""}
  // {id : {book: "Lev", verseName:"1:1", wordNum:{2}}, heb: "", eng: ""}
  // {_id: 3242, verseName:"5:12", num: 3, heb, eng

  for (var i=0; i < verses.length -1; i++) {
    var verse = verses[i].split(" ");
    var verseName = verse.shift();

    // verse table   
    var refv = verseName.split(':')
    var start = wordcount + 1;
    var end = wordcount + verse.length / 2
    var ref = {_id: {book: bookName, c: Number(refv[0]),v: Number(refv[1])}, start: start, end: end}
    
    if (!(ref.c === 0)){
      versedb.push(ref)
      console.log(ref)
    }
    for (var s=0; s < verse.length; s = s + 2) {
      var heb = verse[s];
      var eng = verse[s+1];
      var wordNum = (s/2 + 1);
      wordcount = (wordcount + 1)
      var entry = {_id: wordcount, book: bookName, c: Number(refv[0]), v: Number(refv[1]), w: wordNum, heb: heb, eng: eng}
      if (!((entry.heb == null)||(entry.heb == "")||(entry.heb == undefined))){
        book.push(entry)
      }
    }
  }

}


setTimeout(function() {

  fs.writeFile(__dirname + "/" + "versedb" + ".json", JSON.stringify(versedb), function(err) {
    if (err) throw err;
    console.log("wrote an versedb")
  });

}, 10000)

