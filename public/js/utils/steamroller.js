var steamroller = function(arr) {
  var ans = []
  arr.forEach(function(ar){
    if ( Array.isArray(ar) ) { ans = ans.concat( steamroller(ar) ) }
    else { ans.push(ar) }
  })
  return ans
}

module.exports = steamroller
