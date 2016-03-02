var ws = require("nodejs-websocket")
var TransDao = require('../../dao/trans')

module.exports = function(db) {

var trans = new TransDao(db)

console.log('ws up and running port 8001')
var server = ws.createServer(function (conn) {
  console.log("New connection")
  conn.on("text", function (str) {
      console.log("Received "+str)
      trans.getEng({
        hebvowel: str,
        callback: function(err, arr) {
          console.log('ws callback')
          if (arr && arr[0]) {
            return conn.sendText(str + ' ' + arr[0]._id)
          }
          return conn.sendText('')
        }
      })
  })
  conn.on("close", function (code, reason) {
      console.log("Connection closed")
  })
}).listen(8001)

}
