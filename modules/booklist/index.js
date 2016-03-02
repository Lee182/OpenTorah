var booklist = require('./booklist.json')

booklist.getBook = function(q) {
  if (typeof q === 'string') {
    q = q.toLowerCase()
  }
  if ( isFinite(q) && q > 0 ) {
    return BookInfo(this[q-1]) || false
  }
  if (q.length === 3) {
    var b = this.filter(function(book){
      return book.abbr === q
    })[0] || false
    return BookInfo(b)
  }
  if ( q.length > 3 ) {
    var b = this.filter(function(book){
      return book._id === q
    })[0] || false
    return BookInfo(b)
  }
  return false
}
function BookInfo(o) {
  if (typeof o !== "object") {return false}
  var instance = Object.create(BookInfo)
  for (var prop in o) { if (o.hasOwnProperty(prop)) {
    instance[prop] = o[prop]
  }}
  return instance
}
BookInfo.cRange = function cRange(num) {
  if (typeof num === 'string') {num = Number(num)}
  return Number.isInteger(num) &&
         num > 0 &&
         num <= this.c
};
BookInfo.pRange = function cRange(num) {
  if (typeof num === 'string') {num = Number(num)}
  return Number.isInteger(num) &&
         num > 0 &&
         num <= this.p
};

booklist.go = function(obj) {
  var cur = obj.cur
  var nav = obj.nav
  // cur = amo.c4 -10
  // nav = 3 -1, 5 , 10 ... navigation amount
  cur = cur.split('.')
  var char = cur[1].substr(0,1)
  var n = Number(cur[1].substr(1))
  var book = booklist.getBook(cur[0])
  var next = n + nav
  if (book[char +'Range'](next) === true) {
    return book.abbr + '.' + char + next
  }
  else {
    var nxtBook, where;
    var condition = ((book.num - 1)% this.length)
    var cycle = condition < 0 ? 39 + ((0 - 1)% 39) : ((0 - 1)% 39)
    if (next <= 0) {
      if (book.num === 1) {book.num = booklist.length + 1}
      nxtBook = booklist.getBook(book.num - 1)
      nxtBook = nxtBook.abbr + '.' + char + nxtBook[char]
      where = next
    } else {
      if (book.num === booklist.length) {book.num = 0}
      nxtBook = booklist.getBook(book.num + 1).abbr + '.' + char + 1
      where = next - 1- book[char]
    }
    var o = {
      cur: nxtBook,
      nav: where
    }
    return booklist.go(o)
  }
}
module.exports = booklist
