function jadeStr(str) {
  /* str = `
  .block
    p.l1
      span.l3
    p.l1
  `
  */
  var lines = str.split('\n').filter(function(line){
    return line != ''
  })
  var domarr = []
  var curlevel;
  console.log(lines)
  lines.forEach(function(line) {
    var split = line.split('  ')
    var level = split.length
    var el = jadeEl(split[level-1])
    if ( domarr[domarr.length-1] ){
      var lastDom = domarr[domarr.length-1]
    }
    if (lastDom && lastDom.children[0]) {
      var lastChild = lastDom.children[lastDom.children.length-1]
    }
    if (lastDom && lastDom.children.length === 0) {
      var lastChild = lastDom
    }
    if (level === 1) {
      domarr.push( el )
    }
    if (level === 2) {
      lastDom.appendChild(el)
    }
    if (level === 3) {
      lastDom.children[lastDom.children.length-1].appendChild(el)
    }
    if (level === 4) {
      lastDom.children[lastDom.children.length-1].children[lastDom.children.length-1].appendChild(el)
    }
    if (level === 5) {
      lastDom.children[lastDom.children.length-1].children[lastDom.children.length-1].children[lastDom.children.length-1].appendChild(el)
    }
    // if (level > 1) {
    //   var down = lastChild
    //   console.log(down);
    //   for (var i = 0; i < (level - curlevel); i++) {
    //     console.log(down);
    //     down = down.children[down.children.length - 1]
    //   }
    //   down.appendChild( el )
    // }
    // curlevel = level
  })
  return domarr
}
function jadeEl(str) {
  var tag = "[0-z]+"
  pattern = {}
  pattern.classes = new RegExp('\\.'+tag, "g")
  pattern.ids = new RegExp('#'+tag, "g")
  pattern.tag = new RegExp('^' + tag)

  var tag = str.match(pattern.tag)
  if (tag === null) {
    tag = 'div'
  }

  var ids = str.match(pattern.ids)
  if ( Array.isArray(ids) ){
    ids = ids.map(removeFirstChar)
  }
  var classes = str.match(pattern.classes)
  if ( Array.isArray(classes) ) {
    classes = classes.map(removeFirstChar)
  }
  return makeEl(tag, ids, classes)
}

function removeFirstChar(str) {
  return str.substr(1)
}

function makeEl(tag, ids, classes) {
  var el = document.createElement(tag)
  if ( Array.isArray(ids) ) { ids = ids.join(' ') }
  if ( Array.isArray(classes) ) { classes = classes.join(' ') }
  if (ids){
    el.id = ids
  }
  if (classes) {
    el.className = classes
  }
  return el
}
