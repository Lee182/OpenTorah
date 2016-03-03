exports.errorHandler = function(err, req, res, next) {
    "use strict";
    if (err) {
      console.error(err.message);
      console.error(err.stack);
      res.status(500);
      res.render('err.jade', { err: err });
    }
    else {next();}
}
