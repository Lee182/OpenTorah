var loadCSS = require('../../lib/loadCSS.js')
vnumTog = (function() {
  mixer.vnums = {}
  var v = mixer.vnums
  var novnum = document.querySelector('#novnum')
  var byline = document.querySelector('#byline')
  var css;
  function load() {
    return Promise.all( [
      loadCSS({href: '/styl/reader/novnum.css', disableCSS: true}),
      loadCSS({href: '/styl/reader/vnumbyline.css', disableCSS: true})
    ]).then(function(arr){
      css = arr
      return arr
    })
  }
  function init() {
    load().then(setUpControllers)
  }
  function setUpControllers(arr){
      v.none = arr[0];
      v.line = arr[1];
      v.controller = {
        defaults: function(){
          v.none.disabled = false
          v.line.disabled = false
        },
        novnum: function() { v.none.disabled = ! v.none.disabled },
        byline: function(){ v.line.disabled = ! v.line.disabled }
      }
      // bind events
      novnum.addEventListener('click', v.controller.novnum)
      byline.addEventListener('click', v.controller.byline)
    }
  function destroy() {
    novnum.removeEventListener('click', v.controller.novnum)
    byline.removeEventListener('click', v.controller.byline)
    css.forEach(function(s){
      s.remove()
    })
  }
  return {
    init: init,
    destroy: destroy
  }
})()
module.exports = vnumTog
