var w = window
w.mixer = {}
w.loadCSS = require('../lib/loadCSS.js')
w.booklist = require('../../modules/booklist')

w.get = require('./utils/get.js');
w.steamroller = require('./utils/steamroller.js')

w.vnumTog = require('./reader/vnumTog.js')
w.engTog = require('./reader/engTog.js')

loadCSS({href:'http://daneden.github.io/animate.css/animate.min.css'})

function init(){
  console.log('Start init:',new Date())
  vnumTog.init()
  engTog.init()
}
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded')
  init()
})
