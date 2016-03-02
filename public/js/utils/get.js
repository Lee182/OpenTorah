var get
if (process.brower) {
  get = function (url, secs) {
    if (!secs){secs = 10000}
    return promise = new Promise(function(done, reject) {
      var req = new XMLHttpRequest()
      req.onload = function() {
        clearTimeout(timer)
        done(req.response)
      };
      req.onerror = function(e) {
        reject(e)
      }
      req.open('get', url, true);
      req.setRequestHeader('Accept', 'application/json');
      req.send();
      var timer = setTimeout(function(){
        reject(new Error((secs / 1000) + ' seconds is way too long'))
      },secs)
    })
  }
}
else {
  var http = require('http')
  var url= require('url')
  get = function(href, secs) {
    href = url.parse(href)
    if (!secs){secs = 10000}
    var options = {
      hostname: href.hostname,
      port: href.port || 80,
      path: href.path || '',
      method: 'GET'
    }
    // var keepAliveAgent = new http.Agent({ keepAlive: true });
    // options.agent = keepAliveAgent;

    return promise = new Promise(function (done, reject) {
      var req = http.request(options, function(res) {
        var str = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          str += chunk
        })
        res.on('end', function() {
          clearTimeout(timer)
          done(str)
        })
      })
      req.on('error', function(err) {
        reject('problem with request: ' + err.message);
      })
      var timer = setTimeout(function(){
        reject('timeout after 10 seconds')
      },secs)
      req.end()
    })
  }
}
module.exports = get

// Usage
// get('http://openlibrary.org/authors/OL1A.json').then(function(res) {
//   console.log(res)
// })
