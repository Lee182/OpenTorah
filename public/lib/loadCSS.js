var loadCSS = function({href, parentEl, media, disableCSS}){
  if (!parentEl) {parentEl = document.head}
	if (!disableCSS) {disableCSS = false}

	var css = document.createElement( "link" );
	css.rel = "stylesheet"
	css.href = href
	css.media = "only x";  // temporarily set media to avoid block rendering
  parentEl.appendChild(css)

	// This promise assumes that there won't be an failure
	return promise = new Promise(function(done, err) {
		var onloadcssdefined = function( cb ){
			var sheets = document.styleSheets
			var i = sheets.length
			while( i-- ){
				if( sheets[ i ].href === css.href ){ return cb() }
			}
			setTimeout(function() { onloadcssdefined( cb ) })
		}
		onloadcssdefined(function() {
			css.media = media || "all"
			css.disabled = disableCSS
			done(css)
		})
	})
}
if (module) {
  module.exports = loadCSS
}
if (window) {
  window.loadCSS = loadCSS
}
