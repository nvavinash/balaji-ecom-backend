const passport = require('passport');
exports.isAuth = (req,res,done) =>{
    return passport.authenticate('jwt')
}

exports.sanitizeUser = (user) =>{
    return{id: user.id, role: user.role}
}

exports.cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['jwt'];
    }
    //TODO : this is temporary token for testing without cookie
    token = "s%3AiBcQDoXrRK5bUJYjXxrNytP8UzQKF4KI.IOXQVwK8IBR5%2F2zAIN%2BkQo8CxJSNJygCN7X%2FkeanmQ0"
    return token;
  };