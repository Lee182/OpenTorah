var engTog = (function() {
  var css
  var engtog = document.querySelector('#engtog')
  function load() {
    loadCSS({href: '/styl/reader/engTog.css', disableCSS: true}).then(function(styl) {
      css=styl
    })
    return loadLex = get('http://localhost:5775/data/hebtransylex.json').then(function(res) {
      window.trans = JSON.parse(res)
      return trans
    })
  }
  function init() {
    if (window.trans.length < 100) { load().then(function(trans) {
      window.trans = trans
      translate2Eng(trans)
      setUpControllers()
    })
    }
  }
  function setUpControllers(){
    mixer.engTog = function() { css.disabled = ! css.disabled }
    engtog.addEventListener('click', mixer.engTog)
  }
  function destroy() {
    engtog.removeEventListener('click', mixer.engTog)
  }
  return {
    init: init,
    destroy: destroy
  }
})()
module.exports = engTog

function translate2Eng(trans){
  var words = document.querySelectorAll('.word')
  Array.prototype.forEach.call(words, function(word) {
    var heb = word.querySelector('.heb')
    var vowel = heb.dataset.vowel
    var eng = word.querySelector('.eng')
    if (!vowel) {return}
    if ( trans[vowel] ) {
      eng.textContent = removeswigles(trans[vowel])
    }
    else {
      var vsplit = vowel.split('־')
      if (vsplit.length > 1) {
        eng.textContent = vsplit.reduce(function(str, word) {
          if ( trans[word] ) {
            str +=  removeswigles(trans[word])
          }
          else {str += ''}
          str += ' '
          return str
        },'')
      }
    }
  })
}

function removeswigles(transStr){
  var words = transStr.split('~');
  words = words.map(function(word){
    if (word === word.toUpperCase()) {
      return word.split('.').map(function(item){
        return toCapital(item)
      }).join('.')
    }
    return word
  })
  return words.join(' ')
}

function toCapital(str){
  return str.substr(0,1).toUpperCase() + str.substr(1).toLowerCase()
}
