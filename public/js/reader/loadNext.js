var url = require('url')

var parentEl = document.querySelector('#scroll')
var loadNext = document.querySelector('#loadNext')
loadNext.addEventListener('click', loadMore)

function loadMore(n) {
  if (! isFinite(n)) {var n = 1}

  var path = url.parse(document.URL).pathname.split('/reader/').join('')
  path = booklist.go({cur:path,nav:n})
  return get( path + '?json=true' ).then(function(data){
    return arr = JSON.parse(data)
  }).then(function(words){
    return steamroller( words.map(contructAndAppend) )
  }).then(function(words){
    // var div = document.createElement('div')
    // div.className = 'slideInUp animated'
    // div.style.display = 'flex'
    // div.style.flexFlow = 'row wrap'
    // div.style.alignContent = 'flex-start'
    // div.style.flexDirection = 'row-reverse'
    vnums = words.filter(function(word){
      return word.className === 'vnum'
    })
    vnums.forEach(function(vnum){
      setTimeout(function(){
        vnum.style.opacity = ''
      },750)
    })
    for (var i = 0; i < words.length; i++) {
      if (n > 0) {
        words[i].className += ' slideInUp animated'
        insert(words[i])
      }
      if (n< 0) {
        words[i].className += ' slideInUp animated'
        parentEl.insertBefore(words[i], parentEl.children[i])
      }
    }
    // insert(div)
  }).then(function(){
    changeHistory(path)
    Ps.update(scrollsa)
  })
}

function contructAndAppend(word) {
  var els = []
  var type = 'constant'

  var div = document.createElement('div')
  div.className = 'word'
  div.id = word._id
  if (word.c === 1 && word.v === 1 && word.w === 1) {
    var title = document.createElement('div')
    title.className = 'title'
    title.id = word.book
    title.textContent = word.book

    els.push(title)
  }
  if (word.w === 1) {

    var vnum = document.createElement('div')
    vnum.className = 'vnum'
    vnum.id = word.book + '.' + 'c' + word.c + '.' + word.v
    var vnuma = document.createElement('a')
    vnuma.href = vnum.id
    vnuma.textContent = word.c + ':' + word.v
    vnum.appendChild(vnuma)

    vnum.style.opacity = 0
    els.push(vnum)
  }

  var heb = document.createElement('div')
  heb.className = 'heb'
  var data = heb.dataset
  data.b=word.book
  data.c=word.c
  data.v=word.v
  data.w=word.w

  if (word.heb === 'פ') {
    div.className += ' para'
    var span = document.createElement('span')
    span.textContent = word.heb
    heb.appendChild(span)
    div.appendChild(heb)
    els.push(div)
  }

  if (word.heb === 'ס') {
    div.className += ' space'
    var span = document.createElement('span')
    span.textContent = word.heb
    heb.appendChild(span)
    div.appendChild(heb)
    els.push(div)
  }
  if (word.heb !== 'פ' && word.heb !== 'ס') {
    data.heb=word.heb
    data.constant=word.constant
    data.vowel=word.vowel
    data.cantnovowel=word.cantnovowel
    data.anc=word.anc
    var span = document.createElement('span')
      var a = document.createElement('a')
      a.href = "/concord/anc/"+word.anc
      a.textContent = word[type]
    span.appendChild(a)
    heb.appendChild(span)
    div.appendChild(heb)
    els.push(div)
  }
  return els
}
function insert(el) {
  parentEl.insertBefore(el, loadNext)
}

function changeHistory(path) {
  var state = { 'path': path };
  var title = booklist.getBook(path.split('.')[0])._id + ' ' + path.split('.')[1]
  var url = path
  document.title = title
  history.pushState(state, title, url);
}
