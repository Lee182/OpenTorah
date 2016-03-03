var booklist = require('../booklist');

var tankQuery = function(str) {
  var bookInfo, char, chunk, defaultNav, limit, obj, q, range;
  defaultNav = 'p';
  obj = {};
  q = str.split('.');
  bookInfo = booklist.getBook(q[0]);
  if (!bookInfo) {
    obj.err = {}
    obj.err.message = 'Book Not found : ' + q[0];
    return obj;
  }
  obj.book = bookInfo._id;
  char = q[1].substr(0, 1);
  chunk = q[1].substr(1);
  if (isFinite(char)) {
    char = defaultNav;
    chunk = q[1];
  }
  // disabling range feature

  // range = chunk.split('-').map(function(i) {
  //   return Number(i);
  // }).sort(function(a, b) {
  //   return a >= b;
  // });
  range = [Number(chunk)]

  if (char === 'p' && range.length === 1) {
    range[1] = range[0];
  }
  if (range.length === 2) {
    limit = 3;
    if (range[0] + limit < range[1]) {
      range[1] = range[0] + limit;
    }
    if (!(bookInfo[char + 'Range'](range[0]))) {
      obj.err = {}
      obj.err.message = 'Invalid range 1';
      obj.c = 1
      return obj
    }
    if (!(bookInfo[char + 'Range'](range[1]))) {
      obj.err = {}
      obj.err.message = 'Invalid range 2'
      obj.c = 1
      return obj;
    }
    obj[char] = {
      $gte: range[0],
      $lte: range[1]
    };
  }
  if (range.length === 1) {
    obj.c = bookInfo.cRange(range[0]) ? range[0] : 1;
  }
  var tail;
  if (typeof obj[char] === 'number') {
    tail = obj[char]
  }
  else if (obj[char].$gte === obj[char].$lte) {
    tail = obj[char].$gte
  }
  else if (obj[char].$gte !== obj[char].$lte) {
    tail = obj[char].$gte +'-'+ obj[char].$lte
  }
  obj.str = bookInfo.abbr + '.'+ char + tail
  return obj;
};

module.exports = tankQuery
