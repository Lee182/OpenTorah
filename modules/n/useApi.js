module.exports = function (req) {
  return ( req.subdomains[1] === "api" || Boolean(req.query.json) )
}
