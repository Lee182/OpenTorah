// effects hebtransylex.json
var fs = require('fs')
var hebkey = process.argv[2]
var eng = process.argv[3]
fs.readFile(__dirname + '/hebtransylex.json', function(err, data) {
  if (err) {return console.error(err)}
  data = JSON.parse(data.toString())
  if (data[hebkey]) {
    console.err('Heb key already exists with value' + '/n  ' + data[hebkey])
    return
  }
  if ( (hebkey && eng)  === false) {
    console.err('process.argv not filled in')
    return
  }
  data[hebkey] = eng
  fs.writeFile('hebtransylex.json', JSON.stringify(data), function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  })
})
